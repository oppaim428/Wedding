import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [designs, setDesigns] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [d, l] = await Promise.all([
          axios.get(`${API}/designs`),
          axios.get(`${API}/languages`)
        ]);
        setDesigns(d.data);
        setLanguages(l.data);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const texts = {
    en: { title: 'Beautiful Wedding Invitations', subtitle: 'Create stunning digital invitations for your special day', browse: 'Browse Designs', demo: 'View Demo', admin: 'Admin Panel' },
    fr: { title: 'Belles Invitations de Mariage', subtitle: 'Créez de superbes invitations numériques pour votre jour spécial', browse: 'Parcourir les Designs', demo: 'Voir la Démo', admin: 'Panneau Admin' },
    ar: { title: 'دعوات زفاف جميلة', subtitle: 'أنشئ دعوات رقمية مذهلة ليومك المميز', browse: 'تصفح التصاميم', demo: 'عرض النموذج', admin: 'لوحة الإدارة' },
    es: { title: 'Hermosas Invitaciones de Boda', subtitle: 'Crea impresionantes invitaciones digitales', browse: 'Ver Diseños', demo: 'Ver Demo', admin: 'Panel Admin' },
  };

  const t = texts[selectedLang] || texts.en;
  const isRTL = languages.find(l => l.code === selectedLang)?.rtl || false;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e6' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(139,115,85,0.1)' }}>
        <h1 className="text-lg" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>WoooW Invites</h1>
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)} className="appearance-none pl-8 pr-4 py-2 rounded text-sm bg-white/60 border cursor-pointer" style={{ borderColor: 'rgba(139,115,85,0.2)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
              ))}
            </select>
            <Globe size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" color="#8B7355" />
          </div>
          <button onClick={() => navigate('/admin/login')} className="text-xs tracking-wider uppercase px-3 py-2 rounded transition-colors hover:bg-[#2c2417]/5" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>
            {t.admin}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={18} color="#c4a265" />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>Digital Invitations</span>
            <Sparkles size={18} color="#c4a265" />
          </div>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>{t.title}</h2>
          <p className="text-lg mb-8" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>{t.subtitle}</p>
          <button onClick={() => navigate('/invite/demo')} className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm tracking-wider uppercase transition-all hover:shadow-lg" style={{ fontFamily: '"Cinzel", serif', backgroundColor: '#2c2417', color: '#f5f0e6' }}>
            {t.demo} <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* Designs grid */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h3 className="text-center text-xl mb-8" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}>{t.browse}</h3>
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design, i) => (
              <motion.div key={design.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="group cursor-pointer" onClick={() => navigate('/invite/demo')}>
                <div className="overflow-hidden rounded-lg shadow-md" style={{ border: '1px solid rgba(139,115,85,0.15)' }}>
                  <div className="aspect-[3/4] overflow-hidden">
                    {design.thumbnail ? (
                      <img src={design.thumbnail} alt={design.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e8dcc8' }}>
                        <Sparkles size={40} color="#8B7355" />
                      </div>
                    )}
                  </div>
                  <div className="p-4" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                    <h4 className="text-sm font-bold mb-1" style={{ fontFamily: '"Cinzel", serif', color: '#2c2417' }}>{design.name}</h4>
                    <p className="text-xs" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8B7355' }}>{design.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ backgroundColor: '#2c2417' }}>
        <p className="text-xs tracking-wider" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>© 2026 WoooW Invites. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
