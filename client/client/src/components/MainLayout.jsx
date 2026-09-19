import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSun as FaSunIcon, FaMoon, FaPalette, FaUser, FaSignOutAlt,
  FaBars, FaTimes, FaCog, FaQuestionCircle, FaInfoCircle, FaLifeRing,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart, FaFacebook, FaInstagram, FaTwitter, FaYoutube,
  FaBell, FaChevronDown, FaTag
} from 'react-icons/fa';
import logoImg from '../assets/logooo.jpeg';
import LiquidCursor from './LiquidCursor';

const THEMES = [
  { id: 'theme-blue', color: '#0056CC', label: 'Blue' },
  { id: 'theme-green', color: '#00695C', label: 'Green' },
  { id: 'theme-purple', color: '#6A1B9A', label: 'Purple' },
];

const LANGUAGE_OPTIONS = [
  { id: 'Sinhala', label: 'සි' },
  { id: 'English', label: 'EN' },
  { id: 'Tamil', label: 'ත' }
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');
  const [theme, setTheme] = useState(localStorage.getItem('selectedTheme') || 'theme-blue');
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'English');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const userName = localStorage.getItem('registeredUser') || 'Traveler';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('selectedTheme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
    window.dispatchEvent(new Event('languageChange'));
  }, [language]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleMode = () => {
    setMode(m => m === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const isDark = mode === 'dark';

  return (
    <div className={`hd-root ${isDark ? 'hd-dark' : 'hd-light'} ${sidebarOpen ? 'sidebar-open' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LiquidCursor />

      <div className="hd-bg-layer">
        <div className="hd-blob blob-1" />
        <div className="hd-blob blob-2" />
        <div className="hd-blob blob-3" />
      </div>

      {/* ── HEADER NAVBAR ── */}
      <motion.nav className={`hd-nav ${scrolled ? 'hd-nav-scrolled' : ''}`} initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex items-center gap-4">
          <button className="hd-sidebar-toggle hd-btn hd-btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="hd-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logoImg} alt="Logo" className="hd-company-logo" />
            <span className="hd-logo-name">Holiday<span className="hd-logo-dot" style={{ color: '#FFA500' }}>.lk</span></span>
          </div>
        </div>

        {/* 🚀 NEW FEATURE: Center Controls with Hot Offers Badge & Greeting */}
        <div className="hd-nav-center flex items-center gap-3">
          {/* ✅ FIX: Hot Offers බොත්තම සෘජුවම /offers වෙත navigate වන සේ සකසන ලදී */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/offers')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-orange-500/20 cursor-pointer border-none animate-pulse"
          >
            <FaTag size={10} className="animate-bounce" />
            <span>Hot Offers</span>
          </motion.button>
          <span className="hd-greeting-pill">✨ {greeting}, {userName.split(' ')[0]}!</span>
        </div>

        <div className="hd-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* ── LANGUAGE SWITCHER PILLS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = language === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setLanguage(option.id)}
                  style={{
                    height: '34px',
                    minWidth: '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: isActive ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#fff' : '#a0aec0'
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Theme Picker */}
          <div className="hd-dropdown-root">
            <button className="hd-btn hd-btn-icon" onClick={() => { setThemeOpen(!themeOpen); setAccountOpen(false); }}>
              <FaPalette />
            </button>
            <AnimatePresence>
              {themeOpen && (
                <motion.div className="hd-dropdown" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <p className="hd-dd-label" style={{ color: isDark ? '#fff' : '#000' }}>Choose Theme</p>
                  <div className="hd-theme-dots">
                    {THEMES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); setThemeOpen(false); }}
                        className={`hd-theme-dot ${theme === t.id ? 'active' : ''}`}
                        style={{ background: t.color }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mode Toggle */}
          <button className="hd-btn hd-mode-toggle" onClick={toggleMode}>
            {isDark ? <FaSunIcon style={{ color: '#fbbf24' }} /> : <FaMoon style={{ color: '#6366f1' }} />}
          </button>

          {/* Account Profile */}
          <div className="hd-dropdown-root">
            <button className="hd-btn hd-account-btn" onClick={() => { setAccountOpen(!accountOpen); setThemeOpen(false); }}>
              <div className="hd-avatar">{userName.charAt(0).toUpperCase()}</div>
              <span className="hd-account-name" style={{ color: isDark ? '#fff' : '#000' }}>{userName.split(' ')[0]}</span>
              <FaChevronDown size={10} style={{ color: isDark ? '#fff' : '#000' }} />
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div className="hd-dropdown hd-dropdown-right" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="hd-dd-profile">
                    <div className="hd-dd-avatar">{userName.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="hd-dd-name">{userName}</p>
                      <p className="hd-dd-role">Premium Member</p>
                    </div>
                  </div>
                  <div className="hd-dd-divider" />
                  <button className="hd-dd-item"><span className="hd-dd-item-icon"><FaUser /></span>My Profile</button>
                  <button className="hd-dd-item"><span className="hd-dd-item-icon"><FaHeart /></span>My Favourites</button>
                  <button className="hd-dd-item"><span className="hd-dd-item-icon"><FaBell /></span>Notifications</button>
                  <div className="hd-dd-divider" />
                  <button className="hd-dd-item hd-dd-logout" onClick={handleLogout}>
                    <span className="hd-dd-item-icon"><FaSignOutAlt /></span>Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* ── DYNAMIC CONTENT ROUTER OUTLET ── */}
      <div className="hd-main-content" style={{ flex: 1, paddingTop: '90px' }}>
        <Outlet context={{ isDark, language }} />
      </div>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-black text-[#a0aec0] text-sm font-medium border-t border-gray-900/40 pt-16 pb-6 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 mb-12">

          {/* Brand/About Section */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src={logoImg} alt="Logo" className="w-10 h-10 object-cover rounded-full" />
              <span className="text-2xl font-black tracking-wide text-white">
                Holiday<span className="text-amber-500">.lk</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Sri Lanka's Premier Travel & Lifestyle Platform
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-gray-800/40 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <FaFacebook className="text-base" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-gray-800/40 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <FaInstagram className="text-base" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-gray-800/40 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <FaTwitter className="text-base" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-gray-800/40 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <FaYoutube className="text-base" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 md:pl-12">
            <h4 className="text-xs font-bold text-amber-500 tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-3">
              <li><button onClick={() => navigate('/food-hub')} className="hover:text-white transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-[#a0aec0]">Food Hub</button></li>
              <li><button onClick={() => navigate('/dayout')} className="hover:text-white transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-[#a0aec0]">Dayout</button></li>
              <li><button onClick={() => navigate('/travel')} className="hover:text-white transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-[#a0aec0]">Travel</button></li>
              <li><button onClick={() => navigate('/movie-theaters')} className="hover:text-white transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-[#a0aec0]">Movie Theaters</button></li>
              <li><button onClick={() => navigate('/functions')} className="hover:text-white transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-[#a0aec0]">Functions</button></li>
              {/* ✅ FIX: Footer එකෙහි ඇති Offers ලින්ක් එකද සෘජුවම /offers වෙත හැරවූවා */}
              <li><button onClick={() => navigate('/offers')} className="hover:text-white transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-[#a0aec0]">Offers</button></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-amber-500 tracking-widest uppercase">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500 text-xs" />
                <a href="mailto:holiday.lk@gmail.com" className="hover:text-white transition-colors">holiday.lk@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-amber-500 text-xs rotate-90" />
                <span className="text-gray-300">0000000000</span>
              </li>
              <li className="flex items-center gap-3 items-start">
                <FaMapMarkerAlt className="text-amber-500 text-xs mt-0.5" />
                <span className="text-gray-300 leading-tight">Homagama, Colombo Rd</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-900/40 flex flex-col sm:flex-row justify-center items-center gap-2 text-xs text-gray-500">
          <span>© 2026 nearbyme.lk · All rights reserved · Made with</span>
          <FaHeart className="text-red-500 text-[10px] mx-0.5 animate-pulse" />
          <span>in Sri Lanka</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;