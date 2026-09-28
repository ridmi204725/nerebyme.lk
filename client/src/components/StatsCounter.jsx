import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const StatCircle = ({ target, label, sublabel, formatValue }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuart)
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        const currentCount = Math.floor(easeOut * target);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="80" cy="80" r="72"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          <motion.circle
            cx="80" cy="80" r="72"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ strokeDasharray: "452", strokeDashoffset: "452" }}
            animate={isInView ? { strokeDashoffset: "0" } : {}}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="text-4xl font-poppins font-black text-white">
          {formatValue ? formatValue(count) : count}
        </div>
      </div>
      <div className="text-white/60 font-semibold uppercase tracking-wider text-sm">{label}</div>
      {sublabel && <div className="text-white/40 text-xs mt-1">{sublabel}</div>}
    </div>
  );
};

const StatsCounter = () => {
  return (
    <section className="py-24 border-y border-white/5 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
        <StatCircle target={10} label="Happy Users" sublabel="(K+)" formatValue={(v) => `${v}K+`} />
        <StatCircle target={500} label="Exclusive Deals" sublabel="+" formatValue={(v) => `${v}+`} />
        <StatCircle target={100} label="Destinations" sublabel="+" formatValue={(v) => `${v}+`} />
      </div>
    </section>
  );
};

export default StatsCounter;
