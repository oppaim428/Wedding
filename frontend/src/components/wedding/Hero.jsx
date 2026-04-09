import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ couple, date, invitation }) => {
  const weddingDate = new Date(date);
  const formattedDate = weddingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #faf7f0 0%, #f5f0e6 30%, #ede7d9 70%, #f5f0e6 100%)'
      }} />

      {/* Subtle mandala pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 400 800">
          <circle cx="200" cy="400" r="300" stroke="#c4a265" strokeWidth="0.5" fill="none" />
          <circle cx="200" cy="400" r="250" stroke="#c4a265" strokeWidth="0.3" fill="none" />
          <circle cx="200" cy="400" r="200" stroke="#c4a265" strokeWidth="0.3" fill="none" />
          <circle cx="200" cy="400" r="150" stroke="#c4a265" strokeWidth="0.5" fill="none" />
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="200" y1="100"
              x2="200" y2="700"
              stroke="#c4a265"
              strokeWidth="0.2"
              transform={`rotate(${i * 30} 200 400)`}
            />
          ))}
        </svg>
      </div>

      {/* Top decorative flourish */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="relative z-10 mb-6"
      >
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
          <path d="M60 0C60 0 40 15 10 18C40 21 60 36 60 36C60 36 80 21 110 18C80 15 60 0 60 0Z" stroke="#c4a265" strokeWidth="0.8" fill="none" />
          <circle cx="60" cy="18" r="3" fill="#c4a265" fillOpacity="0.3" />
        </svg>
      </motion.div>

      {/* Invitation text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-[10px] tracking-[0.3em] uppercase text-center mb-2"
        style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
      >
        {invitation.line1}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="relative z-10 text-[10px] tracking-[0.25em] text-center mb-8"
        style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
      >
        {invitation.line2}
      </motion.p>

      {/* Bride name */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, delay: 0.9 }}
        className="relative z-10 text-4xl text-center leading-tight"
        style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
      >
        {couple.bride}
      </motion.h1>

      {/* Ampersand */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="relative z-10 my-3"
      >
        <span className="text-2xl" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#c4a265' }}>&</span>
      </motion.div>

      {/* Groom name */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, delay: 1.1 }}
        className="relative z-10 text-4xl text-center leading-tight mb-8"
        style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
      >
        {couple.groom}
      </motion.h1>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
        className="relative z-10 flex items-center justify-center mb-6"
      >
        <div className="h-px w-12 bg-[#c4a265]/40" />
        <div className="mx-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="#c4a265" fillOpacity="0.4" />
          </svg>
        </div>
        <div className="h-px w-12 bg-[#c4a265]/40" />
      </motion.div>

      {/* Date */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="relative z-10 text-[11px] tracking-[0.25em] uppercase text-center"
        style={{ fontFamily: 'Cinzel, serif', color: '#5c4f3a' }}
      >
        {formattedDate}
      </motion.p>

      {/* Location hint */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.9 }}
        className="relative z-10 text-[10px] tracking-[0.2em] text-center mt-2"
        style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
      >
        Jaipur, Rajasthan
      </motion.p>

      {/* Bottom flourish */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2.1 }}
        className="relative z-10 mt-10"
      >
        <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
          <path d="M0 15Q20 0 40 15Q60 30 80 15" stroke="#c4a265" strokeWidth="0.6" fill="none" />
          <path d="M10 15Q25 5 40 15Q55 25 70 15" stroke="#c4a265" strokeWidth="0.4" fill="none" />
        </svg>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="#c4a265" strokeWidth="1" strokeOpacity="0.4" />
            <motion.circle
              cx="10" cy="10"
              r="2"
              fill="#c4a265"
              fillOpacity="0.5"
              animate={{ cy: [8, 18, 8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
