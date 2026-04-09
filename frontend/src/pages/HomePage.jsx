import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Globe, Menu, X, ArrowRight, Heart, ExternalLink, Palette, Type, Sparkles, LogIn, ChevronLeft, MessageCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Mock designs data for the grid (will be merged with DB designs)
const mockDesigns = [
  { id: 'sacred-ivory', name: 'Sacred Ivory Heritage', category: 'wedding', popular: true, thumbnail: 'https://customer-assets.emergentagent.com/job_wooow-invites-fork/artifacts/t6uutbzt_1775719321162.png', demoSlug: 'demo' },
  { id: 'romantic-garden', name: 'Romantic Garden', category: 'wedding', popular: true, thumbnail: 'https://images.unsplash.com/photo-1708077809012-4740dd43bd53?w=500&h=700&fit=crop', demoSlug: 'demo' },
  { id: 'flowery-border', name: 'Flowery Border', category: 'wedding', popular: false, thumbnail: 'https://images.unsplash.com/photo-1684243920725-956d93ff391a?w=500&h=700&fit=crop', demoSlug: 'demo' },
  { id: 'elegant-minimal', name: 'Elegant Minimal', category: 'wedding', popular: false, thumbnail: 'https://images.unsplash.com/photo-1732649124686-3bab54f79aa3?w=500&h=700&fit=crop', demoSlug: 'demo' },
  { id: 'floral-classic', name: 'Floral Classic', category: 'wedding', popular: true, thumbnail: 'https://images.unsplash.com/photo-1632610992723-82d7c212f6d7?w=500&h=700&fit=crop', demoSlug: 'demo' },
  { id: 'stationery-suite', name: 'Stationery Suite', category: 'wedding', popular: false, thumbnail: 'https://images.unsplash.com/photo-1721176487015-5408ae0e9bc2?w=500&h=700&fit=crop', demoSlug: 'demo' },
  { id: 'modern-invite', name: 'Modern Invitation', category: 'birthday', popular: false, thumbnail: 'https://images.unsplash.com/photo-1656104717095-9d062b0d4e8d?w=500&h=700&fit=crop', demoSlug: 'demo' },
  { id: 'baby-pastel', name: 'Pastel Dreams', category: 'babyshower', popular: false, thumbnail: 'https://images.unsplash.com/photo-1639330926658-2d8b2b584a88?w=500&h=700&fit=crop', demoSlug: 'demo' },
];

const categories = [
  { id: 'all', label: { en: 'All', fr: 'Tous', ar: 'الكل', es: 'Todos' } },
  { id: 'wedding', label: { en: 'Wedding', fr: 'Mariage', ar: 'زفاف', es: 'Boda' } },
  { id: 'birthday', label: { en: 'Birthday', fr: 'Anniversaire', ar: 'عيد ميلاد', es: 'Cumpleaños' } },
  { id: 'babyshower', label: { en: 'Baby Shower', fr: 'Baby Shower', ar: 'حفل المولود', es: 'Baby Shower' } },
  { id: 'custom', label: { en: 'Custom', fr: 'Personnalisé', ar: 'مخصص', es: 'Personalizado' } },
];

