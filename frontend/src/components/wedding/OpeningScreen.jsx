import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpeningScreen = ({ videoSrc, onOpen, isVisible }) => {
  const videoRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleClick = useCallback(() => {
    if (!videoStarted && videoRef.current) {
      // First click: start the video
      videoRef.current.play().then(() => {
        setVideoStarted(true);
      }).catch(() => {
        // If play fails, just open the invite
        onOpen();
      });
    } else if (videoStarted) {
      // If video already started, clicking again opens immediately
      onOpen();
    }
  }, [videoStarted, onOpen]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    // Small delay after video ends, then open
    setTimeout(() => {
      onOpen();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-end cursor-pointer overflow-hidden"
          onClick={handleClick}
          style={{ backgroundColor: '#f5f0e6' }}
        >
          {/* Video - hidden until user clicks */}
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            preload="auto"
            onEnded={handleVideoEnded}
            style={{
              opacity: videoStarted ? 1 : 0,
              transition: 'opacity 0.8s ease-in'
            }}
          />

          {/* Fading overlay when video ends */}
          {videoEnded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-10"
              style={{ backgroundColor: '#f5f0e6' }}
            />
          )}

          {/* Static cover / fallback - shown before video plays */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: videoStarted ? 0 : 1,
              background: 'linear-gradient(135deg, #f5f0e6 0%, #e8dcc8 25%, #dfd3bb 50%, #e8dcc8 75%, #f5f0e6 100%)'
            }}
          >
            {/* Ornate decorative mandala while waiting */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 opacity-[0.08]">
                <svg viewBox="0 0 200 200" fill="none">
                  {[...Array(12)].map((_, i) => (
                    <g key={i} transform={`rotate(${i * 30} 100 100)`}>
                      <path d="M100 15C100 15 115 50 100 75C85 50 100 15 100 15Z" stroke="#8B7355" strokeWidth="0.6" fill="none" />
                      <path d="M100 20C100 20 125 60 100 85C75 60 100 20 100 20Z" stroke="#8B7355" strokeWidth="0.3" fill="none" />
                    </g>
                  ))}
                  <circle cx="100" cy="100" r="70" stroke="#8B7355" strokeWidth="0.5" fill="none" />
                  <circle cx="100" cy="100" r="50" stroke="#8B7355" strokeWidth="0.4" fill="none" />
                  <circle cx="100" cy="100" r="30" stroke="#8B7355" strokeWidth="0.3" fill="none" />
                  {[...Array(8)].map((_, i) => (
                    <circle
                      key={`dot-${i}`}
                      cx={100 + 70 * Math.cos((i * 45 * Math.PI) / 180)}
                      cy={100 + 70 * Math.sin((i * 45 * Math.PI) / 180)}
                      r="2"
                      fill="#8B7355"
                      fillOpacity="0.3"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Decorative border frame */}
            <div className="absolute inset-6 border border-[#8B7355]/10 rounded-sm" />
            <div className="absolute inset-10 border border-[#8B7355]/[0.06] rounded-sm" />
          </div>

          {/* Bottom text overlay */}
          <div className="relative z-20 pb-14 text-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-[12px] tracking-[0.2em] uppercase mb-5"
              style={{
                fontFamily: '"Cinzel", serif',
                color: '#1a1a1a',
                textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                opacity: videoEnded ? 0 : 1,
                transition: 'opacity 0.5s'
              }}
            >
              You are invited for our special day
            </motion.p>

            {!videoStarted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <motion.p
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[13px] tracking-[0.35em] uppercase"
                  style={{
                    fontFamily: '"Cinzel", serif',
                    color: '#1a1a1a',
                    textShadow: '0 1px 4px rgba(0,0,0,0.15)'
                  }}
                >
                  Tap to open
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningScreen;
