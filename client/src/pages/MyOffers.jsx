import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryMenu from '../components/CategoryMenu';
import LocationDetailsModal from '../components/LocationDetailsModal';
import { getTranslation } from '../utils/i18n';
import {
    FaPhoneAlt, FaRoute, FaInfoCircle, FaMapMarkerAlt, FaSearch, FaCoins, FaCheckCircle, FaExclamationCircle, FaTimes
} from 'react-icons/fa';

const SUB_CATEGORIES = ["Seasonal", "Bank Offers", "Flash Sales"];

const SRI_LANKA_LOCATIONS = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
    "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
    "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const OffersPage = () => {
    const context = useOutletContext() || {};
    const language = context.language || 'English';
    const t = getTranslation(language);

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocationItem, setSelectedLocationItem] = useState(null);
    const [points, setPoints] = useState(0);

    // Toast notification state
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail') || 'guest';
        const userSpecificPointsKey = `userPoints_${userEmail}`;
        const savedPoints = localStorage.getItem(userSpecificPointsKey);
        setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
    }, []);

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

    const fetchOffers = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/offers?`;

            // Handle desktop vs mobile filters
            const activeDistrict = (window.innerWidth <= 768) ? selectedDistrict : selectedDistrict;
            const activeCat = (window.innerWidth <= 768) ? selectedCategory : selectedCategory;

            if (activeCat) url += `subCategory=${activeCat}&`;
            if (activeDistrict) url += `district=${activeDistrict}`;

            const response = await fetch(url);
            const resData = await response.json();

            if (resData.success && Array.isArray(resData.data)) {
                setOffers(resData.data);
            } else if (Array.isArray(resData)) {
                setOffers(resData);
            } else {
                setOffers([]);
            }
        } catch (err) {
            console.error("Error fetching offers:", err);
            showToast("Error fetching offers from server!", "error");
            setOffers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOffers();
    }, [selectedCategory, selectedDistrict]);

    const filteredOffers = offers.filter(offer => {
        const matchesSearch =
            offer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.location?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getBadgeColor = (subCat) => {
        switch (subCat) {
            case "Flash Sales":
                return "bg-red-500/20 text-red-400 border border-red-500/30";
            case "Bank Offers":
                return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
            case "Seasonal":
            default:
                return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
        }
    };

    return (
        <div className={`min-h-screen pt-6 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>
            <style>{`
          .mobile-top-filter-row {
            display: none;
          }
          @media screen and (max-width: 768px) {
            .mobile-top-filter-row {
              display: flex !important;
              gap: 10px;
              margin-bottom: 20px;
              width: 100%;
              align-items: stretch;
            }
            .desktop-search-filter-panel {
              display: none !important;
            }
          }
        `}</style>

            <CategoryMenu activeTab="offers" />

            {/* Custom Toast Notification Container */}
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-xs font-bold ${
                                toast.type === 'success'
                                    ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300 shadow-emerald-950/50'
                                    : 'bg-rose-950/90 border-rose-500/30 text-rose-300 shadow-rose-950/50'
                            }`}
                        >
                            {toast.type === 'success' ? (
                                <FaCheckCircle className="text-emerald-400 text-base shrink-0" />
                            ) : (
                                <FaExclamationCircle className="text-rose-400 text-base shrink-0" />
                            )}
                            <span>{toast.message}</span>
                            <button
                                onClick={() => setToast(null)}
                                className="ml-2 text-gray-400 hover:text-white cursor-pointer"
                            >
                                <FaTimes size={12} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Location Details Modal */}
            <LocationDetailsModal
                isOpen={!!selectedLocationItem}
                item={selectedLocationItem}
                onClose={() => setSelectedLocationItem(null)}
                language={language}
            />

            {/* Hero Banner Section */}
            <div className={`relative overflow-hidden border-b py-10 px-6 mt-6 rounded-3xl transition-colors duration-300 ${isDark ? 'bg-[#11131a] border-slate-800/50 text-white' : 'bg-white border-slate-200 text-gray-900 shadow-sm'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 opacity-30 pointer-events-none" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                        Limited Time Promotions
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mt-4 mb-3 tracking-tight">
                        🎁 Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Offers & Deals</span>
                    </h1>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} max-w-2xl mx-auto text-xs md:text-sm transition-colors duration-300`}>
                        Grab the best seasonal discounts, credit card promo offers, and exciting flash sales across Sri Lanka.
                    </p>
                </div>
            </div>

            {/* MOBILE TOP ROW: Points Box (Left) & District Filter (Right, 50% width) */}
            <div className="mobile-top-filter-row mt-6">
                <div className={`${isDark ? 'bg-[#11131a] border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl`} style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '12px 8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>Points</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><FaCoins size={14} /> {points}</span>
                </div>

                <div className={`${isDark ? 'bg-[#11131a] border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl`} style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '0.8rem' }}>Filter District</h3>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className={`w-full ${isDark ? 'bg-[#161922] border-slate-800 text-white' : 'bg-gray-100 border-slate-300 text-gray-900'} p-2 rounded-lg border text-xs`}
                    >
                        <option value="">All Districts</option>
                        {SRI_LANKA_LOCATIONS.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8">
                {/* Search & Filter Control Panel (Desktop View) */}
                <div className={`desktop-search-filter-panel grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-5 rounded-2xl border transition-colors duration-300 ${isDark ? 'bg-[#11131a] border-slate-800 text-white' : 'bg-white border-slate-200 text-gray-900 shadow-sm'}`}>
                    <div>
                        <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Search Deals</label>
                        <div className="glow-search-container">
                            <span className="glow-search-icon"><FaSearch size={16} /></span>
                            <input
                                type="text"
                                placeholder="Search by title, brand, or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="glow-search-input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Offer Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={`w-full border rounded-xl p-3 focus:outline-none focus:border-orange-500 transition-all text-sm ${isDark ? 'bg-[#161922] border-slate-800 text-white' : 'bg-gray-100 border-slate-300 text-gray-900'}`}
                        >
                            <option value="">All Offers</option>
                            {SUB_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{t.filterByDistrict}</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className={`w-full border rounded-xl p-3 focus:outline-none focus:border-orange-500 transition-all text-sm ${isDark ? 'bg-[#161922] border-slate-800 text-white' : 'bg-gray-100 border-slate-300 text-gray-900'}`}
                        >
                            <option value="">All Districts</option>
                            {SRI_LANKA_LOCATIONS.map(dist => (
                                <option key={dist} value={dist}>{dist}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mobile Category Dropdown ("Select Category") */}
                <div className="block md:hidden mb-6">
                    <select
                        value={selectedCategory}
                        className={`w-full ${isDark ? 'bg-[#11131a] border-slate-800 text-white' : 'bg-white border-slate-300 text-gray-900'} p-3 rounded-xl border text-xs font-bold`}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="" disabled>Select Category</option>
                        <option value="">All Offers</option>
                        {SUB_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Offers Grid */}
                {loading ? (
                    <div className={`text-center py-20 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Searching for active offers...</div>
                ) : filteredOffers.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl border transition-colors duration-300 ${isDark ? 'bg-[#11131a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-gray-600 shadow-sm'}`}>
                        <p className="text-sm">No active offers matched your search criteria.</p>
                        <button
                            onClick={() => { setSelectedCategory(''); setSelectedDistrict(''); setSearchQuery(''); }}
                            className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className={!selectedDistrict || selectedDistrict === '' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                        {filteredOffers.map(offer => (
                            <div
                                key={offer._id}
                                className={`rounded-3xl overflow-hidden border hover:border-orange-500/40 transition-all group flex ${!selectedDistrict || selectedDistrict === '' ? 'flex-col' : 'flex-col sm:flex-row'} justify-between ${isDark ? 'bg-[#11131a] border-slate-800 text-white' : 'bg-white border-slate-200 text-gray-900 shadow-xl'}`}
                            >
                                <div className={!selectedDistrict || selectedDistrict === '' ? '' : 'flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between p-5'}>
                                    {(!selectedDistrict || selectedDistrict === '') && (
                                        <div className="relative h-48 overflow-hidden cursor-pointer shrink-0" onClick={() => setSelectedLocationItem(offer)}>
                                            <img
                                                src={offer.image || 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=500'}
                                                alt={offer.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <span className={`absolute top-3 right-3 px-3 py-1 font-extrabold text-[10px] rounded-full uppercase backdrop-blur-md ${getBadgeColor(offer.subCategory)}`}>
                                                {offer.subCategory}
                                            </span>
                                        </div>
                                    )}

                                    <div className={!selectedDistrict || selectedDistrict === '' ? 'p-5' : ''}>
                                        <h3 className={`text-lg font-bold group-hover:text-orange-400 transition-colors cursor-pointer ${isDark ? 'text-white' : 'text-gray-900'}`} onClick={() => setSelectedLocationItem(offer)}>
                                            {offer.name}
                                        </h3>
                                        <p className={`text-xs flex items-center gap-1 mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                            <FaMapMarkerAlt className="text-orange-500" /> {offer.location}, {offer.district}
                                            {(selectedDistrict && selectedDistrict !== '') && (
                                                <span className={`ml-3 px-2 py-0.5 font-extrabold text-[10px] rounded-full uppercase backdrop-blur-md inline-block ${getBadgeColor(offer.subCategory)}`}>
                                                    {offer.subCategory}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className={`px-5 ${!selectedDistrict || selectedDistrict === '' ? 'pb-5 pt-3 border-t' : 'py-5 sm:border-l sm:border-t-0 pl-0 sm:pl-5'} ${isDark ? 'border-slate-800/80' : 'border-slate-200'} flex items-center justify-between sm:justify-end gap-2`}>
                                    <a
                                        href={offer.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offer.name + ' ' + offer.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                                    >
                                        <FaRoute /> Map
                                    </a>

                                    {offer.contact ? (
                                        <a
                                            href={`tel:${offer.contact}`}
                                            className="p-2.5 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                                        >
                                            <FaPhoneAlt /> Call
                                        </a>
                                    ) : null}

                                    <button
                                        onClick={() => setSelectedLocationItem(offer)}
                                        className="p-2.5 bg-amber-600/10 text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <FaInfoCircle /> About
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersPage;