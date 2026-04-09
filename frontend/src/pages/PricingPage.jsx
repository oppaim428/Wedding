import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free Trial', price: '€0', period: '', desc: 'Try before you buy',
    features: ['1 invitation', '3 themes', 'Basic RSVP', 'Email support'],
    missing: ['Custom music', 'Multiple languages', 'Guest analytics', 'Priority support'],
    cta: 'Start Free', popular: false
  },
  {
    name: 'Premium', price: '€99', oldPrice: '€200', period: 'one-time', desc: 'Everything you need',
    features: ['Unlimited invitations', 'All 34+ themes', 'Full RSVP tracking', 'Custom music & video', 'Multi-language', 'Guest analytics', 'QR code sharing', 'Priority support'],
    missing: [],
    cta: 'Get Premium', popular: true
  },
];

const PricingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto">
      <section className="px-6 pt-10 pb-8 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ border: '1.5px solid rgba(107,45,62,0.15)', backgroundColor: 'rgba(255,255,255,0.5)' }}>
          <span className="text-base">🌸</span>
          <span className="text-sm font-bold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#6B2D3E' }}>Summer Sale — 50% Off!</span>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[28px] leading-tight mb-3" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', fontWeight: 700 }}>Simple Pricing</motion.h2>
        <p className="text-base" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>One payment, unlimited memories</p>
      </section>

      <section className="px-6 pb-10 space-y-4">
        {plans.map((plan, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className={`p-6 rounded-xl relative ${plan.popular ? 'shadow-lg' : ''}`} style={{ backgroundColor: plan.popular ? 'white' : 'rgba(255,255,255,0.5)', border: `1.5px solid ${plan.popular ? 'rgba(107,45,62,0.2)' : 'rgba(139,115,85,0.1)'}` }}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs" style={{ backgroundColor: '#6B2D3E', fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 }}><Star size={12} /> Most Popular</div>}
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>{plan.name}</h3>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#6B2D3E' }}>{plan.price}</span>
              {plan.oldPrice && <span className="text-base line-through" style={{ color: '#8B7355' }}>{plan.oldPrice}</span>}
              {plan.period && <span className="text-xs" style={{ color: '#8B7355' }}>{plan.period}</span>}
            </div>
            <p className="text-sm mb-4" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8B7355' }}>{plan.desc}</p>
            <div className="space-y-2 mb-5">
              {plan.features.map((f, j) => <div key={j} className="flex items-center gap-2"><Check size={14} color="#6B2D3E" /><span className="text-sm" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }}>{f}</span></div>)}
              {plan.missing.map((f, j) => <div key={j} className="flex items-center gap-2 opacity-40"><X size={14} /><span className="text-sm" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}>{f}</span></div>)}
            </div>
            <button onClick={() => navigate('/invite/demo')} className={`w-full py-3 rounded-full text-base ${plan.popular ? 'text-white' : ''}`} style={{ fontFamily: '"Cormorant Garamond", serif', backgroundColor: plan.popular ? '#6B2D3E' : 'transparent', color: plan.popular ? 'white' : '#2c2417', border: plan.popular ? 'none' : '1.5px solid rgba(44,36,23,0.15)', fontWeight: 600 }}>{plan.cta}</button>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default PricingPage;
