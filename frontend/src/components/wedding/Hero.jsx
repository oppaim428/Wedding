import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ couple, date, invitation, backgroundImage }) => {
  const weddingDate = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = weddingDate.toLocaleDateString('en-US', options).toUpperCase();

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100dvh' }}>
      {/* Background image - ornate arch */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Wedding arch"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(1.05) saturate(1.1)' }}
        />
        {/* Warm glow overlay from top */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top center, rgba(255,248,225,0.4) 0%, rgba(255,248,225,0.15) 40%, transparent 70%)'
          }}
        />
        {/* Slight vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)'
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-8 py-20">
        {/* Top spacer */}
        <div className="flex-1" />

        {/* Main content - centered in the arch */}
        <div className="text-center">
          {/* Groom name */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
            className="text-[36px] leading-[1.1] mb-0"
            style={{
              fontFamily: '"Cinzel Decorative", serif',
              color: '#2c2417',
              letterSpacing: '0.06em'
            }}
          >
            {couple.groom.toUpperCase()}
          </motion.h1>

          {/* Ampersand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="my-1"
          >
            <span
              className="text-[22px]"
              style={{
                fontFamily: '"Cinzel Decorative", serif',
                color: '#8B7355'
              }}
            >
              &
            </span>
          </motion.div>

          {/* Bride name */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
            className="text-[36px] leading-[1.1] mb-4"
            style={{
              fontFamily: '"Cinzel Decorative", serif',
              color: '#2c2417',
              letterSpacing: '0.06em'
            }}
          >
            {couple.bride.toUpperCase()}
          </motion.h1>

          {/* "We are getting married" */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-[11px] tracking-[0.3em] uppercase mb-5"
            style={{
              fontFamily: '"Cinzel", serif',
              color: '#5c4f3a'
            }}
          >
            {invitation.line2}
          </motion.p>

          {/* Diamond divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.7 }}
            className="flex items-center justify-center mb-5"
          >
            <div className="h-px w-14 bg-[#5c4f3a]/40" />
            <div className="mx-3">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="5" y="0" width="7" height="7" rx="1" transform="rotate(45 5 0)" fill="#5c4f3a" fillOpacity="0.5" />
              </svg>
            </div>
            <div className="h-px w-14 bg-[#5c4f3a]/40" />
          </motion.div>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="text-[14px] tracking-[0.15em]"
            style={{
              fontFamily: '"Cinzel", serif',
              color: '#2c2417',
              fontWeight: 500
            }}
          >
            {formattedDate}
          </motion.p>
        </div>

        {/* Bottom spacer */}
        <div className="flex-1" />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 3 }}
          className="pb-4"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
              <rect x="1" y="1" width="18" height="28" rx="9" stroke="#5c4f3a" strokeWidth="1" strokeOpacity="0.4" />
              <motion.circle
                cx="10" cy="10" r="2" fill="#5c4f3a" fillOpacity="0.5"
                animate={{ cy: [8, 18, 8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
