import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="relative py-16 px-6" style={{ backgroundColor: '#f5f0e6' }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-3"
          style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
        >
          Captured Moments
        </p>
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
        >
          Our Gallery
        </h2>
        <div className="flex items-center justify-center">
          <div className="h-px w-12 bg-[#c4a265]/30" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mx-2">
            <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z" fill="#c4a265" fillOpacity="0.35" />
          </svg>
          <div className="h-px w-12 bg-[#c4a265]/30" />
        </div>
      </motion.div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="cursor-pointer overflow-hidden rounded-sm group"
            style={{ border: '1px solid rgba(196, 162, 101, 0.15)' }}
            onClick={() => openLightbox(index)}
          >
            <div className={`relative ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden`}>
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>

            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>

            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={images[selectedIndex]?.url}
              alt={images[selectedIndex]?.alt}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <span
                className="text-[10px] tracking-[0.2em] uppercase text-white/60"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {selectedIndex + 1} / {images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
