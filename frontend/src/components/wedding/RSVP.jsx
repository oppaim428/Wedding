import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, Users, MessageSquare, User } from 'lucide-react';

const RSVP = ({ rsvpConfig }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    attending: 'yes',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission - will be replaced with API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section className="relative py-16 px-6" style={{ backgroundColor: '#faf7f0' }}>
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
          We Hope You Can Make It
        </p>
        <h2
          className="text-2xl mb-3"
          style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
        >
          {rsvpConfig.title}
        </h2>
        <p
          className="text-[12px]"
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8a7a5e' }}
        >
          {rsvpConfig.subtitle}
        </p>
        <div className="flex items-center justify-center mt-4">
          <div className="h-px w-12 bg-[#c4a265]/30" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mx-2">
            <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z" fill="#c4a265" fillOpacity="0.35" />
          </svg>
          <div className="h-px w-12 bg-[#c4a265]/30" />
        </div>
      </motion.div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{
            backgroundColor: 'rgba(196, 162, 101, 0.1)',
            border: '1px solid rgba(196, 162, 101, 0.3)'
          }}>
            <Check size={24} color="#c4a265" strokeWidth={1.5} />
          </div>
          <h3
            className="text-lg mb-2"
            style={{ fontFamily: '"Cinzel Decorative", serif', color: '#2c2417' }}
          >
            Thank You!
          </h3>
          <p
            className="text-[13px]"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#8a7a5e' }}
          >
            Your response has been recorded. We look forward to celebrating with you!
          </p>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Name */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <User size={14} color="#c4a265" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/60 rounded-sm text-[13px] outline-none transition-all duration-300 focus:bg-white/80"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#2c2417',
                border: '1px solid rgba(196, 162, 101, 0.2)',
              }}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Send size={14} color="#c4a265" strokeWidth={1.5} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full pl-10 pr-4 py-3 bg-white/60 rounded-sm text-[13px] outline-none transition-all duration-300 focus:bg-white/80"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#2c2417',
                border: '1px solid rgba(196, 162, 101, 0.2)',
              }}
            />
          </div>

          {/* Attendance */}
          <div className="flex gap-3">
            {['yes', 'no'].map((option) => (
              <label
                key={option}
                className="flex-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name="attending"
                  value={option}
                  checked={formData.attending === option}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className="text-center py-3 rounded-sm text-[12px] tracking-[0.15em] uppercase transition-all duration-300"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: formData.attending === option ? '#2c2417' : '#8a7a5e',
                    backgroundColor: formData.attending === option ? 'rgba(196, 162, 101, 0.15)' : 'rgba(255, 255, 255, 0.4)',
                    border: `1px solid rgba(196, 162, 101, ${formData.attending === option ? '0.4' : '0.15'})`
                  }}
                >
                  {option === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline'}
                </div>
              </label>
            ))}
          </div>

          {/* Number of guests */}
          {formData.attending === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Users size={14} color="#c4a265" strokeWidth={1.5} />
              </div>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/60 rounded-sm text-[13px] outline-none transition-all duration-300 focus:bg-white/80 appearance-none"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  color: '#2c2417',
                  border: '1px solid rgba(196, 162, 101, 0.2)',
                }}
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Message */}
          <div className="relative">
            <div className="absolute left-3 top-3">
              <MessageSquare size={14} color="#c4a265" strokeWidth={1.5} />
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message (Optional)"
              rows={3}
              className="w-full pl-10 pr-4 py-3 bg-white/60 rounded-sm text-[13px] outline-none transition-all duration-300 focus:bg-white/80 resize-none"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#2c2417',
                border: '1px solid rgba(196, 162, 101, 0.2)',
              }}
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-sm text-[11px] tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#faf7f0',
              backgroundColor: '#2c2417',
              border: '1px solid rgba(196, 162, 101, 0.3)',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border border-[#c4a265] border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Send size={12} strokeWidth={1.5} />
                Send RSVP
              </>
            )}
          </motion.button>
        </motion.form>
      )}
    </section>
  );
};

export default RSVP;
