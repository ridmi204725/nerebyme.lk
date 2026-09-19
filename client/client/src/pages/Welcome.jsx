import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkedAlt, FaSuitcaseRolling, FaCloud, FaGlassCheers, FaBirthdayCake } from 'react-icons/fa';
import { GiPartyPopper, GiBalloons } from 'react-icons/gi';
import welcomeGif from '../assets/GIF by Pi-Slices.gif';

const Welcome = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('registeredUser') || 'Guest';

    // Confetti particles configuration
    const confettiCount = 20;
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A29BFE'];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen w-full flex items-center justify-center p-8 overflow-hidden relative"
        >
            {/* Full Screen Background GIF with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={welcomeGif} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-[2px]" />
            </div>

            {/* Animated Confetti Particles */}
            {[...Array(confettiCount)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ 
                        top: -20, 
                        left: `${Math.random() * 100}%`,
                        rotate: 0,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{ 
                        top: '110%',
                        rotate: 360,
                        x: [0, Math.random() * 100 - 50, 0]
                    }}
                    transition={{ 
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear"
                    }}
                    className="absolute w-3 h-3 rounded-sm z-10"
                    style={{ backgroundColor: colors[i % colors.length] }}
                />
            ))}

            {/* Floating Party Poppers */}
            <motion.div 
                animate={{ rotate: [-10, 10, -10], y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-20 left-20 text-yellow-500 text-6xl hidden md:block"
            >
                <GiPartyPopper />
            </motion.div>
            <motion.div 
                animate={{ rotate: [10, -10, 10], y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 right-20 text-pink-500 text-6xl hidden md:block"
            >
                <GiPartyPopper className="scale-x-[-1]" />
            </motion.div>

            {/* Main Content Card */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="glass max-w-2xl w-full p-12 text-center bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl relative z-10"
            >
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-primary text-7xl mb-8 flex justify-center drop-shadow-lg"
                >
                    <GiPartyPopper className="text-orange-500" />
                </motion.div>

                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-extrabold text-white mb-6 drop-shadow-md"
                >
                    Welcome, {userName}!
                </motion.h1>
                
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="flex justify-center gap-4 mb-8 text-3xl text-yellow-400"
                >
                    <GiBalloons />
                    <FaGlassCheers />
                    <GiBalloons />
                </motion.div>

                <p className="text-2xl text-sky-300 mb-12 font-medium">
                    We're so excited to have you join us at <span className="text-white font-bold underline decoration-sky-500">Holiday.lk</span>!
                </p>

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="group relative inline-flex items-center justify-center px-12 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-indigo-600 hover:to-blue-600 shadow-xl shadow-blue-500/30"
                >
                    <span>Get Started</span>
                    <FaSuitcaseRolling className="ml-3 group-hover:translate-x-2 transition-transform" />
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Welcome;
