import React from 'react';
import { motion } from 'framer-motion';

const Story = ({ stories }) => {
  return (
    <section className="relative py-16 px-6" style={{ backgroundColor: '#f5f0e6' }}>
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-3"
          style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
        >
          Our Journey
        </p>
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
        >
          Love Story
        </h2>
        <div className="flex items-center justify-center">
          <div className="h-px w-12 bg-[#c4a265]/30" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mx-2">
            <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z" fill="#c4a265" fillOpacity="0.35" />
          </svg>
          <div className="h-px w-12 bg-[#c4a265]/30" />
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative z-10">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#c4a265]/20 -translate-x-1/2" />

        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            className="relative mb-12 last:mb-0"
          >
            {/* Timeline dot */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10">
              <div className="w-3 h-3 rounded-full border border-[#c4a265]/50 bg-[#f5f0e6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c4a265]/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Content card */}
            <div className="pt-8 px-2">
              {/* Image */}
              <motion.div
                whileInView={{ scale: [0.95, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full aspect-[4/3] rounded-sm overflow-hidden mb-4"
                style={{ border: '1px solid rgba(196, 162, 101, 0.2)' }}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>

              {/* Date badge */}
              <div className="text-center mb-2">
                <span
                  className="text-[9px] tracking-[0.3em] uppercase px-3 py-1 inline-block"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: '#c4a265',
                    backgroundColor: 'rgba(196, 162, 101, 0.08)',
                    border: '1px solid rgba(196, 162, 101, 0.15)'
                  }}
                >
                  {story.date}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-lg text-center mb-2"
                style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
              >
                {story.title}
              </h3>

              {/* Description */}
              <p
                className="text-[13px] leading-relaxed text-center"
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#5c4f3a' }}
              >
                {story.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Story;
