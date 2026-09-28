import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaCoins, FaTrophy, FaStar, FaGift, FaMedal } from 'react-icons/fa';

const features = [
    { icon: <FaGamepad size={28} />, title: 'Play Games', desc: 'Participate in fun interactive quizzes and challenges about Sri Lankan travel, food, and culture.', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { icon: <FaCoins size={28} />, title: 'Earn Points', desc: 'Collect reward points for every game you complete, review you leave, and place you add to the platform.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: <FaTrophy size={28} />, title: 'Climb Leaderboard', desc: 'Compete with other users and rise through the ranks to claim your spot at the top of the leaderboard.', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { icon: <FaGift size={28} />, title: 'Redeem Rewards', desc: 'Exchange your hard-earned points for exciting vouchers, discounts, and exclusive Holiday.lk perks.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const PlayAndEarn = () => {
    const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

    useEffect(() => {
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
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [mode]);

    const isDark = mode === 'dark';

    return (
        <div className={`min-h-screen pt-8 pb-16 px-4 md:px-8 max-w-5xl mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>

            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-14"
            >
                <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
                    <FaMedal /> COMING SOON
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                    Play &amp; Earn
                </h1>
                <p className={`text-lg max-w-xl mx-auto leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get ready for an exciting new way to explore Sri Lanka — play games, earn reward points, and unlock exclusive perks.
                </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`border ${f.border} rounded-2xl p-6 flex gap-4 items-start transition-all shadow-xl ${
                            isDark
                                ? 'bg-[#11131a] hover:border-gray-600 text-white'
                                : 'bg-white hover:border-gray-300 text-gray-900 border-gray-200'
                        }`}
                    >
                        <div className={`${f.bg} ${f.color} p-3 rounded-xl shrink-0`}>{f.icon}</div>
                        <div>
                            <h3 className={`text-base font-bold mb-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                            <p className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Coming Soon Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className={`border border-violet-500/30 rounded-2xl p-10 text-center shadow-2xl transition-colors duration-300 ${
                    isDark
                        ? 'bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-amber-600/10 text-white'
                        : 'bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-amber-500/5 text-gray-900'
                }`}
            >
                <div className="flex justify-center mb-4">
                    <FaStar className="text-amber-400 text-4xl animate-pulse" />
                </div>
                <h2 className={`text-2xl font-extrabold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>We're building something amazing!</h2>
                <p className={`max-w-md mx-auto mb-6 leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    The Play &amp; Earn feature is currently in development. Stay tuned — the launch is just around the corner.
                </p>
                <div className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition text-white text-sm font-bold px-6 py-2.5 rounded-xl cursor-default shadow-lg shadow-violet-900/20">
                    <FaCoins /> Notify Me When Live
                </div>
            </motion.div>
        </div>
    );
};

export default PlayAndEarn;