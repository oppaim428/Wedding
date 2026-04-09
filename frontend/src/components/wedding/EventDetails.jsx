import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Palette, Heart, Music } from 'lucide-react';

const iconMap = {
  palette: Palette,
  heart: Heart,
  music: Music
};

const EventDetails = ({ events, title = 'Wedding Events', subtitle = 'Join Us At' }) => {
  return (
    <section className="relative py-16 px-6" style={{ backgroundColor: '#faf7f0' }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-3"
          style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
        >
          {subtitle}
        </p>
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
        >
          {title}
        </h2>
        <div className="flex items-center justify-center">
          <div className="h-px w-12 bg-[#c4a265]/30" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mx-2">
            <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z" fill="#c4a265" fillOpacity="0.35" />
          </svg>
          <div className="h-px w-12 bg-[#c4a265]/30" />
        </div>
      </motion.div>

      {/* Event cards */}
      <div className="space-y-6">
        {events.map((event, index) => {
          const IconComponent = iconMap[event.icon] || Heart;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center p-6 rounded-sm relative"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(196, 162, 101, 0.15)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-4" style={{
                backgroundColor: 'rgba(196, 162, 101, 0.1)',
                border: '1px solid rgba(196, 162, 101, 0.2)'
              }}>
                <IconComponent size={16} color="#c4a265" strokeWidth={1.5} />
              </div>

              {/* Event title */}
              <h3
                className="text-base mb-3"
                style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
              >
                {event.title}
              </h3>

              {/* Date & Time */}
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} color="#c4a265" strokeWidth={1.5} />
                  <span className="text-[11px]" style={{ fontFamily: 'Cinzel, serif', color: '#5c4f3a' }}>
                    {event.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} color="#c4a265" strokeWidth={1.5} />
                  <span className="text-[11px]" style={{ fontFamily: 'Cinzel, serif', color: '#5c4f3a' }}>
                    {event.time}
                  </span>
                </div>
              </div>

              {/* Venue */}
              <p
                className="text-sm mb-1"
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#2c2417', fontWeight: 600 }}
              >
                {event.venue}
              </p>
              <p
                className="text-[12px] mb-4"
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8a7a5e' }}
              >
                {event.address}
              </p>

              {/* Map link */}
              <a
                href={event.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm transition-all duration-300 hover:bg-[#c4a265]/15"
                style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#c4a265',
                  border: '1px solid rgba(196, 162, 101, 0.3)'
                }}
              >
                <MapPin size={11} strokeWidth={1.5} />
                View on Map
              </a>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default EventDetails;
