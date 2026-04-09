import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpeningScreen = ({ couple, onOpen, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          onClick={onOpen}
          style={{ background: 'linear-gradient(135deg, #f5f0e6 0%, #ebe5d9 25%, #e8e2d5 50%, #f0ead9 75%, #f5f0e6 100%)' }}
        >
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-5 mix-blend-multiply" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }} />

          {/* Decorative borders */}
          <div className="absolute inset-4 border border-[#c4a265]/30 rounded-sm" />
          <div className="absolute inset-8 border border-[#c4a265]/20 rounded-sm" />

          {/* Corner ornaments */}
          {['top-12 left-12', 'top-12 right-12', 'bottom-12 left-12', 'bottom-12 right-12'].map((pos, i) => (
            <div key={i} className={`absolute ${pos}`}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d={i < 2
                    ? (i === 0 ? "M0 20C0 9 9 0 20 0M20 0C9 0 0 9 0 20" : "M40 20C40 9 31 0 20 0M20 0C31 0 40 9 40 20")
                    : (i === 2 ? "M0 20C0 31 9 40 20 40M20 40C9 40 0 31 0 20" : "M40 20C40 31 31 40 20 40M20 40C31 40 40 31 40 20")
                  }
                  stroke="#c4a265"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
              </svg>
            </div>
          ))}

          <div className="text-center relative z-10 px-8">
            {/* Top ornamental divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
              className="flex items-center justify-center mb-8"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c4a265]/50" />
              <div className="mx-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" fill="#c4a265" fillOpacity="0.5" />
                </svg>
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c4a265]/50" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-[10px] tracking-[0.4em] uppercase mb-6"
              style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
            >
              Wedding Invitation
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="text-3xl mb-2 leading-tight"
              style={{ fontFamily: '"Cinzel Decorative", serif', color: '#1a1a1a' }}
            >
              {couple.bride}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-lg my-3"
              style={{ fontFamily: '"Cinzel Decorative", serif', color: '#c4a265' }}
            >
              &
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="text-3xl mb-8 leading-tight"
              style={{ fontFamily: '"Cinzel Decorative", serif', color: '#1a1a1a' }}
            >
              {couple.groom}
            </motion.h1>

            {/* Bottom ornamental divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1.4, ease: 'easeOut' }}
              className="flex items-center justify-center mb-10"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c4a265]/50" />
              <div className="mx-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" fill="#c4a265" fillOpacity="0.5" />
                </svg>
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c4a265]/50" />
            </motion.div>

            {/* Tap to open */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <motion.p
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[11px] tracking-[0.35em] uppercase"
                style={{ fontFamily: 'Cinzel, serif', color: '#1a1a1a', textShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              >
                Tap to open
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningScreen;
