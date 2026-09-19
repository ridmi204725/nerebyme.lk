import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaChartLine, FaUsers, FaEnvelope, FaCheckCircle, FaStar } from 'react-icons/fa';

const packages = [
    { name: 'Starter', price: 'Free', features: ['1 listing', 'Basic visibility', 'Email support'], color: 'border-gray-700', badge: 'bg-gray-700 text-gray-300', popular: false },
    { name: 'Pro', price: 'LKR 2,500/mo', features: ['5 listings', 'Featured placement', 'Priority support', 'Analytics dashboard'], color: 'border-emerald-500/50', badge: 'bg-emerald-600 text-white', popular: true },
    { name: 'Business', price: 'LKR 7,500/mo', features: ['Unlimited listings', 'Top banner ads', 'Dedicated account manager', 'Advanced analytics', 'Social media shoutouts'], color: 'border-amber-500/50', badge: 'bg-amber-600 text-white', popular: false },
];

const benefits = [
    { icon: <FaUsers size={22} />, title: '50,000+ Monthly Visitors', desc: 'Reach a massive audience actively searching for travel, dining, and event experiences.', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: <FaChartLine size={22} />, title: 'Measurable Growth', desc: 'Track impressions, clicks, and conversions with real-time analytics on your dashboard.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: <FaBullhorn size={22} />, title: 'Targeted Exposure', desc: 'Your listings appear to users filtered by district, category, and interest — maximum relevance.', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
];

const Advertise = () => {
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
        <div className={`min-h-screen pt-8 pb-16 px-4 md:px-8 max-w-6xl mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>

            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
                    <FaBullhorn /> ADVERTISE WITH US
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                    Grow Your Business
                </h1>
                <p className={`text-lg max-w-xl mx-auto leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Promote your business on Holiday.lk and connect with thousands of daily visitors looking for their next adventure across Sri Lanka.
                </p>
            </motion.div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
                {benefits.map((b, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`border ${b.border} rounded-2xl p-6 text-center transition-all shadow-xl ${
                            isDark
                                ? 'bg-[#11131a] hover:border-gray-600 text-white'
                                : 'bg-white hover:border-gray-300 text-gray-900 border-gray-200'
                        }`}
                    >
                        <div className={`${b.bg} ${b.color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4`}>{b.icon}</div>
                        <h3 className={`font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>{b.title}</h3>
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{b.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Pricing */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-14">
                <h2 className={`text-2xl font-extrabold text-center mb-8 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Advertising Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg, i) => (
                        <div
                            key={i}
                            className={`relative border ${pkg.color} rounded-2xl p-7 flex flex-col shadow-xl transition-all ${
                                isDark
                                    ? 'bg-[#11131a] hover:border-gray-500 text-white'
                                    : 'bg-white hover:border-gray-300 text-gray-900 border-gray-200 shadow-lg'
                            }`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"><FaStar size={9} /> MOST POPULAR</span>
                                </div>
                            )}
                            <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-4 ${pkg.badge}`}>{pkg.name}</span>
                            <div className={`text-2xl font-extrabold mb-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
                            <p className={`text-xs mb-6 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>per month, billed monthly</p>
                            <ul className="space-y-2.5 flex-1 mb-7">
                                {pkg.features.map((f, j) => (
                                    <li key={j} className={`flex items-center gap-2 text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <FaCheckCircle className="text-emerald-500 shrink-0" size={13} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${pkg.popular ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'}`}>
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className={`border border-emerald-500/30 rounded-2xl p-10 text-center shadow-2xl transition-colors duration-300 ${
                    isDark
                        ? 'bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-blue-600/10 text-white'
                        : 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-blue-500/5 text-gray-900'
                }`}
            >
                <FaEnvelope className="text-emerald-400 text-3xl mx-auto mb-4" />
                <h2 className={`text-2xl font-extrabold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Need a Custom Package?</h2>
                <p className={`max-w-md mx-auto mb-6 leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Our sales team will craft a personalized advertising solution tailored to your business goals and budget.
                </p>
                <a
                    href="mailto:sales@holiday.lk"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-900/20"
                >
                    <FaEnvelope /> Contact Sales Team
                </a>
            </motion.div>
        </div>
    );
};

export default Advertise;