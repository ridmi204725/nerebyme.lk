import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaPlane, FaFilm, FaGlassCheers, FaTag } from 'react-icons/fa';
import { GiSunrise } from 'react-icons/gi';

const CategoryMenu = ({ activeTab }) => {
  const navigate = useNavigate();

  const menus = [
    { id: 'food-hub', label: 'Food Hub', icon: <FaUtensils />, path: '/food-hub' },
    { id: 'dayout', label: 'Dayout', icon: <GiSunrise />, path: '/dayout' },
    { id: 'travel', label: 'Travel', icon: <FaPlane />, path: '/travel' },
    { id: 'movie-theater', label: 'Movie Theater', icon: <FaFilm />, path: '/movie-theaters' },
    { id: 'functions', label: 'Function', icon: <FaGlassCheers />, path: '/functions' },
    { id: 'offers', label: 'Offers', icon: <FaTag />, path: '/offers' },
  ];

  return (
    <div className="max-w-5xl mx-auto flex justify-center items-center px-4 mb-8">
      <div className="flex items-center gap-2 bg-[#13151c]/80 backdrop-blur-md p-2 rounded-full border border-gray-800/80 overflow-x-auto no-scrollbar shadow-2xl max-w-full">
        {menus.map((menu) => {
          const isActive = activeTab === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => navigate(menu.path)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? 'bg-[#FF5722] text-white shadow-lg shadow-orange-600/30 scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-[#1e2230]'
              }`}
            >
              {menu.icon}
              <span>{menu.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryMenu;