import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown = ({ date, title = 'Our Big Day', subtitle = 'Counting Down To' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <section
      className="relative py-16 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #f0e8d8 0%, #ebe3d1 50%, #f0e8d8 100%)'
      }}
    >
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B7355' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 relative z-10"
      >
        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-3"
          style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}
        >
          {subtitle}
        </p>
        <h2
          className="text-[22px]"
          style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
        >
          {title}
        </h2>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center mt-4">
          <div className="h-px w-10 bg-[#8B7355]/30" />
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="mx-2">
            <path d="M10 0L13 6L10 12L7 6L10 0Z" fill="#8B7355" fillOpacity="0.3" />
            <path d="M0 6L3 3L6 6L3 9L0 6Z" fill="#8B7355" fillOpacity="0.2" />
            <path d="M14 6L17 3L20 6L17 9L14 6Z" fill="#8B7355" fillOpacity="0.2" />
          </svg>
          <div className="h-px w-10 bg-[#8B7355]/30" />
        </div>
      </motion.div>

      {/* Countdown grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-4 gap-3 max-w-xs mx-auto relative z-10"
      >
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="text-center"
          >
            <div
              className="relative py-4 px-2 mb-2"
              style={{
                backgroundColor: 'rgba(139, 115, 85, 0.06)',
                border: '1px solid rgba(139, 115, 85, 0.15)',
                borderRadius: '2px'
              }}
            >
              {/* Corner ornaments */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#8B7355]/25" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#8B7355]/25" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#8B7355]/25" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#8B7355]/25" />

              <motion.span
                key={unit.value}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-[24px] block"
                style={{ fontFamily: '"Cinzel", serif', color: '#2c2417', fontWeight: 500 }}
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
            </div>
            <span
              className="text-[8px] tracking-[0.2em] uppercase"
              style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}
            >
              {unit.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Countdown;
