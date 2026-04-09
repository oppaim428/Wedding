import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpeningScreen = ({ videoSrc, posterImage, onOpen, isVisible, invitedText = 'You are invited for our special day', tapText = 'Tap to open' }) => {
  const videoRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleClick = useCallback(() => {
    if (!videoStarted && videoRef.current) {
      // First click: unmute and play the video
      videoRef.current.muted = false;
      videoRef.current.play().then(() => {
        setVideoStarted(true);
      }).catch(() => {
        // If unmuted play fails, try muted
        videoRef.current.muted = true;
        videoRef.current.play().then(() => {
          setVideoStarted(true);
        }).catch(() => {
          onOpen();
        });
      });
    } else if (videoStarted) {
      // If video already playing, second click opens invite
      onOpen();
    }
  }, [videoStarted, onOpen]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    setTimeout(() => {
      onOpen();
    }, 600);
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
          style={{ backgroundColor: '#0a0806' }}
        >
          {/* Poster image - shown as background before video plays */}
          {posterImage && (
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: videoStarted ? 0 : 1 }}
            >
              <img
                src={posterImage}
                alt="Wedding invitation"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Video element */}
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            preload="auto"
            muted
            onEnded={handleVideoEnded}
            style={{
              opacity: videoStarted ? 1 : 0,
              transition: 'opacity 0.6s ease-in'
            }}
          />

          {/* Fade overlay when video ends */}
          {videoEnded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-10"
              style={{ backgroundColor: '#f5f0e6' }}
            />
          )}

          {/* Bottom text */}
          <div
            className="relative z-20 pb-12 text-center"
            style={{
              opacity: videoEnded ? 0 : 1,
              transition: 'opacity 0.4s'
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-[12px] tracking-[0.2em] uppercase mb-4"
              style={{
                fontFamily: '"Cinzel", serif',
                color: '#e8dcc8',
                textShadow: '0 1px 6px rgba(0,0,0,0.4)'
              }}
            >
              {invitedText}
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
                  className="text-[14px] tracking-[0.35em] uppercase font-medium"
                  style={{
                    fontFamily: '"Cinzel", serif',
                    color: '#f5f0e6',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}
                >
                  {tapText}
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
