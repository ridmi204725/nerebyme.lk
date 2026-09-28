import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const moodData = {
  'food': { color: 'rgba(245, 158, 11, 0.15)', text: "Check out the top-rated seafood restaurants on the coast! 🦐" },
  'adventure': { color: 'rgba(14, 165, 233, 0.15)', text: "Grab your board, the waves in Mirissa are perfect today! 🌊" },
  'date': { color: 'rgba(124, 58, 237, 0.15)', text: "We found 5 romantic rooftop dinners with a view. 🌆" },
  'fun': { color: 'rgba(236, 72, 153, 0.15)', text: "Music festivals and pop-up events happening this weekend! 🎊" }
};

const MoodSelector = () => {
  const [mood, setMood] = useState(null);

  return (
    <section className="py-24 px-4 md:px-10 max-w-7xl mx-auto">
      <motion.div 
        className="rounded-[40px] text-center p-12 transition-colors duration-1000 border border-white/5 shadow-2xl relative overflow-hidden"
        style={{ background: mood ? moodData[mood].color : 'rgba(255, 255, 255, 0.03)' }}
      >
        <div className="absolute inset-0 backdrop-blur-3xl -z-10 bg-[#0a0a1a]/40" />

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-poppins font-bold text-white mb-10"
        >
          What are you in the mood for?
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { id: 'food', label: "🍛 I'm Hungry" },
            { id: 'adventure', label: "🏄 Adventure Awaits" },
            { id: 'date', label: "💜 Date Night" },
            { id: 'fun', label: "🎉 Weekend Fun" }
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setMood(item.id)}
              whileHover={{ y: -5, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              className={`hover-target flex items-center gap-3 px-8 py-4 rounded-full font-poppins font-semibold text-lg transition-all duration-300 border ${
                mood === item.id 
                  ? 'bg-white/10 border-white/50 scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-white' 
                  : 'bg-white/5 border-white/10 text-white/70'
              }`}
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        <div className="h-10">
          <AnimatePresence mode="wait">
            {mood ? (
              <motion.p
                key={mood}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl md:text-2xl text-white/80 font-medium font-poppins"
              >
                {moodData[mood].text}
              </motion.p>
            ) : (
              <motion.p
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl text-white/40 font-medium"
              >
                Select a mood to get personalized recommendations
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default MoodSelector;
