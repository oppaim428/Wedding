import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, LogIn, Heart, ArrowRight, MessageCircle, Mail, Instagram, Clock } from 'lucide-react';

const flagMap = { en: '🇬🇧', fr: '🇫🇷', ar: '🇲🇦', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹', pt: '🇵🇹', tr: '🇹🇷', hi: '🇮🇳', zh: '🇨🇳' };

const navLinks = [
  { path: '/how-it-works', label: { en: 'How It Works', fr: 'Comment ça marche', ar: 'كيف يعمل' } },
  { path: '/dashboard', label: { en: 'The Dashboard', fr: 'Tableau de bord', ar: 'لوحة التحكم' } },
  { path: '/pricing', label: { en: 'Pricing', fr: 'Tarifs', ar: 'الأسعار' } },
  { path: '/planning-tools', label: { en: 'Planning Tools', fr: 'Outils', ar: 'أدوات التخطيط' } },
  { path: '/', label: { en: 'Themes', fr: 'Thèmes', ar: 'القوالب' } },
  { path: '/save-the-date', label: { en: 'Save the Date', fr: 'Save the Date', ar: 'حفظ التاريخ' } },
  { path: '/testimonials', label: { en: 'Testimonials', fr: 'Témoignages', ar: 'الشهادات' } },
  { path: '/faq', label: { en: 'FAQ', fr: 'FAQ', ar: 'الأسئلة الشائعة' } },
  { path: '/contact', label: { en: 'Contact', fr: 'Contact', ar: 'اتصل بنا' } },
];

const SharedLayout = ({ children, selectedLang, setSelectedLang, languages }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = selectedLang === 'ar';

  // Sale countdown (24h from midnight)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end - now;
      setCountdown({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const t = (key) => {
    const map = {
      login: { en: 'Log In', fr: 'Connexion', ar: 'تسجيل الدخول' },
      getStarted: { en: 'Get Started', fr: 'Commencer', ar: 'ابدأ الآن' },
      sale: { en: 'Summer Sale', fr: 'Soldes d\'été', ar: 'تخفيضات الصيف' },
      createCta: { en: 'Create My Invitation', fr: 'Créer Mon Invitation', ar: 'أنشئ دعوتي' },
      footerDesc: { en: 'Beautiful digital invitations for your special moments', fr: 'De belles invitations numériques pour vos moments spéciaux', ar: 'دعوات رقمية جميلة لأجمل لحظاتكم' },
      quickLinks: { en: 'Quick Links', fr: 'Liens Rapides', ar: 'روابط سريعة' },
      legal: { en: 'Legal', fr: 'Légal', ar: 'قانوني' },
      rights: { en: '© 2026 wooowinvites. All rights reserved.', fr: '© 2026 wooowinvites. Tous droits réservés.', ar: '© 2026 wooowinvites. جميع الحقوق محفوظة.' },
    };
    return map[key]?.[selectedLang] || map[key]?.en || key;
  };

  const countdownStr = `${countdown.h}:${String(countdown.m).padStart(2,'0')}:${String(countdown.s).padStart(2,'0')}`;

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#faf5ef' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* HEADER */}
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(250,245,239,0.97)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(139,115,85,0.08)' }}>
        <h1 onClick={() => navigate('/')} className="text-[15px] tracking-[0.15em] cursor-pointer" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>WOOOW <span className="tracking-[0.25em]">INVITES</span></h1>
        <div className="flex items-center gap-2">
          <span className="text-lg">{flagMap[selectedLang] || '🇬🇧'}</span>
          <button onClick={() => setLangPickerOpen(!langPickerOpen)} className="p-1.5 rounded-full hover:bg-black/5 transition-colors"><Globe size={18} color="#6B2D3E" strokeWidth={1.8} /></button>
          <button onClick={() => setMenuOpen(true)} className="p-1.5"><Menu size={22} color="#2c2417" strokeWidth={1.8} /></button>
        </div>
      </header>

      {/* LANG PICKER */}
      <AnimatePresence>
        {langPickerOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed top-14 right-4 z-40 bg-white rounded-lg shadow-xl p-2 min-w-[160px]" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
            {(languages.length > 0 ? languages : [{code:'en',name:'English'},{code:'fr',name:'Français'},{code:'ar',name:'العربية'}]).map(lang => (
              <button key={lang.code} onClick={() => { setSelectedLang(lang.code); setLangPickerOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-left transition-colors ${selectedLang === lang.code ? 'bg-[#6B2D3E]/10' : 'hover:bg-black/5'}`} style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>
                <span>{flagMap[lang.code] || '🌐'}</span><span>{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {langPickerOpen && <div className="fixed inset-0 z-35" onClick={() => setLangPickerOpen(false)} />}

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)} />
            <motion.div initial={{ x: isRTL ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: isRTL ? '-100%' : '100%' }} transition={{ type: 'tween', duration: 0.3 }} className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} z-50 w-full max-w-sm`} style={{ backgroundColor: '#faf5ef' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(139,115,85,0.08)' }}>
                <h2 className="text-sm tracking-[0.15em]" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>WOOOW <span className="tracking-[0.25em]">INVITES</span></h2>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{flagMap[selectedLang]}</span>
                  <Globe size={16} color="#6B2D3E" />
                  <button onClick={() => setMenuOpen(false)} className="p-1"><X size={22} color="#2c2417" /></button>
                </div>
              </div>
              <nav className="px-5 py-6 space-y-1">
                {navLinks.map((item) => (
                  <button key={item.path} onClick={() => { setMenuOpen(false); navigate(item.path); }} className="block w-full text-left py-3 text-lg transition-colors hover:text-[#6B2D3E]" style={{ fontFamily: '"Cormorant Garamond", serif', color: location.pathname === item.path ? '#6B2D3E' : '#5c4f3a', fontWeight: location.pathname === item.path ? 600 : 400 }}>
                    {item.label[selectedLang] || item.label.en}
                  </button>
                ))}
              </nav>
              <div className="px-5 space-y-3 mt-4">
                <button onClick={() => { setMenuOpen(false); navigate('/admin/login'); }} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-base" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', border: '1.5px solid rgba(44,36,23,0.2)', fontWeight: 500 }}><LogIn size={18} /> {t('login')}</button>
                <button onClick={() => { setMenuOpen(false); navigate('/invite/demo'); }} className="w-full py-3.5 rounded-full text-base text-white" style={{ fontFamily: '"Cormorant Garamond", serif', backgroundColor: '#6B2D3E', fontWeight: 500 }}>{t('getStarted')}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PAGE CONTENT */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer className="px-6 pt-12 pb-6" style={{ backgroundColor: '#f0ebe3' }}>
        <div className="max-w-lg mx-auto">
          <h3 className="text-lg mb-2" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#6B2D3E' }}>WOOOW INVITES</h3>
          <p className="text-base mb-4" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>{t('footerDesc')}</p>
          <div className="flex gap-3 mb-8">
            <a href="mailto:hello@wooowinvites.com" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: '1.5px solid rgba(107,45,62,0.2)' }}><Mail size={18} color="#6B2D3E" /></a>
            <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: '1.5px solid rgba(107,45,62,0.2)' }}><Instagram size={18} color="#6B2D3E" /></a>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-base font-bold mb-3" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>{t('quickLinks')}</h4>
              {[{p:'/how-it-works',l:'How It Works'},{p:'/',l:'Features'},{p:'/invite/demo',l:'Create Your Invitation'}].map(l => (
                <button key={l.p} onClick={() => navigate(l.p)} className="block text-base mb-2 hover:text-[#6B2D3E] transition-colors" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8B7355' }}>{l.l}</button>
              ))}
            </div>
            <div>
              <h4 className="text-base font-bold mb-3" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>{t('legal')}</h4>
              {[{p:'/faq',l:'FAQ'},{p:'/contact',l:'Contact'},{p:'#',l:'Privacy Policy'},{p:'#',l:'Terms of Service'},{p:'#',l:'Affiliate Program'}].map(l => (
                <button key={l.l} onClick={() => l.p !== '#' && navigate(l.p)} className="block text-base mb-2 hover:text-[#6B2D3E] transition-colors" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8B7355' }}>{l.l}</button>
              ))}
            </div>
          </div>
          <div className="pt-4" style={{ borderTop: '1px solid rgba(139,115,85,0.15)' }}>
            <p className="text-sm text-center" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8B7355' }}>{t('rights')}</p>
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30" style={{ backgroundColor: '#faf5ef' }}>
        <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: 'rgba(250,245,239,0.95)', borderTop: '1px solid rgba(139,115,85,0.08)' }}>
          <div className="flex items-center gap-2">
            <span className="text-base">🌸</span>
            <span className="text-sm font-bold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>{t('sale')}</span>
            <span className="text-sm line-through" style={{ color: '#8B7355' }}>€200</span>
            <span className="text-sm font-bold" style={{ color: '#6B2D3E' }}>€99</span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#8B7355' }}>
            <Clock size={12} /><span>{countdownStr}</span>
          </div>
        </div>
        <div className="px-4 pb-4 pt-1">
          <button onClick={() => navigate('/invite/demo')} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-base text-white transition-all hover:shadow-lg" style={{ fontFamily: '"Cormorant Garamond", serif', backgroundColor: '#6B2D3E', fontWeight: 600 }}><Heart size={16} /> {t('createCta')} <ArrowRight size={16} /></button>
        </div>
      </div>

      {/* CHAT BUTTON */}
      <div className="fixed bottom-32 right-4 z-30">
        <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#4CAF50' }}><MessageCircle size={22} color="white" fill="white" /></button>
      </div>
    </div>
  );
};

export default SharedLayout;
