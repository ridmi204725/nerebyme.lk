import React from 'react';
import { motion } from 'framer-motion';

const DealsBanner = () => {
  return (
    <section className="py-24 px-4 md:px-10 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[40px] p-12 md:p-20 text-center shadow-[0_20px_50px_rgba(236,72,153,0.3)] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 animate-[gradientFlow_5s_ease_infinite] bg-[length:200%_200%]"
      >
        {/* Floating Particles */}
        {['🎁', '✨', '🔥', '🎁', '✨'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl pointer-events-none"
            initial={{ y: 50, scale: 0.8, opacity: 0, rotate: 0 }}
            animate={{ 
              y: -150, 
              scale: 1.2, 
              opacity: [0, 0.8, 0],
              rotate: 45
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
            style={{ left: `${15 + i * 18}%` }}
          >
            {emoji}
          </motion.div>
        ))}

        <div className="relative z-10 font-poppins">
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-white bg-[length:200%_auto] animate-[shine_3s_linear_infinite] mb-4">
            UP TO 60% OFF
          </h2>
          <p className="text-2xl font-bold text-white mb-10">
            500+ Deals Available Nationwide
          </p>
          
          <button className="group relative overflow-hidden bg-white text-purple-600 px-10 py-5 rounded-full font-extrabold text-lg transition-all duration-300 hover:text-white">
            <span className="relative z-10 flex items-center gap-2">
              Explore Offers <span className="text-2xl leading-none">&rarr;</span>
            </span>
            <div className="absolute inset-0 bg-[#0a0a1a] -translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out z-0" />
          </button>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}} />
    </section>
  );
};

export default DealsBanner;