const translations = {
  en: {
    backHome: 'Back to Home',
    badge: '34+ Beautiful Themes',
    heroTitle: 'Find Your Perfect Theme',
    heroDesc: 'This is the opening animation your guests see when they open your custom-made envelope with your initials — designed to stun from the very first moment. Every text, color, and detail is fully customizable. Pick your vibe, and once you have an account you can switch themes anytime to find the perfect match for your celebration.',
    feat1: 'Custom colors & fonts',
    feat2: 'Edit all text & details',
    feat3: 'Multiple languages',
    cta: 'Get Your Invitation',
    loginText: 'Already have an account? Log in',
    watchExample: 'Watch Example Invite',
    popular: 'Popular',
    navItems: ['How It Works', 'The Dashboard', 'Pricing', 'Planning Tools', 'Themes', 'Save the Date', 'Testimonials', 'FAQ', 'Contact'],
    login: 'Log In',
    getStarted: 'Get Started',
    saleText: 'Summer Sale',
    saleOld: '€200',
    saleNew: '€99',
    createCta: 'Create My Invitation',
  },
  fr: {
    backHome: 'Retour à l\'accueil',
    badge: '+34 Beaux Thèmes',
    heroTitle: 'Trouvez Votre Thème Parfait',
    heroDesc: 'C\'est l\'animation d\'ouverture que vos invités voient lorsqu\'ils ouvrent votre enveloppe personnalisée — conçue pour impressionner dès le premier instant. Chaque texte, couleur et détail est entièrement personnalisable.',
    feat1: 'Couleurs et polices personnalisées',
    feat2: 'Modifier tous les textes et détails',
    feat3: 'Plusieurs langues',
    cta: 'Obtenez Votre Invitation',
    loginText: 'Vous avez déjà un compte ? Connectez-vous',
    watchExample: 'Voir l\'exemple',
    popular: 'Populaire',
    navItems: ['Comment ça marche', 'Tableau de bord', 'Tarifs', 'Outils', 'Thèmes', 'Save the Date', 'Témoignages', 'FAQ', 'Contact'],
    login: 'Connexion',
    getStarted: 'Commencer',
    saleText: 'Soldes d\'été',
    saleOld: '€200',
    saleNew: '€99',
    createCta: 'Créer Mon Invitation',
  },
  ar: {
    backHome: 'العودة للرئيسية',
    badge: 'قوالب جميلة +34',
    heroTitle: 'اعثر على القالب المثالي',
    heroDesc: 'هذه هي الرسوم المتحركة الافتتاحية التي يراها ضيوفك عند فتح ظرفك المخصص بأحرفك الأولى — مصممة لتبهرهم من اللحظة الأولى. كل نص ولون وتفصيل قابل للتخصيص بالكامل. اختر أسلوبك، وبمجرد حصولك على حساب يمكنك تغيير القوالب في أي وقت.',
    feat1: 'ألوان وخطوط مخصصة',
    feat2: 'تعديل جميع النصوص والتفاصيل',
    feat3: 'عدة لغات',
    cta: 'احصل على دعوتك',
    loginText: 'لديك حساب بالفعل؟ سجل الدخول',
    watchExample: 'شاهد مثال الدعوة',
    popular: 'مشهور',
    navItems: ['كيف يعمل', 'لوحة التحكم', 'الأسعار', 'أدوات التخطيط', 'القوالب', 'حفظ التاريخ', 'الشهادات', 'الأسئلة الشائعة', 'اتصل بنا'],
    login: 'تسجيل الدخول',
    getStarted: 'ابدأ الآن',
    saleText: 'تخفيضات الصيف',
    saleOld: '€200',
    saleNew: '€99',
    createCta: 'أنشئ دعوتي',
  },
  es: {
    backHome: 'Volver al inicio',
    badge: '+34 Temas Hermosos',
    heroTitle: 'Encuentra Tu Tema Perfecto',
    heroDesc: 'Esta es la animación de apertura que tus invitados ven al abrir tu sobre personalizado — diseñada para impresionar desde el primer momento. Cada texto, color y detalle es totalmente personalizable.',
    feat1: 'Colores y fuentes personalizados',
    feat2: 'Editar todos los textos y detalles',
    feat3: 'Múltiples idiomas',
    cta: 'Obtén Tu Invitación',
    loginText: '¿Ya tienes cuenta? Inicia sesión',
    watchExample: 'Ver ejemplo',
    popular: 'Popular',
    navItems: ['Cómo funciona', 'Panel', 'Precios', 'Herramientas', 'Temas', 'Save the Date', 'Testimonios', 'FAQ', 'Contacto'],
    login: 'Iniciar Sesión',
    getStarted: 'Empezar',
    saleText: 'Oferta de Verano',
    saleOld: '€200',
    saleNew: '€99',
    createCta: 'Crear Mi Invitación',
  },
};

const flagMap = {
  en: '🇬🇧', fr: '🇫🇷', ar: '🇲🇦', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹', pt: '🇵🇹', tr: '🇹🇷', hi: '🇮🇳', zh: '🇨🇳'
};

