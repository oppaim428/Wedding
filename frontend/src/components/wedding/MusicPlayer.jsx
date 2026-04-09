import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = ({ musicUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef(null);

  // Default music if none provided
  const src = musicUrl || '';

  useEffect(() => {
    // Auto-hide the music prompt after 5 seconds
    const timer = setTimeout(() => {
      setShowPrompt(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          console.log('Autoplay prevented by browser');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />

      {/* Music toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
        style={{
          backgroundColor: isPlaying ? 'rgba(44, 36, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(196, 162, 101, 0.3)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {isPlaying ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Volume2 size={16} color={isPlaying ? '#c4a265' : '#2c2417'} strokeWidth={1.5} />
          </motion.div>
        ) : (
          <VolumeX size={16} color="#8a7a5e" strokeWidth={1.5} />
        )}
      </motion.button>

      {/* Music prompt tooltip */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 2.5 }}
            className="fixed bottom-[70px] right-4 z-50 px-3 py-2 rounded-sm shadow-md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(196, 162, 101, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p
              className="text-[10px] tracking-[0.15em] whitespace-nowrap"
              style={{ fontFamily: 'Cinzel, serif', color: '#5c4f3a' }}
            >
              Tap to play music
            </p>
            {/* Tooltip arrow */}
            <div
              className="absolute -bottom-1 right-6 w-2 h-2 rotate-45"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRight: '1px solid rgba(196, 162, 101, 0.2)',
                borderBottom: '1px solid rgba(196, 162, 101, 0.2)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
