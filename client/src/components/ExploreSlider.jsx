import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';

const destinations = [
  { id: 1, name: 'Sigiriya', description: 'Ancient Rock Fortress', bg: 'linear-gradient(to bottom, transparent, #0a0a1a), radial-gradient(circle at top right, #10b981, #064e3b)' },
  { id: 2, name: 'Mirissa', description: 'Golden Coastline', bg: 'linear-gradient(to bottom, transparent, #0a0a1a), radial-gradient(circle at top left, #3b82f6, #1e3a8a)' },
  { id: 3, name: 'Ella', description: 'Lush Green Hills', bg: 'linear-gradient(to bottom, transparent, #0a0a1a), radial-gradient(circle at bottom right, #f59e0b, #78350f)' },
  { id: 4, name: 'Galle', description: 'Historic Dutch Fort', bg: 'linear-gradient(to bottom, transparent, #0a0a1a), radial-gradient(circle at center, #8b5cf6, #4c1d95)' },
  { id: 5, name: 'Yala', description: 'Wildlife Safari', bg: 'linear-gradient(to bottom, transparent, #0a0a1a), radial-gradient(circle at top right, #ec4899, #831843)' },
  { id: 6, name: 'Kandy', description: 'Cultural Capital', bg: 'linear-gradient(to bottom, transparent, #0a0a1a), radial-gradient(circle at bottom left, #14b8a6, #042f2e)' }
];

const ExploreSlider = () => {
  return (
    <div className="w-full relative px-6 md:px-16 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold font-poppins text-white mb-2 relative inline-block">
          Explore Sri Lanka
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-full h-[3px] bg-gradient-to-r from-transparent via-purple-600 to-transparent"></span>
        </h2>
      </motion.div>

      <Swiper
        modules={[Navigation, Parallax]}
        navigation
        parallax
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.5 },
          1280: { slidesPerView: 4.5 }
        }}
        className="w-full pb-10 cursor-grab active:cursor-grabbing hover-target"
      >
        {destinations.map((dest) => (
          <SwiperSlide key={dest.id}>
            <div className="relative h-[400px] rounded-3xl overflow-hidden group">
              <div 
                className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
                style={{ background: dest.bg }}
                data-swiper-parallax="30%"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-[#0a0a1a] to-transparent">
                <h3 className="text-2xl font-poppins font-bold text-white mb-1">{dest.name}</h3>
                <p className="text-white/60 text-sm font-medium">{dest.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ExploreSlider;
