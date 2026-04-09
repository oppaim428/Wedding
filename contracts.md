# API Contracts & Backend Integration Plan

## Authentication
- POST /api/auth/login → { email, password } → { token, admin }
- Admin: creanadi@gmail.com / 123456 (seeded on startup)

## Invite API
- GET /api/invite/:slug → Full invite data (public)
- PUT /api/invite/:slug → Update invite (admin, JWT)

## Designs/Templates API
- GET /api/designs → List all designs (public for homepage)
- POST /api/designs → Create design (admin)
- PUT /api/designs/:id → Update design (admin)
- DELETE /api/designs/:id → Delete design (admin)

## RSVP API
- POST /api/rsvp → Submit RSVP (public)
- GET /api/rsvp?invite_slug=xxx → List RSVPs (admin)

## File Upload
- POST /api/upload → Upload image/video/music (admin)

## Languages
- GET /api/languages → List languages
- POST /api/languages → Add language (admin)

## MongoDB Collections
- admins: { email, password_hash }
- designs: { name, thumbnail, hero_bg, opening_video, opening_poster, css_vars, created_at }
- invites: { slug, design_id, couple, date, events, story, gallery, music, rsvp_config, languages, created_at }
- rsvp_responses: { invite_slug, name, email, attending, guests, message, created_at }
- languages: { code, name, flag }

## Frontend Pages
- / → Home (browse designs, language selector)
- /invite/:slug → Public invite page (dynamic content)
- /admin/login → Admin login
- /admin → Admin dashboard
- /admin/invites → Manage invites
- /admin/designs → Manage designs
- /admin/rsvp → View RSVP responses
