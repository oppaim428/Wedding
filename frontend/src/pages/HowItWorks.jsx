import React from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick, Palette, Send, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  { icon: MousePointerClick, title: 'Choose Your Theme', desc: 'Browse our collection of 34+ stunning animated themes. From elegant heritage designs to modern minimal styles.' },
  { icon: Palette, title: 'Customize Everything', desc: 'Edit all text, colors, fonts, photos, music and details. Add your story, events, gallery and RSVP form.' },
  { icon: Send, title: 'Share & Track', desc: 'Share your unique invite link with guests. Track RSVPs, manage your guest list, and send reminders.' },
];

const features = [
  'Animated opening envelopes', 'Custom music & video', 'RSVP tracking dashboard', 'Multi-language support',
  'Guest list management', 'QR code sharing', 'Real-time editing', 'Mobile-first design'
];

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto">
      <section className="px-6 pt-10 pb-8 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[28px] leading-tight mb-3" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', fontWeight: 700 }}>How It Works</motion.h2>
        <p className="text-base" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>Create your perfect digital invitation in 3 simple steps</p>
      </section>

      {/* Steps */}
      <section className="px-6 pb-10">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex gap-4 mb-8 last:mb-0">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(107,45,62,0.08)', border: '1.5px solid rgba(107,45,62,0.15)' }}>
                <step.icon size={20} color="#6B2D3E" strokeWidth={1.5} />
              </div>
              {i < 2 && <div className="w-px h-8 mx-auto mt-2" style={{ backgroundColor: 'rgba(107,45,62,0.1)' }} />}
            </div>
            <div className="pt-1">
              <h3 className="text-lg font-bold mb-1" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>Step {i + 1}: {step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Features grid */}
      <section className="px-6 py-10" style={{ backgroundColor: '#f0ebe3' }}>
        <h3 className="text-xl font-bold text-center mb-6" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>Everything You Need</h3>
        <div className="grid grid-cols-1 gap-3">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/60" style={{ border: '1px solid rgba(139,115,85,0.08)' }}>
              <Check size={16} color="#6B2D3E" strokeWidth={2} />
              <span className="text-sm" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', fontWeight: 500 }}>{f}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-10 text-center">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base text-white" style={{ fontFamily: '"Cormorant Garamond", serif', backgroundColor: '#6B2D3E', fontWeight: 600 }}>Browse Themes <ArrowRight size={18} /></button>
      </section>
    </div>
  );
};

export default HowItWorks;
