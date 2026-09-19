import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSun as FaSunIcon, FaMoon, FaPalette, FaUser, FaSignOutAlt,
  FaBars, FaTimes, FaQuestionCircle, FaInfoCircle,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart,
  FaBell, FaChevronDown, FaTag, FaStore, FaUserShield, FaCoins, FaArrowUp
} from 'react-icons/fa';
import logoImg from '../assets/logooo.jpeg';
import LiquidCursor from './LiquidCursor';
import { getTranslation } from '../utils/i18n';

const THEMES = [
  { id: 'theme-blue', color: '#0056CC', label: 'Blue' },
  { id: 'theme-green', color: '#00695C', label: 'Green' },
  { id: 'theme-purple', color: '#6A1B9A', label: 'Purple' },
];

const LANGUAGE_OPTIONS = [
  { id: 'Sinhala', label: 'සි' },
  { id: 'English', label: 'EN' },
  { id: 'Tamil', label: 'த' }
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
  const userRole = localStorage.getItem('userRole') || 'user';

  const userEmail = localStorage.getItem('userEmail') || 'guest';
  const userPoints = localStorage.getItem(`userPoints_${userEmail}`) || 0;

  const t = getTranslation(language);

  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [pillStyle, setPillStyle] = useState({ top: 0, height: 0, opacity: 0 });

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
    if (hour < 12) setGreeting(t.greeting || 'Good Morning');
    else if (hour < 17) setGreeting(t.greeting || 'Good Afternoon');
    else setGreeting(t.greeting || 'Good Evening');
  }, [t]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleMode = () => {
    setMode(m => m === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('registeredUser');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isDark = mode === 'dark';

  const NAV_LINKS = [
    { label: t.home, path: '/home', icon: <FaSunIcon /> },
    { label: t.playAndEarn, path: '/play-and-earn', icon: <FaCoins /> },
    { label: t.advertise, path: '/advertise', icon: <FaStore /> },
    { label: t.faqHelp, path: '/faq-help', icon: <FaQuestionCircle /> },
    { label: t.aboutUs, path: '/about-us', icon: <FaInfoCircle /> },
    { label: t.feedback, path: '/feedback', icon: <FaEnvelope /> },
  ];

  if (userRole === 'seller' || userRole === 'admin') {
    NAV_LINKS.push({ label: t.sellerPortal, path: '/seller/dashboard', icon: <FaStore /> });
  }

  if (userRole === 'admin') {
    NAV_LINKS.push({ label: t.adminDashboard, path: '/admin/dashboard', icon: <FaUserShield /> });
  }

  useEffect(() => {
    const currentIndex = NAV_LINKS.findIndex(link => link.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveNavIndex(currentIndex);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      const timer = setTimeout(() => {
        const navContainer = document.getElementById('premium-sidebar-nav');
        if (navContainer) {
          const buttons = navContainer.querySelectorAll('button');
          const activeBtn = buttons[activeNavIndex];
          if (activeBtn) {
            setPillStyle({
              top: activeBtn.offsetTop,
              height: activeBtn.offsetHeight,
              opacity: 1
            });
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setPillStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [sidebarOpen, activeNavIndex]);

  return (
      <div className={`hd-root ${isDark ? 'hd-dark' : 'hd-light'} ${sidebarOpen ? 'sidebar-open' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <LiquidCursor />

        <div className="hd-bg-layer">
          <div className="hd-blob blob-1" />
          <div className="hd-blob blob-2" />
          <div className="hd-blob blob-3" />
        </div>

        {/* Custom Mobile Header Styles Injection */}
        <style>{`
          @media screen and (max-width: 768px) {
            .hd-nav {
              padding: 0 12px !important;
              justify-content: space-between !important;
            }
            .hd-nav-center {
              display: none !important;
            }
            .mobile-hide-el {
              display: none !important;
            }
          }
        `}</style>

        {/* Sidebar Drawer Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
              <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                />
                <motion.aside
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    className={`fixed top-0 left-0 bottom-0 z-50 w-80 ${isDark ? 'bg-[#11131a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} border-r p-6 flex flex-col justify-between shadow-2xl overflow-y-auto`}
                >
                  <div>
                    <div className={`flex justify-between items-center pb-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/home'); setSidebarOpen(false); }}>
                        <img src={logoImg} alt="Logo" className="w-9 h-9 rounded-full object-cover" />
                        <span className="text-2xl font-black tracking-wide" style={{ color: '#0000D1' }}>
                          nearbyme<span className={isDark ? 'text-white' : ''} style={!isDark ? { color: '#FFD700' } : {}}>.lk</span>
                        </span>
                      </div>
                      <button onClick={() => setSidebarOpen(false)} className={`${isDark ? 'text-gray-400 hover:text-white bg-gray-800/50' : 'text-gray-600 hover:text-gray-900 bg-gray-100'} p-2 rounded-xl transition-all`}>
                        <FaTimes size={18} />
                      </button>
                    </div>

                    <div className={`my-5 p-4 rounded-2xl ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} border flex items-center justify-between`}>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-semibold`}>{greeting}, {userName.split(' ')[0]}!</p>
                        <p className="text-sm font-bold text-amber-500 capitalize">{userRole} Account</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1.5 rounded-xl font-bold text-xs">
                        <FaCoins className="animate-pulse text-amber-500" />
                        <span>{userPoints} {t.points}</span>
                      </div>
                    </div>

                    <nav id="premium-sidebar-nav" className="relative space-y-1.5 pt-2">
                      <div
                          className="absolute left-0 w-full rounded-2xl pointer-events-none transition-all duration-300 ease-out z-0"
                          style={{
                            top: `${pillStyle.top}px`,
                            height: `${pillStyle.height}px`,
                            opacity: pillStyle.opacity,
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(106, 27, 154, 0.4) 0%, rgba(0, 86, 204, 0.4) 100%)'
                                : 'linear-gradient(135deg, rgba(106, 27, 154, 0.12) 0%, rgba(0, 86, 204, 0.12) 100%)',
                            border: isDark ? '1px solid rgba(106, 27, 154, 0.4)' : '1px solid rgba(106, 27, 154, 0.2)'
                          }}
                      />

                      {NAV_LINKS.map((link, index) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <button
                                key={link.path}
                                onClick={() => {
                                  setActiveNavIndex(index);
                                  navigate(link.path);
                                  setSidebarOpen(false);
                                }}
                                className={`relative z-10 w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium text-sm transition-colors duration-200 cursor-pointer border-0 bg-transparent ${
                                    isActive
                                        ? (isDark ? 'text-purple-400 font-bold' : 'text-purple-700 font-bold')
                                        : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900')
                                }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <span className={`text-base ${isActive ? 'text-purple-500' : 'text-amber-500'}`}>{link.icon}</span>
                                <span>{link.label}</span>
                              </div>
                              <span className={`text-xs transition-transform duration-200 ${isActive ? 'translate-x-0 opacity-100 text-purple-500 font-bold' : 'translate-x-1 opacity-40'}`}>›</span>
                            </button>
                        );
                      })}
                    </nav>
                  </div>

                  <div className={`pt-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} space-y-4`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.language}</span>
                      <div className="flex gap-1">
                        {LANGUAGE_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setLanguage(opt.id)}
                                className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${language === opt.id ? 'bg-amber-500 text-white' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-700'}`}
                            >
                              {opt.label}
                            </button>
                        ))}
                      </div>
                    </div>

                    <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
                      <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.darkMode}</span>
                      <div className="premium-switch scale-90 origin-right">
                        <input
                            type="checkbox"
                            id="sidebar-theme-checkbox"
                            checked={isDark}
                            onChange={toggleMode}
                        />
                        <label htmlFor="sidebar-theme-checkbox" className="premium-toggle">
                          <div className="blob"></div>
                          <span className="icon-sun"><FaSunIcon /></span>
                          <span className="icon-moon"><FaMoon /></span>
                        </label>
                      </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
                    >
                      <FaSignOutAlt />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                </motion.aside>
              </>
          )}
        </AnimatePresence>

        {/* Header Navbar */}
        <motion.nav className={`hd-nav ${scrolled ? 'hd-nav-scrolled' : ''}`} initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-center gap-3">
            <button className="hd-sidebar-toggle hd-btn hd-btn-icon cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="hd-logo flex items-center gap-2" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
              <img src={logoImg} alt="Logo" className="hd-company-logo" />
              <span className="hd-logo-name text-lg sm:text-xl font-black" style={{ color: '#0000D1' }}>
                nearbyme<span className={isDark ? 'text-white' : ''} style={!isDark ? { color: '#FFD700' } : {}}>.lk</span>
              </span>
            </div>
          </div>

          <div className="hd-nav-center flex items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/offers')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-orange-500/20 cursor-pointer border-none animate-pulse"
            >
              <FaTag size={10} className="animate-bounce" />
              <span>{t.hotOffers}</span>
            </motion.button>
            <span className="hd-greeting-pill hidden lg:block">✨ {greeting}, {userName.split(' ')[0]}!</span>
          </div>

          <div className="hd-nav-right flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 mr-1">
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
                          background: isActive ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                          color: isActive ? '#fff' : isDark ? '#a0aec0' : '#4a5568'
                        }}
                    >
                      {option.label}
                    </button>
                );
              })}
            </div>

            <div className="hd-dropdown-root hidden sm:block">
              <button className="hd-btn hd-btn-icon" onClick={() => { setThemeOpen(!themeOpen); setAccountOpen(false); }}>
                <FaPalette />
              </button>
              <AnimatePresence>
                {themeOpen && (
                    <motion.div className="hd-dropdown" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <p className="hd-dd-label" style={{ color: isDark ? '#fff' : '#000' }}>{t.chooseTheme}</p>
                      <div className="hd-theme-dots">
                        {THEMES.map(th => (
                            <button
                                key={th.id}
                                onClick={() => { setTheme(th.id); setThemeOpen(false); }}
                                className={`hd-theme-dot ${theme === th.id ? 'active' : ''}`}
                                style={{ background: th.color }}
                            />
                        ))}
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="premium-switch mobile-hide-el">
              <input
                  type="checkbox"
                  id="theme-checkbox"
                  checked={isDark}
                  onChange={toggleMode}
              />
              <label htmlFor="theme-checkbox" className="premium-toggle">
                <div className="blob"></div>
                <span className="icon-sun"><FaSunIcon /></span>
                <span className="icon-moon"><FaMoon /></span>
              </label>
            </div>

            <div className="hd-dropdown-root">
              <button className="hd-btn hd-account-btn" onClick={() => { setAccountOpen(!accountOpen); setThemeOpen(false); }}>
                <div className="hd-avatar">{userName.charAt(0).toUpperCase()}</div>
                <span className="hd-account-name hidden sm:block" style={{ color: isDark ? '#fff' : '#000' }}>{userName.split(' ')[0]}</span>
                <FaChevronDown size={10} style={{ color: isDark ? '#fff' : '#000' }} />
              </button>
              <AnimatePresence>
                {accountOpen && (
                    <motion.div className={`hd-dropdown hd-dropdown-right ${isDark ? 'bg-[#11131a] text-white' : 'bg-white text-gray-900'}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                      <div className="hd-dd-profile">
                        <div className="hd-dd-avatar">{userName.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="hd-dd-name" style={{ color: isDark ? '#fff' : '#000' }}>{userName}</p>
                          <p className="hd-dd-role capitalize"><span>{userRole}</span> Account</p>
                        </div>
                      </div>
                      <div className="hd-dd-divider" />
                      <button className="hd-dd-item" onClick={() => { navigate('/account'); setAccountOpen(false); }}><span className="hd-dd-item-icon"><FaUser /></span>{t.accountSettings || "Account Settings"}</button>
                      <button className="hd-dd-item" onClick={() => { navigate('/notifications'); setAccountOpen(false); }}><span className="hd-dd-item-icon"><FaBell /></span>{t.notifications}</button>
                      <button className="hd-dd-item" onClick={() => { navigate('/my-offers'); setAccountOpen(false); }}><span className="hd-dd-item-icon"><FaTag /></span>{t.myOffers || "My Offers"}</button>

                      <div className="hd-dd-divider" />
                      <button className="hd-dd-item hd-dd-logout" onClick={handleLogout}>
                        <span className="hd-dd-item-icon"><FaSignOutAlt /></span>{t.signOut}
                      </button>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>

        <div className="hd-main-content" style={{ flex: 1, paddingTop: '90px' }}>
          <Outlet context={{ isDark, language }} />
        </div>

        {/* Footer (Letter sizes & Icon sizes increased) */}
        <footer className={`w-full ${isDark ? 'bg-black text-[#a0aec0]' : 'bg-gray-200 text-gray-700'} text-sm font-medium border-t ${isDark ? 'border-gray-900/40' : 'border-gray-300'} pt-12 pb-6 px-4 md:px-12 transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mb-8">

            <div className="flex flex-col gap-3.5">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <img src={logoImg} alt="Logo" className="w-10 h-10 object-cover rounded-full" />
                <span className="text-2xl font-black tracking-wide" style={{ color: '#0000D1' }}>
                  nearbyme<span className={isDark ? 'text-white' : ''} style={!isDark ? { color: '#FFD700' } : {}}>.lk</span>
                </span>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed max-w-sm`}>
                Sri Lanka's Premier Travel & Lifestyle Platform
              </p>

              {/* Social Media & Freelance Platforms - Split Cleanly into 2 Rows */}
              <div className="flex flex-col gap-2.5 my-2">
                {/* Row 1 (6 Icons) */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-youtube text-base"></i>
                  </a>
                  <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-whatsapp text-base"></i>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-instagram text-base"></i>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-facebook-f text-base"></i>
                  </a>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" title="TikTok" className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white border border-gray-700 hover:opacity-80 transition-opacity">
                    <i className="fab fa-tiktok text-base"></i>
                  </a>
                  <a href="https://upwork.com" target="_blank" rel="noopener noreferrer" title="Upwork" className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-upwork text-base"></i>
                  </a>
                </div>

                {/* Row 2 (6 Icons) */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <a href="https://fiverr.com" target="_blank" rel="noopener noreferrer" title="Fiverr" className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-fiverr text-base"></i>
                  </a>
                  <a href="https://freelancer.com" target="_blank" rel="noopener noreferrer" title="Freelance" className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-600 text-white hover:opacity-80 transition-opacity">
                    <i className="fas fa-briefcase text-base"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter" className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-twitter text-base"></i>
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" title="X" className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white border border-gray-700 hover:opacity-80 transition-opacity">
                    <i className="fab fa-x-twitter text-base"></i>
                  </a>
                  <a href="https://threads.net" target="_blank" rel="noopener noreferrer" title="Threads" className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-threads text-base"></i>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white hover:opacity-80 transition-opacity">
                    <i className="fab fa-linkedin-in text-base"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:pl-12">
              <h4 className="text-xs font-bold text-amber-500 tracking-widest uppercase">{t.quickLinks}</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('/food-hub')} className={`${isDark ? 'text-[#a0aec0] hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-sm`}>{t.foodHub}</button></li>
                <li><button onClick={() => navigate('/dayout')} className={`${isDark ? 'text-[#a0aec0] hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-sm`}>{t.dayout}</button></li>
                <li><button onClick={() => navigate('/travel')} className={`${isDark ? 'text-[#a0aec0] hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-sm`}>{t.travel}</button></li>
                <li><button onClick={() => navigate('/movie-theaters')} className={`${isDark ? 'text-[#a0aec0] hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-sm`}>{t.movieTheaters}</button></li>
                <li><button onClick={() => navigate('/functions')} className={`${isDark ? 'text-[#a0aec0] hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-sm`}>{t.functions}</button></li>
                <li><button onClick={() => `offers` in t && navigate('/offers')} className={`${isDark ? 'text-[#a0aec0] hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-sm`}>{t.offers}</button></li>
                <li><button onClick={() => navigate('/seller/dashboard')} className={`${isDark ? 'text-[#a0aec0] hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-left bg-transparent border-none cursor-pointer p-0 text-sm`}>{t.sellerPortal}</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-amber-500 tracking-widest uppercase">{t.contactUs}</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-amber-500 text-sm" />
                  <a href="mailto:nearbyme.lk@gmail.com" className={`${isDark ? 'text-[#a0aec0] hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-sm`}>nearbyme.lk@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="text-amber-500 text-sm rotate-90" />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>+94 11 234 5678</span>
                </li>
                <li className="flex items-center gap-3 items-start">
                  <FaMapMarkerAlt className="text-amber-500 text-sm mt-0.5" />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-tight text-sm`}>Homagama, Colombo Rd</span>
                </li>
              </ul>
            </div>

          </div>

          <div className={`max-w-7xl mx-auto pt-5 border-t ${isDark ? 'border-gray-900/40 text-gray-400' : 'border-gray-300 text-gray-600'} flex flex-col sm:flex-row justify-center items-center gap-2 text-xs`}>
            <span>© 2026 nearbyme.lk · All rights reserved · Made with</span>
            <FaHeart className="text-red-500 text-xs mx-0.5 animate-pulse" />
            <span>in Sri Lanka</span>
          </div>
        </footer>

        {/* Fixed Back to Top Button (Outside Footer, completely static on screen) */}
        <button
            onClick={scrollToTop}
            title="Back to Top"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
              transition: 'transform 0.3s ease, opacity 0.3s ease'
            }}
            className="hover:scale-110 active:scale-95"
        >
          <FaArrowUp size={16} />
        </button>

      </div>
  );
};

export default MainLayout;