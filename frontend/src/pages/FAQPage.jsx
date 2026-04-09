import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  { q: 'How does WoooW Invites work?', a: 'Choose a theme, customize every detail (text, colors, photos, music), then share your unique link with guests. They can view your beautiful animated invitation and RSVP directly.' },
  { q: 'Can I change the theme after creating my invitation?', a: 'Yes! You can switch between any of our 34+ themes at any time. Your content will automatically adapt to the new design.' },
  { q: 'Is there a free trial?', a: 'Absolutely! You can try WoooW Invites for free with limited features. Upgrade to Premium for full access to all themes, features, and unlimited invitations.' },
  { q: 'How many languages are supported?', a: 'We support 10+ languages including English, French, Arabic (RTL), Spanish, German, Italian, Portuguese, Turkish, Hindi, and Chinese. Your guests can view the invite in their preferred language.' },
  { q: 'Can I add my own music?', a: 'Yes! Upload your own music file or choose from our curated collection. The music plays automatically when guests open your invitation.' },
  { q: 'How do guests RSVP?', a: 'Guests simply fill out the RSVP form on your invitation page. You can track all responses in real-time from your dashboard.' },
  { q: 'Can I edit the invitation after sharing?', a: 'Yes, all changes are saved instantly and reflected on your live invitation link. No need to reshare.' },
  { q: 'Is there a refund policy?', a: 'We offer a 7-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.' },
  { q: 'Do you offer custom designs?', a: 'Yes! Contact us for custom design requests. We can create a unique theme tailored specifically to your celebration.' },
];

const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = search ? faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) : faqs;

  return (
    <div className="max-w-lg mx-auto">
      <section className="px-6 pt-10 pb-6 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[28px] leading-tight mb-3" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', fontWeight: 700 }}>Frequently Asked Questions</motion.h2>
        <p className="text-base mb-6" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>Everything you need to know</p>
        <div className="relative max-w-sm mx-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color="#8B7355" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." className="w-full pl-10 pr-4 py-3 rounded-full text-sm bg-white/60" style={{ border: '1.5px solid rgba(139,115,85,0.15)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }} />
        </div>
      </section>

      <section className="px-6 pb-10 space-y-2">
        {filtered.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="rounded-lg overflow-hidden" style={{ backgroundColor: openIdx === i ? 'white' : 'rgba(255,255,255,0.5)', border: '1px solid rgba(139,115,85,0.08)' }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between px-4 py-4 text-left">
              <span className="text-[15px] font-medium pr-4" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>{faq.q}</span>
              <ChevronDown size={18} color="#8B7355" className={`flex-shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 pb-4">
                <p className="text-sm leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>{faq.a}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default FAQPage;
