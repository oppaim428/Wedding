from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import bcrypt
import jwt
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import aiofiles

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'wooowinvites')]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'wooowinvites-secret-key-2026')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# File upload directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ============ MODELS ============

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
    token: str
    email: str

class CoupleData(BaseModel):
    bride: str = ""
    groom: str = ""
    brideFullName: str = ""
    groomFullName: str = ""
    hashtag: str = ""

class InvitationText(BaseModel):
    line1: str = "You are invited for our special day"
    line2: str = "We are getting married"
    line3: str = "Please join us to celebrate"

class EventData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    date: str = ""
    time: str = ""
    venue: str = ""
    address: str = ""
    mapLink: str = ""
    icon: str = "heart"

class StoryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    date: str = ""
    description: str = ""
    image: str = ""

class GalleryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str = ""
    alt: str = ""

class RSVPConfig(BaseModel):
    title: str = "RSVP"
    subtitle: str = ""
    fields: List[str] = ["name", "email", "guests", "attending", "message"]

class FooterData(BaseModel):
    message: str = ""
    credit: str = "Made with love"

class TranslationData(BaseModel):
    lang: str = "en"
    translations: Dict[str, str] = {}

class InviteData(BaseModel):
    slug: str = ""
    design_id: str = ""
    couple: CoupleData = CoupleData()
    date: str = ""
    tagline: str = ""
    invitation: InvitationText = InvitationText()
    openingVideo: str = ""
    openingPoster: str = ""
    heroBackground: str = ""
    music: str = ""
    story: List[StoryItem] = []
    events: List[EventData] = []
    gallery: List[GalleryItem] = []
    rsvpQuestions: RSVPConfig = RSVPConfig()
    footer: FooterData = FooterData()
    languages: List[str] = ["en"]
    translations: Dict[str, Dict[str, str]] = {}
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class InviteUpdate(BaseModel):
    couple: Optional[CoupleData] = None
    date: Optional[str] = None
    tagline: Optional[str] = None
    invitation: Optional[InvitationText] = None
    design_id: Optional[str] = None
    openingVideo: Optional[str] = None
    openingPoster: Optional[str] = None
    heroBackground: Optional[str] = None
    music: Optional[str] = None
    story: Optional[List[StoryItem]] = None
    events: Optional[List[EventData]] = None
    gallery: Optional[List[GalleryItem]] = None
    rsvpQuestions: Optional[RSVPConfig] = None
    footer: Optional[FooterData] = None
    languages: Optional[List[str]] = None
    translations: Optional[Dict[str, Dict[str, str]]] = None

class DesignData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    thumbnail: str = ""
    heroBackground: str = ""
    openingVideo: str = ""
    openingPoster: str = ""
    cssVars: Dict[str, str] = {}
    isActive: bool = True
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class DesignCreate(BaseModel):
    name: str
    description: str = ""
    thumbnail: str = ""
    heroBackground: str = ""
    openingVideo: str = ""
    openingPoster: str = ""
    cssVars: Dict[str, str] = {}

class RSVPSubmit(BaseModel):
    invite_slug: str
    name: str
    email: str = ""
    attending: str = "yes"
    guests: int = 1
    message: str = ""

class RSVPResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    invite_slug: str
    name: str
    email: str = ""
    attending: str = "yes"
    guests: int = 1
    message: str = ""
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class LanguageData(BaseModel):
    code: str
    name: str
    flag: str = ""
    rtl: bool = False

