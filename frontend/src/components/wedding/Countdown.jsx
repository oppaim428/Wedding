import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown = ({ date }) => {
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
    <section className="relative py-16 px-6" style={{ backgroundColor: '#faf7f0' }}>
      {/* Section title */}
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
          Counting Down To
        </p>
        <h2
          className="text-2xl"
          style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
        >
          Our Big Day
        </h2>
      </motion.div>

      {/* Countdown grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-4 gap-3 max-w-xs mx-auto"
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
              className="relative py-4 px-2 rounded-sm mb-2"
              style={{
                backgroundColor: 'rgba(196, 162, 101, 0.08)',
                border: '1px solid rgba(196, 162, 101, 0.2)'
              }}
            >
              <motion.span
                key={unit.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl block"
                style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
            </div>
            <span
              className="text-[9px] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
            >
              {unit.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex items-center justify-center mt-10"
      >
        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c4a265]/30" />
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mx-2">
          <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z" fill="#c4a265" fillOpacity="0.35" />
        </svg>
        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c4a265]/30" />
      </motion.div>
    </section>
  );
};

export default Countdown;
