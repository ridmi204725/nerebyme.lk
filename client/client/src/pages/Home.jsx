import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Home.css';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaUtensils, FaPlane, FaFilm, FaStar, FaGift,
  FaArrowRight, FaFire
} from 'react-icons/fa';
import { GiSunrise } from 'react-icons/gi';
import { MdFestival } from 'react-icons/md';

// Images
import foodHubImg from '../assets/card_food_hub.png';
import dayoutImg from '../assets/card_dayout.png';
import travelImg from '../assets/card_travel.png';
import moviesImg from '../assets/card_movies.png';
import functionsImg from '../assets/card_functions.png';
import offerImg from '../assets/offer.jpg';

import TypewriterText from '../components/TypewriterText';
import MoodSelector from '../components/MoodSelector';
import StatsCounter from '../components/StatsCounter';
import DealsBanner from '../components/DealsBanner';

const SERVICES = [
  {
    id: 'food-hub',
    label: 'FOOD HUB',
    subtitle: 'Taste the best cuisines',
    icon: <FaUtensils />,
    img: foodHubImg,
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    glow: '0 0 40px rgba(255,107,53,0.6)',
    tag: 'HOT',
    tagColor: '#FF6B35',
    count: '200+ Restaurants',
    path: '/food-hub'
  },
  {
    id: 'dayout',
    label: 'DAYOUT',
    subtitle: 'Plan your perfect day',
    icon: <GiSunrise />,
    img: dayoutImg,
    gradient: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
    glow: '0 0 40px rgba(0,180,219,0.6)',
    tag: 'NEW',
    tagColor: '#00B4DB',
    count: '50+ Activities',
    path: '/dayout'
  },
  {
    id: 'travel',
    label: 'TRAVEL',
    subtitle: 'Explore Sri Lanka',
    icon: <FaPlane />,
    img: travelImg,
    gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    glow: '0 0 40px rgba(86,171,47,0.6)',
    tag: 'TOP',
    tagColor: '#56ab2f',
    count: '100+ Destinations',
    path: '/travel'
  },
  {
    id: 'movie-theater',
    label: 'MOVIE THEATERS',
    subtitle: 'Cinematic experiences',
    icon: <FaFilm />,
    img: moviesImg,
    gradient: 'linear-gradient(135deg, #7B2FF7 0%, #F107A3 100%)',
    glow: '0 0 40px rgba(123,47,247,0.6)',
    tag: 'NOW',
    tagColor: '#7B2FF7',
    count: '20+ Theaters',
    path: '/movie-theater'
  },
  {
    id: 'functions',
    label: 'FUNCTIONS',
    subtitle: 'Book premium venues',
    icon: <MdFestival />,
    img: functionsImg,
    gradient: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
    glow: '0 0 40px rgba(245,175,25,0.6)',
    tag: 'VIP',
    tagColor: '#f5af19',
    count: '30+ Venues',
    path: '/functions'
  },
  {
    id: 'offers',
    label: 'OFFERS',
    subtitle: 'Exclusive deals for you',
    icon: <FaGift />,
    img: offerImg,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    glow: '0 0 40px rgba(229,57,53,0.6)',
    tag: 'SALE',
    tagColor: '#e53935',
    count: '500+ Deals',
    isOffers: true,
    path: '/offers'
  },
];

const HERO_SLIDES = [travelImg, dayoutImg, foodHubImg, moviesImg];

function useTilt() {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -10;
    const ry = ((x - cx) / cx) * 10;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    }
  }, []);
  return { ref, handleMouseMove, handleMouseLeave };
}

const ServiceCard = ({ service, index }) => {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt();
  const [ripples, setRipples] = useState([]);
  const navigate = useNavigate();

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
    navigate(service.path);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: index * 0.1 } }
      }}
      initial="hidden"
      animate="visible"
      className="service-card-wrapper"
      style={{ '--glow': service.glow }}
    >
      <div ref={ref} className="service-card dark" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick} style={{ '--card-gradient': service.gradient }}>
        {ripples.map(r => <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />)}
        {service.img ? (
          <div className="card-img-wrap">
            <img src={service.img} alt={service.label} className="card-img" />
            <div className="card-img-overlay" />
          </div>
        ) : (
          <div className="card-offers-bg">
            <div className="offers-orbit" /><div className="offers-orbit offers-orbit-2" /><div className="offers-glow-circle" />
            <div className="offers-percent"><span>UP</span><span className="big-pct">60%</span><span>OFF</span></div>
          </div>
        )}
        <div className="card-tag" style={{ '--tag-c': service.tagColor }}>{service.tag}</div>
        <div className="card-content">
          <div className="card-icon-wrap">{service.icon}</div>
          <div className="card-text">
            <h3 className="card-title">{service.label}</h3>
            <p className="card-subtitle">{service.subtitle}</p>
            <div className="card-meta">
              <span className="card-count">{service.count}</span>
              <span className="card-arrow"><FaArrowRight /></span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="hd-main-content-inner">
      <motion.div className="hd-hero" style={{ y: heroY }}>
        <div className="hd-hero-inner">
          <motion.div className="hd-hero-content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <div className="hd-hero-tag"><FaFire /> &nbsp;Sri Lanka's #1 Lifestyle Platform</div>
            <h1 className="hd-hero-title">Discover Unforgettable<br /><TypewriterText /></h1>
            <p className="hd-hero-sub">Food, travel, movies, events - all in one place. Your next adventure begins here.</p>
          </motion.div>

          <motion.div className="hd-hero-slideshow" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <AnimatePresence mode="wait">
              <motion.img key={currentSlide} src={HERO_SLIDES[currentSlide]} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="hd-hero-slide-img" alt="Highlight" />
            </AnimatePresence>
            <div className="hd-slide-overlay" />
          </motion.div>
        </div>
      </motion.div>

      <section className="hd-section">
        <div className="hd-section-header">
          <h2 className="hd-section-title">Our Services</h2>
          <p className="hd-section-sub">Everything you love, right at your fingertips</p>
        </div>
        <div className="hd-grid">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      <MoodSelector />
      <DealsBanner />
      <StatsCounter />
    </div>
  );
};

export default Home;