import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpeningScreen = ({ videoSrc, onOpen, isVisible }) => {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (videoRef.current && isVisible) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked - that's ok
        setVideoReady(true);
      });
    }
  }, [isVisible]);

  const handleVideoLoaded = () => {
    setVideoReady(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-end cursor-pointer overflow-hidden"
          onClick={onOpen}
          style={{ backgroundColor: '#f5f0e6' }}
        >
          {/* Video background */}
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            loop
            muted
            preload="auto"
            onCanPlay={handleVideoLoaded}
            style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.8s ease-in' }}
          />

          {/* Fallback gradient background while video loads */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: videoReady ? 0 : 1,
              background: 'linear-gradient(135deg, #f5f0e6 0%, #e8dcc8 25%, #dfd3bb 50%, #e8dcc8 75%, #f5f0e6 100%)'
            }}
          >
            {/* Decorative pattern overlay while loading */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-48 h-48 opacity-10"
              >
                <svg viewBox="0 0 200 200" fill="none">
                  {[...Array(8)].map((_, i) => (
                    <g key={i} transform={`rotate(${i * 45} 100 100)`}>
                      <path d="M100 10C100 10 120 50 100 80C80 50 100 10 100 10Z" stroke="#8B7355" strokeWidth="0.5" fill="none" />
                      <path d="M100 10C100 10 130 60 100 90C70 60 100 10 100 10Z" stroke="#8B7355" strokeWidth="0.3" fill="none" />
                    </g>
                  ))}
                  <circle cx="100" cy="100" r="60" stroke="#8B7355" strokeWidth="0.5" fill="none" />
                  <circle cx="100" cy="100" r="40" stroke="#8B7355" strokeWidth="0.3" fill="none" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Bottom text overlay */}
          <div className="relative z-10 pb-16 text-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-[13px] tracking-[0.2em] uppercase mb-6"
              style={{
                fontFamily: '"Cinzel", serif',
                color: '#1a1a1a',
                textShadow: '0 1px 3px rgba(0,0,0,0.15)'
              }}
            >
              You are invited for our special day
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <motion.p
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-sm tracking-[0.35em] uppercase"
                style={{
                  fontFamily: '"Cinzel", serif',
                  color: '#1a1a1a',
                  textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}
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