const HomePage = () => {
  const [selectedLang, setSelectedLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [languages, setLanguages] = useState([]);
  const navigate = useNavigate();

  const t = translations[selectedLang] || translations.en;
  const isRTL = selectedLang === 'ar';

  useEffect(() => {
    axios.get(`${API}/languages`).then(r => setLanguages(r.data)).catch(() => {});
  }, []);

  const filteredDesigns = activeCategory === 'all'
    ? mockDesigns
    : mockDesigns.filter(d => d.category === activeCategory);

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#faf5ef' }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(250,245,239,0.97)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(139,115,85,0.08)' }}>
        <h1 className="text-base tracking-[0.15em]" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>
          WOOOW <span className="tracking-[0.25em]">INVITES</span>
        </h1>
        <div className="flex items-center gap-2">
          {/* Flag */}
          <span className="text-lg">{flagMap[selectedLang] || '🇬🇧'}</span>
          {/* Globe - language picker */}
          <button onClick={() => setLangPickerOpen(!langPickerOpen)} className="p-1.5 rounded-full hover:bg-black/5 transition-colors relative">
            <Globe size={18} color="#6B2D3E" strokeWidth={1.8} />
          </button>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(true)} className="p-1.5">
            <Menu size={22} color="#2c2417" strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* ===== LANGUAGE PICKER DROPDOWN ===== */}
      <AnimatePresence>
        {langPickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 right-4 z-40 bg-white rounded-lg shadow-xl p-2 min-w-[160px]"
            style={{ border: '1px solid rgba(139,115,85,0.1)' }}
          >
            {(languages.length > 0 ? languages : [{ code: 'en', name: 'English' }, { code: 'fr', name: 'Français' }, { code: 'ar', name: 'العربية' }, { code: 'es', name: 'Español' }]).map(lang => (
              <button
                key={lang.code}
                onClick={() => { setSelectedLang(lang.code); setLangPickerOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-left transition-colors ${selectedLang === lang.code ? 'bg-[#6B2D3E]/10' : 'hover:bg-black/5'}`}
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}
              >
                <span>{flagMap[lang.code] || '🌐'}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {langPickerOpen && <div className="fixed inset-0 z-35" onClick={() => setLangPickerOpen(false)} />}

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} z-50 w-full max-w-sm`}
              style={{ backgroundColor: '#faf5ef' }}
            >
              {/* Menu header */}
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(139,115,85,0.08)' }}>
                <h2 className="text-sm tracking-[0.15em]" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>
                  WOOOW <span className="tracking-[0.25em]">INVITES</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{flagMap[selectedLang]}</span>
                  <Globe size={16} color="#6B2D3E" />
                  <button onClick={() => setMenuOpen(false)} className="p-1"><X size={22} color="#2c2417" /></button>
                </div>
              </div>
              {/* Menu items */}
              <nav className="px-5 py-6 space-y-1">
                {t.navItems.map((item, i) => (
                  <button key={i} className="block w-full text-left py-3 text-lg transition-colors hover:text-[#6B2D3E]" style={{ fontFamily: '"Cormorant Garamond", serif', color: i === 4 ? '#6B2D3E' : '#5c4f3a', fontWeight: i === 4 ? 600 : 400 }}>
                    {item}
                  </button>
                ))}
              </nav>
              {/* Menu buttons */}
              <div className="px-5 space-y-3 mt-4">
                <button onClick={() => { setMenuOpen(false); navigate('/admin/login'); }} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-base" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', border: '1.5px solid rgba(44,36,23,0.2)', fontWeight: 500 }}>
                  <LogIn size={18} /> {t.login}
                </button>
                <button onClick={() => { setMenuOpen(false); navigate('/invite/demo'); }} className="w-full py-3.5 rounded-full text-base text-white" style={{ fontFamily: '"Cormorant Garamond", serif', backgroundColor: '#6B2D3E', fontWeight: 500 }}>
                  {t.getStarted}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== HERO SECTION ===== */}
      <section className="px-6 pt-8 pb-6 text-center max-w-lg mx-auto">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5" style={{ border: '1.5px solid rgba(139,115,85,0.15)', backgroundColor: 'rgba(255,255,255,0.5)' }}>
          <Heart size={16} color="#6B2D3E" strokeWidth={1.8} />
          <span className="text-sm" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#6B2D3E', fontWeight: 600 }}>{t.badge}</span>
        </motion.div>

        {/* Title */}
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-[28px] leading-tight mb-5" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', fontWeight: 700 }}>
          {t.heroTitle}
        </motion.h2>

        {/* Description */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-[15px] leading-relaxed mb-6" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>
          {t.heroDesc}
        </motion.p>

        {/* Feature pills */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-2.5 mb-7">
          {[
            { icon: Palette, text: t.feat1 },
            { icon: Sparkles, text: t.feat2 },
            { icon: Type, text: t.feat3 },
          ].map((feat, i) => (
            <div key={i} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mx-1" style={{ border: '1.5px solid rgba(139,115,85,0.12)', backgroundColor: 'rgba(255,255,255,0.4)' }}>
              <feat.icon size={15} color="#6B2D3E" strokeWidth={1.8} />
              <span className="text-sm" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a', fontWeight: 500 }}>{feat.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="space-y-3">
          <button onClick={() => navigate('/invite/demo')} className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3.5 rounded-full text-base text-white transition-all hover:shadow-lg" style={{ fontFamily: '"Cormorant Garamond", serif', backgroundColor: '#6B2D3E', fontWeight: 600 }}>
            {t.cta} <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/admin/login')} className="w-full max-w-xs mx-auto py-3.5 rounded-full text-base transition-colors hover:bg-black/5" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', border: '1.5px solid rgba(44,36,23,0.15)', fontWeight: 500 }}>
            {t.loginText}
          </button>
        </motion.div>
      </section>

      {/* ===== CATEGORY FILTERS ===== */}
      <section className="px-4 pb-5">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-5 py-2 rounded-full text-sm transition-all"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 500,
                backgroundColor: activeCategory === cat.id ? '#6B2D3E' : 'transparent',
                color: activeCategory === cat.id ? '#fff' : '#5c4f3a',
                border: activeCategory === cat.id ? '1.5px solid #6B2D3E' : '1.5px solid rgba(139,115,85,0.15)'
              }}
            >
              {cat.label[selectedLang] || cat.label.en}
            </button>
          ))}
        </div>
      </section>

      {/* ===== DESIGNS GRID ===== */}
      <section className="px-4 pb-8">
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {filteredDesigns.map((design, i) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              style={{ border: '1px solid rgba(139,115,85,0.08)' }}
              onClick={() => navigate(`/invite/${design.demoSlug}`)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={design.thumbnail} alt={design.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                {/* Popular badge */}
                {design.popular && (
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px]" style={{ backgroundColor: '#6B2D3E', fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 }}>
                    <Sparkles size={11} /> {t.popular}
                  </div>
                )}
              </div>
              {/* Card info */}
              <div className="p-3">
                <h3 className="text-[13px] font-bold mb-1 truncate" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>{design.name}</h3>
                <div className="flex items-center gap-1 text-[11px]" style={{ color: '#6B2D3E' }}>
                  <ExternalLink size={11} strokeWidth={2} />
                  <span style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}>{t.watchExample}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== STICKY BOTTOM BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-30" style={{ backgroundColor: '#faf5ef' }}>
        {/* Sale banner */}
        <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: 'rgba(250,245,239,0.95)', borderTop: '1px solid rgba(139,115,85,0.08)' }}>
          <div className="flex items-center gap-2">
            <span className="text-base">🌸</span>
            <span className="text-sm font-bold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>
              {t.saleText}
            </span>
            <span className="text-sm line-through" style={{ color: '#8B7355' }}>{t.saleOld}</span>
            <span className="text-sm font-bold" style={{ color: '#6B2D3E' }}>{t.saleNew}</span>
          </div>
        </div>
        {/* CTA button */}
        <div className="px-4 pb-4 pt-1">
          <button onClick={() => navigate('/invite/demo')} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-base text-white transition-all hover:shadow-lg" style={{ fontFamily: '"Cormorant Garamond", serif', backgroundColor: '#6B2D3E', fontWeight: 600 }}>
            <Heart size={16} /> {t.createCta} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ===== CHAT BUTTON ===== */}
      <div className="fixed bottom-32 right-4 z-30">
        <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#4CAF50' }}>
          <MessageCircle size={22} color="white" fill="white" />
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="px-6 py-8 text-center" style={{ backgroundColor: '#2c2417' }}>
        <p className="text-xs tracking-wider" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>© 2026 WoooW Invites. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
