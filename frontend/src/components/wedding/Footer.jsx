import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer = ({ couple, footer }) => {
  return (
    <section className="relative py-16 px-6 overflow-hidden" style={{ backgroundColor: '#2c2417' }}>
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c4a265]/30 to-transparent" />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 text-center">
        {/* Couple names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3
            className="text-xl mb-1"
            style={{ fontFamily: '"Cinzel Decorative", serif', color: '#f5f0e6' }}
          >
            {couple.bride} & {couple.groom}
          </h3>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center my-5"
        >
          <div className="h-px w-10 bg-[#c4a265]/30" />
          <Heart size={12} color="#c4a265" strokeWidth={1.5} className="mx-2 opacity-50" />
          <div className="h-px w-10 bg-[#c4a265]/30" />
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[13px] mb-6"
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#c4a265', fontStyle: 'italic' }}
        >
          {footer.message}
        </motion.p>

        {/* Hashtag */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[10px] tracking-[0.3em] uppercase mb-8"
          style={{ fontFamily: 'Cinzel, serif', color: '#8a7a5e' }}
        >
          {couple.hashtag}
        </motion.p>

        {/* Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ fontFamily: 'Cinzel, serif', color: '#5c4f3a' }}
          >
            {footer.credit}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Footer;