# ============ AUTH HELPERS ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(email: str) -> str:
    payload = {
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get('email')
        admin = await db.admins.find_one({'email': email})
        if not admin:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ SEED DATA ============

async def seed_admin():
    existing = await db.admins.find_one({'email': 'creanadi@gmail.com'})
    if not existing:
        await db.admins.insert_one({
            'email': 'creanadi@gmail.com',
            'password': hash_password('123456'),
            'created_at': datetime.utcnow().isoformat()
        })
        logger.info("Admin user seeded")

async def seed_default_design():
    count = await db.designs.count_documents({})
    if count == 0:
        default_design = {
            'id': 'sacred-ivory-heritage',
            'name': 'Sacred Ivory Heritage',
            'description': 'An elegant Indian heritage theme with ornate temple arch, brass bells, jasmine garlands, and warm golden tones.',
            'thumbnail': 'https://customer-assets.emergentagent.com/job_wooow-invites-fork/artifacts/t6uutbzt_1775719321162.png',
            'heroBackground': 'https://customer-assets.emergentagent.com/job_wooow-invites-fork/artifacts/9bnub1dk_Screenshot_20260409-084905_Chrome.jpg',
            'openingVideo': 'https://customer-assets.emergentagent.com/job_wooow-invites-fork/artifacts/di63cj2k_opening-animation-1775564002494.mp4',
            'openingPoster': 'https://customer-assets.emergentagent.com/job_wooow-invites-fork/artifacts/t6uutbzt_1775719321162.png',
            'cssVars': {
                'primaryBg': '#f5f0e6',
                'primaryText': '#2c2417',
                'accentColor': '#8B7355',
                'accentLight': 'rgba(139,115,85,0.15)',
                'cardBg': '#faf7f0',
                'sectionBg': '#f0e8d8',
                'footerBg': '#2c2417'
            },
            'isActive': True,
            'created_at': datetime.utcnow().isoformat()
        }
        await db.designs.insert_one(default_design)
        logger.info("Default design seeded")

async def seed_default_invite():
    count = await db.invites.count_documents({})
    if count == 0:
        default_invite = {
            'slug': 'demo',
            'design_id': 'sacred-ivory-heritage',
            'couple': {
                'bride': 'Manon',
                'groom': 'Yassine',
                'brideFullName': 'Manon Dupont',
                'groomFullName': 'Yassine El Amrani',
                'hashtag': '#YassineAndManon'
            },
            'date': '2026-05-27T18:00:00',
            'tagline': 'We Are Getting Married',
            'invitation': {
                'line1': 'You are invited for our special day',
                'line2': 'We are getting married',
                'line3': 'Please join us to celebrate'
            },
            'openingVideo': 'https://customer-assets.emergentagent.com/job_wooow-invites-fork/artifacts/di63cj2k_opening-animation-1775564002494.mp4',
            'openingPoster': 'https://customer-assets.emergentagent.com/job_wooow-invites-fork/artifacts/t6uutbzt_1775719321162.png',
            'heroBackground': 'https://customer-assets.emergentagent.com/job_wooow-invites-fork/artifacts/9bnub1dk_Screenshot_20260409-084905_Chrome.jpg',
            'music': '',
            'story': [
                {'id': '1', 'title': 'How We Met', 'date': 'March 2021', 'description': 'It was a beautiful spring afternoon when our paths crossed at a café in Paris.', 'image': 'https://images.unsplash.com/photo-1639330926658-2d8b2b584a88?w=400&h=400&fit=crop'},
                {'id': '2', 'title': 'First Date', 'date': 'April 2021', 'description': 'Our first official date was a walk along the Seine at sunset.', 'image': 'https://images.unsplash.com/photo-1639330945576-8ce15e5920f2?w=400&h=400&fit=crop'},
                {'id': '3', 'title': 'The Proposal', 'date': 'November 2025', 'description': 'Under a canopy of stars in Marrakech, Yassine got down on one knee.', 'image': 'https://images.unsplash.com/photo-1639331309653-5d3dc5e1486b?w=400&h=400&fit=crop'}
            ],
            'events': [
                {'id': '1', 'title': 'Henna Ceremony', 'date': 'May 25, 2026', 'time': '4:00 PM', 'venue': 'Riad Al Jazira', 'address': '12 Rue de la Kasbah, Marrakech', 'mapLink': 'https://maps.google.com/?q=Marrakech+Riad', 'icon': 'palette'},
                {'id': '2', 'title': 'Wedding Ceremony', 'date': 'May 27, 2026', 'time': '6:00 PM', 'venue': 'La Mamounia Gardens', 'address': 'Avenue Bab Jdid, Marrakech', 'mapLink': 'https://maps.google.com/?q=La+Mamounia+Marrakech', 'icon': 'heart'},
                {'id': '3', 'title': 'Reception', 'date': 'May 27, 2026', 'time': '8:30 PM', 'venue': 'Royal Mansour Ballroom', 'address': 'Rue Abou Abbas El Sebti, Marrakech', 'mapLink': 'https://maps.google.com/?q=Royal+Mansour+Marrakech', 'icon': 'music'}
            ],
            'gallery': [
                {'id': '1', 'url': 'https://images.pexels.com/photos/19950472/pexels-photo-19950472.jpeg?w=400&h=500&fit=crop', 'alt': 'Couple portrait'},
                {'id': '2', 'url': 'https://images.unsplash.com/photo-1639330926658-2d8b2b584a88?w=400&h=500&fit=crop', 'alt': 'Engagement photo'},
                {'id': '3', 'url': 'https://images.unsplash.com/photo-1639330945576-8ce15e5920f2?w=400&h=500&fit=crop', 'alt': 'Pre-wedding'},
                {'id': '4', 'url': 'https://images.unsplash.com/photo-1639331309653-5d3dc5e1486b?w=400&h=500&fit=crop', 'alt': 'Bridal portrait'},
                {'id': '5', 'url': 'https://images.unsplash.com/photo-1639331813978-3daea633111c?w=400&h=500&fit=crop', 'alt': 'Garden photo'},
                {'id': '6', 'url': 'https://images.unsplash.com/photo-1581720848095-2b72764b08a2?w=400&h=500&fit=crop', 'alt': 'Floral setup'}
            ],
            'rsvpQuestions': {'title': 'RSVP', 'subtitle': 'Kindly respond by April 15, 2026', 'fields': ['name', 'email', 'guests', 'attending', 'message']},
            'footer': {'message': "We can't wait to celebrate with you!", 'credit': 'Made with love'},
            'languages': ['en', 'fr', 'ar'],
            'translations': {
                'fr': {
                    'tagline': 'Nous Nous Marions',
                    'invitation.line1': 'Vous êtes invité à notre jour spécial',
                    'invitation.line2': 'Nous nous marions',
                    'countdown.title': 'Notre Grand Jour',
                    'countdown.subtitle': 'Compte à rebours',
                    'story.title': 'Notre Histoire',
                    'story.subtitle': 'Notre Parcours',
                    'events.title': 'Événements',
                    'events.subtitle': 'Rejoignez-nous',
                    'gallery.title': 'Galerie',
                    'gallery.subtitle': 'Moments Capturés',
                    'rsvp.title': 'RSVP',
                    'rsvp.subtitle': 'Veuillez répondre avant le 15 avril 2026',
                    'rsvp.accept': 'Accepter avec joie',
                    'rsvp.decline': 'Décliner avec regret',
                    'rsvp.submit': 'Envoyer RSVP',
                    'footer.message': 'Nous avons hâte de célébrer avec vous!',
                    'tap_to_open': 'Appuyez pour ouvrir',
                    'invited_text': 'Vous êtes invité à notre jour spécial'
                },
                'ar': {
                    'tagline': 'نحن نتزوج',
                    'invitation.line1': 'أنتم مدعوون ليومنا المميز',
                    'invitation.line2': 'نحن نتزوج',
                    'countdown.title': 'يومنا الكبير',
                    'countdown.subtitle': 'العد التنازلي',
                    'story.title': 'قصة حبنا',
                    'story.subtitle': 'رحلتنا',
                    'events.title': 'المناسبات',
                    'events.subtitle': 'انضموا إلينا',
                    'gallery.title': 'معرض الصور',
                    'gallery.subtitle': 'لحظات ثمينة',
                    'rsvp.title': 'تأكيد الحضور',
                    'rsvp.subtitle': 'يرجى الرد قبل 15 أبريل 2026',
                    'rsvp.accept': 'نقبل بسعادة',
                    'rsvp.decline': 'نعتذر عن الحضور',
                    'rsvp.submit': 'إرسال',
                    'footer.message': 'نتطلع للاحتفال معكم!',
                    'tap_to_open': 'اضغط للفتح',
                    'invited_text': 'أنتم مدعوون ليومنا المميز'
                }
            },
            'created_at': datetime.utcnow().isoformat()
        }
        await db.invites.insert_one(default_invite)
        logger.info("Default invite seeded")

async def seed_languages():
    count = await db.languages.count_documents({})
    if count == 0:
        langs = [
            {'code': 'en', 'name': 'English', 'flag': '🇬🇧', 'rtl': False},
            {'code': 'fr', 'name': 'Français', 'flag': '🇫🇷', 'rtl': False},
            {'code': 'ar', 'name': 'العربية', 'flag': '🇲🇦', 'rtl': True},
            {'code': 'es', 'name': 'Español', 'flag': '🇪🇸', 'rtl': False},
            {'code': 'de', 'name': 'Deutsch', 'flag': '🇩🇪', 'rtl': False},
            {'code': 'it', 'name': 'Italiano', 'flag': '🇮🇹', 'rtl': False},
            {'code': 'pt', 'name': 'Português', 'flag': '🇵🇹', 'rtl': False},
            {'code': 'tr', 'name': 'Türkçe', 'flag': '🇹🇷', 'rtl': False},
            {'code': 'hi', 'name': 'हिन्दी', 'flag': '🇮🇳', 'rtl': False},
            {'code': 'zh', 'name': '中文', 'flag': '🇨🇳', 'rtl': False},
        ]
        await db.languages.insert_many(langs)
        logger.info("Languages seeded")

# ============ ROUTES ============

# --- Auth ---
@api_router.post("/auth/login")
async def admin_login(data: AdminLogin):
    admin = await db.admins.find_one({'email': data.email})
    if not admin or not verify_password(data.password, admin['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(data.email)
    return {"token": token, "email": data.email}

# --- Invite (Public) ---
@api_router.get("/invite/{slug}")
async def get_invite(slug: str):
    invite = await db.invites.find_one({'slug': slug}, {'_id': 0})
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    # Also fetch the design
    if invite.get('design_id'):
        design = await db.designs.find_one({'id': invite['design_id']}, {'_id': 0})
        invite['design'] = design
    return invite

# --- Invite (Admin) ---
@api_router.get("/admin/invites")
async def list_invites(admin=Depends(get_current_admin)):
    invites = await db.invites.find({}, {'_id': 0}).to_list(100)
    return invites

@api_router.post("/admin/invites")
async def create_invite(data: InviteData, admin=Depends(get_current_admin)):
    if not data.slug:
        data.slug = str(uuid.uuid4())[:8]
    existing = await db.invites.find_one({'slug': data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    await db.invites.insert_one(data.dict())
    return {"message": "Invite created", "slug": data.slug}

@api_router.put("/invite/{slug}")
async def update_invite(slug: str, data: InviteUpdate, admin=Depends(get_current_admin)):
    invite = await db.invites.find_one({'slug': slug})
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if update_data:
        # Convert nested pydantic models to dicts
        for key in update_data:
            if hasattr(update_data[key], 'dict'):
                update_data[key] = update_data[key].dict() if hasattr(update_data[key], 'dict') else update_data[key]
        await db.invites.update_one({'slug': slug}, {'$set': update_data})
    updated = await db.invites.find_one({'slug': slug}, {'_id': 0})
    return updated

@api_router.delete("/admin/invites/{slug}")
async def delete_invite(slug: str, admin=Depends(get_current_admin)):
    result = await db.invites.delete_one({'slug': slug})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Invite not found")
    return {"message": "Invite deleted"}

# --- Designs ---
@api_router.get("/designs")
async def list_designs():
    designs = await db.designs.find({'isActive': True}, {'_id': 0}).to_list(100)
    return designs

@api_router.get("/designs/{design_id}")
async def get_design(design_id: str):
    design = await db.designs.find_one({'id': design_id}, {'_id': 0})
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    return design

@api_router.post("/admin/designs")
async def create_design(data: DesignCreate, admin=Depends(get_current_admin)):
    design_doc = {
        'id': str(uuid.uuid4())[:8],
        **data.dict(),
        'isActive': True,
        'created_at': datetime.utcnow().isoformat()
    }
    await db.designs.insert_one(design_doc)
    return {"message": "Design created", "id": design_doc['id']}

@api_router.put("/admin/designs/{design_id}")
async def update_design(design_id: str, data: dict, admin=Depends(get_current_admin)):
    design = await db.designs.find_one({'id': design_id})
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    # Remove _id if present
    data.pop('_id', None)
    data.pop('id', None)
    await db.designs.update_one({'id': design_id}, {'$set': data})
    updated = await db.designs.find_one({'id': design_id}, {'_id': 0})
    return updated

@api_router.delete("/admin/designs/{design_id}")
async def delete_design(design_id: str, admin=Depends(get_current_admin)):
    result = await db.designs.delete_one({'id': design_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Design not found")
    return {"message": "Design deleted"}

# --- RSVP ---
@api_router.post("/rsvp")
async def submit_rsvp(data: RSVPSubmit):
    rsvp = RSVPResponse(
        invite_slug=data.invite_slug,
        name=data.name,
        email=data.email,
        attending=data.attending,
        guests=data.guests,
        message=data.message
    )
    await db.rsvp_responses.insert_one(rsvp.dict())
    return {"message": "RSVP submitted successfully"}

@api_router.get("/rsvp")
async def list_rsvp(invite_slug: str = None, admin=Depends(get_current_admin)):
    query = {}
    if invite_slug:
        query['invite_slug'] = invite_slug
    responses = await db.rsvp_responses.find(query, {'_id': 0}).sort('created_at', -1).to_list(1000)
    return responses

# --- Languages ---
@api_router.get("/languages")
async def list_languages():
    languages = await db.languages.find({}, {'_id': 0}).to_list(100)
    return languages

@api_router.post("/admin/languages")
async def add_language(data: LanguageData, admin=Depends(get_current_admin)):
    existing = await db.languages.find_one({'code': data.code})
    if existing:
        raise HTTPException(status_code=400, detail="Language already exists")
    await db.languages.insert_one(data.dict())
    return {"message": "Language added"}

# --- File Upload ---
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), admin=Depends(get_current_admin)):
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1] if file.filename else '.jpg'
    filename = f"{uuid.uuid4()}{ext}"
    filepath = UPLOAD_DIR / filename

    async with aiofiles.open(filepath, 'wb') as f:
        content = await file.read()
        await f.write(content)

    # Return the URL
    file_url = f"/api/uploads/{filename}"
    return {"url": file_url, "filename": filename}

# --- Serve uploads ---
@api_router.get("/")
async def root():
    return {"message": "WoooW Invites API"}

# Include router
app.include_router(api_router)

# Serve uploaded files
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await seed_admin()
    await seed_default_design()
    await seed_default_invite()
    await seed_languages()
    logger.info("Database seeded successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
