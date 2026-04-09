import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, MapPin, Send, Check } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div className="max-w-lg mx-auto">
      <section className="px-6 pt-10 pb-8 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[28px] leading-tight mb-3" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', fontWeight: 700 }}>Get In Touch</motion.h2>
        <p className="text-base" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>We'd love to hear from you</p>
      </section>

      <section className="px-6 pb-6">
        <div className="flex justify-center gap-4 mb-8">
          {[{ icon: Mail, label: 'Email', val: 'hello@wooowinvites.com' }, { icon: Instagram, label: 'Instagram', val: '@wooowinvites' }, { icon: MapPin, label: 'Location', val: 'Worldwide' }].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex-1 text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(139,115,85,0.08)' }}>
              <c.icon size={20} color="#6B2D3E" className="mx-auto mb-2" />
              <p className="text-xs font-bold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>{c.label}</p>
              <p className="text-[11px] mt-1" style={{ color: '#8B7355' }}>{c.val}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10">
        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: 'rgba(107,45,62,0.1)', border: '1.5px solid rgba(107,45,62,0.2)' }}><Check size={24} color="#6B2D3E" /></div>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>Message Sent!</h3>
            <p className="text-sm" style={{ color: '#8B7355' }}>We'll get back to you within 24 hours.</p>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
            {[{ name: 'name', label: 'Your Name', type: 'text' }, { name: 'email', label: 'Your Email', type: 'email' }, { name: 'subject', label: 'Subject', type: 'text' }].map(f => (
              <div key={f.name}>
                <label className="block text-[10px] tracking-widest uppercase mb-1.5" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>{f.label}</label>
                <input type={f.type} required value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} className="w-full px-4 py-3 rounded-lg text-sm bg-white/60" style={{ border: '1.5px solid rgba(139,115,85,0.15)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }} />
              </div>
            ))}
            <div>
              <label className="block text-[10px] tracking-widest uppercase mb-1.5" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>Message</label>
              <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-lg text-sm bg-white/60 resize-none" style={{ border: '1.5px solid rgba(139,115,85,0.15)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }} />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-base text-white" style={{ fontFamily: '"Cormorant Garamond", serif', backgroundColor: '#6B2D3E', fontWeight: 600 }}><Send size={16} /> Send Message</button>
          </motion.form>
        )}
      </section>
    </div>
  );
};

export default ContactPage;
