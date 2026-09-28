import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaUtensils, FaPlane, FaFilm, FaGlassCheers, FaTag, FaHotel } from 'react-icons/fa';
import { GiSunrise } from 'react-icons/gi';
import { getTranslation } from '../utils/i18n';

const CategoryMenu = ({ activeTab }) => {
  const navigate = useNavigate();
  const context = useOutletContext() || {};
  const [lang, setLang] = useState(context.language || localStorage.getItem('selectedLanguage') || 'English');
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('selectedLanguage') || 'English');
    };
    window.addEventListener('languageChange', handleLangChange);

    const handleStorageChange = () => {
      const currentMode = localStorage.getItem('mode');
      if (currentMode) setMode(currentMode);
    };
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      const storedMode = localStorage.getItem('mode');
      if (storedMode && storedMode !== mode) {
        setMode(storedMode);
      }
    }, 500);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [mode]);

  const isDark = mode === 'dark';
  const t = getTranslation(lang);

  const menus = [
    { id: 'food-hub', label: t.foodHub, icon: <FaUtensils />, path: '/food-hub' },
    { id: 'hotels', label: t.hotels || 'Hotels', icon: <FaHotel />, path: '/hotels' },
    { id: 'dayout', label: t.dayout, icon: <GiSunrise />, path: '/dayout' },
    { id: 'travel', label: t.travel, icon: <FaPlane />, path: '/travel' },
    { id: 'movie-theater', label: t.movieTheaters, icon: <FaFilm />, path: '/movie-theaters' },
    { id: 'functions', label: t.functions, icon: <FaGlassCheers />, path: '/functions' },
    { id: 'offers', label: t.offers, icon: <FaTag />, path: '/offers' },
  ];

  return (
      <>
        <style>{`
        /* ─── DESKTOP STYLES (UNCHANGED) ─── */
        .gooey-nav-container {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: ${isDark ? 'rgba(19, 21, 28, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          backdrop-filter: blur(16px);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
          border-radius: 9999px;
          padding: 8px 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, ${isDark ? '0.4' : '0.1'});
          width: fit-content;
          margin: 0 auto;
        }

        .gooey-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          overflow: hidden;
          transition: color 0.3s ease;
          z-index: 1;
          white-space: nowrap;
          color: ${isDark ? '#a0aec0' : '#4a5568'};
        }

        .gooey-nav-item span {
          position: relative;
          z-index: 2;
        }

        .gooey-nav-item i, .gooey-nav-item svg {
          position: relative;
          z-index: 2;
          font-size: 18px;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .gooey-nav-item::before {
          content: "";
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          border-radius: 9999px;
          transition: top 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.4s ease;
          z-index: 1;
        }

        .gooey-nav-item:hover::before,
        .gooey-nav-item.active::before {
          top: 0;
        }

        .gooey-nav-item:hover,
        .gooey-nav-item.active {
          color: #ffffff !important;
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.35);
        }

        .gooey-nav-item:hover svg,
        .gooey-nav-item.active svg {
          color: #ffffff !important;
          transform: translateY(-2px);
        }

        .gooey-nav-item:not(.active):not(:hover) svg {
          color: #FF6B35;
        }

        /* ─── MOBILE RESPONSIVE STYLES (TikTok Style Floating Nav) ─── */
        @media screen and (max-width: 768px) {
          .gooey-nav-container {
            width: 100% !important;
            max-width: 420px;
            display: flex !important;
            justify-content: space-around !important;
            align-items: center !important;
            padding: 0 4px !important;
            height: 64px !important;
            background: ${isDark ? 'rgba(17, 19, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
            backdrop-filter: blur(20px);
            border-radius: 18px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
          }

          .gooey-nav-item {
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            flex: 1 !important;
            height: 100% !important;
            padding: 0 !important;
            background: transparent !important;
            border-radius: 0 !important;
          }

          /* Default Icon & Text Color in Mobile */
          .gooey-nav-item svg {
            font-size: 18px !important;
            color: ${isDark ? '#9ca3af' : '#6b7280'} !important;
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), color 0.3s ease !important;
            z-index: 2;
          }

          .gooey-nav-item span {
            position: absolute !important;
            bottom: 8px !important;
            font-size: 9px !important;
            font-weight: 600 !important;
            color: ${isDark ? '#9ca3af' : '#6b7280'} !important;
            opacity: 0;
            transform: translateY(8px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
            z-index: 2;
          }

          /* Background Hover/Before Effect Removal for Mobile structure */
          .gooey-nav-item::before {
            display: none !important;
          }

          /* Active State: Icon flies up and text appears below with Gradient styling */
          .gooey-nav-item.active svg {
            transform: translateY(-14px) scale(1.15) !important;
            color: #FF6B35 !important;
            filter: drop-shadow(0 4px 10px rgba(255, 107, 53, 0.4));
          }

          .gooey-nav-item.active span {
            opacity: 1 !important;
            transform: translateY(0) !important;
            color: #FF6B35 !important;
          }

          /* Optional: active background pill highlight similar to image */
          .gooey-nav-item.active::after {
            content: "";
            position: absolute;
            bottom: 6px;
            width: 32px;
            height: 32px;
            background: rgba(255, 107, 53, 0.12);
            border-radius: 50%;
            z-index: 1;
            animation: popIn 0.3s ease;
          }
        }

        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

        <div className="sticky top-0 z-50 w-full px-3 py-2">
          <div className="gooey-nav-container">
            {menus.map((menu) => {
              const isActive = activeTab === menu.id;
              return (
                  <button
                      key={menu.id}
                      onClick={() => navigate(menu.path)}
                      className={`gooey-nav-item ${isActive ? 'active' : ''}`}
                  >
                    {menu.icon}
                    <span>{menu.label}</span>
                  </button>
              );
            })}
          </div>
        </div>
      </>
  );
};

export default CategoryMenu;