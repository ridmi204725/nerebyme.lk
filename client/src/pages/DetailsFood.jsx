import React, { useState, useEffect } from 'react';
import PackageGallery from '../components/PackageGallery';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import {
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaStar,
    FaArrowLeft,
    FaShareAlt,
    FaRoute,
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
    FaFacebook,
    FaInstagram,
    FaTripadvisor
} from 'react-icons/fa';

export default function DetailsFood() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState(null);

    const [message, setMessage] = useState({ type: '', text: '' });

    const [ratingValue, setRatingValue] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [customReviewerName, setCustomReviewerName] = useState('');
    const [reviewsList, setReviewsList] = useState([]);
    const [submittingReview, setSubmittingReview] = useState(false);

    // State to handle 'Read more' expansion for reviews
    const [expandedReviews, setExpandedReviews] = useState({});

    const toggleReadMore = (index) => {
        setExpandedReviews(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const showNotification = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 3500);
    };

    useEffect(() => {
        try {
            const storedName = localStorage.getItem('registeredUser') ||
                localStorage.getItem('name') ||
                localStorage.getItem('username') ||
                localStorage.getItem('userName');

            const storedUserObj = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');

            const finalName = storedName || storedUserObj.name || storedUserObj.fullName || storedUserObj.username;

            if (finalName) {
                setCustomReviewerName(finalName);
            } else {
                setCustomReviewerName('');
            }
        } catch (e) {
            console.error("Error reading user from localStorage", e);
            setCustomReviewerName('');
        }

        const fetchRestaurantDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/api/admin/items/${id}`);
                let itemData = null;

                if (res.data && res.data.data) {
                    itemData = res.data.data;
                } else if (res.data) {
                    itemData = res.data;
                }

                if (itemData) {
                    setRestaurant(itemData);
                    setReviewsList(Array.isArray(itemData.reviews) ? itemData.reviews : []);
                }
            } catch (err) {
                console.error("Error fetching restaurant details:", err);
                setError("Failed to load restaurant details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRestaurantDetails();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!customReviewerName.trim() || !reviewComment.trim()) {
            showNotification('error', 'කරුණාකර නම සහ අදහස (Comment) ඇතුළත් කරන්න.');
            return;
        }

        if (!localStorage.getItem('token')) {
            showNotification('error', 'Please log in before submitting a comment.');
            return;
        }
        setSubmittingReview(true);
        try {
            const newReview = {
                name: customReviewerName.trim(),
                rating: Number(ratingValue),
                comment: reviewComment,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            const updatedReviews = [newReview, ...reviewsList];
            setReviewsList(updatedReviews);

            try {
                const reviewResponse = await axios.post(
                    `${API_BASE_URL}/api/admin/items/${id}/reviews`,
                    newReview,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }
                );
                if (reviewResponse.data?.data) setReviewsList(reviewResponse.data.data);
            } catch (backendErr) {
                console.log("Backend review endpoint note:", backendErr);
            }

            setReviewComment('');
            setRatingValue(5);
            showNotification('success', 'ඔබේ විචාරය (Review) සාර්ථකව එකතු කරන ලදී!');
        } catch (err) {
            console.error("Error submitting review:", err);
            showNotification('error', 'Review එක යැවීමේදී දෝෂයක් ඇති විය.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1c1815] text-[#e7e2d8] flex items-center justify-center font-serif">

            <PackageGallery images={restaurant?.packageImages || []} title="Restaurant Menu" />
                <p className="text-[#c59b67] animate-pulse text-sm font-semibold">Loading...</p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#1c1815] text-[#e7e2d8] gap-4 font-serif px-4 text-center">
            <PackageGallery images={restaurant?.packageImages || []} title="Menu & Packages" />
                <div className="text-sm font-medium text-rose-400">{error || "Restaurant not found."}</div>
                <Link to="/home" className="bg-[#8b5a2b] hover:bg-[#a06b38] px-4 py-2 rounded-xl text-xs font-bold transition text-white">
                    Back to Home
                </Link>
            </div>
        );
    }

    // FoodHub සඳහා menu එකේ ෆොටෝ එක හෝ ෆොටෝ කිහිපයක් ලබා ගැනීම
    const menuImages = (() => {
        let imgs = [];
        if (restaurant.menu) {
            if (typeof restaurant.menu === 'string' && restaurant.menu.trim() !== '') {
                imgs.push(restaurant.menu);
            } else if (Array.isArray(restaurant.menu)) {
                restaurant.menu.forEach(item => {
                    if (typeof item === 'string' && item.trim() !== '') {
                        imgs.push(item);
                    } else if (item && (item.image || item.url || item.imageUrl)) {
                        imgs.push(item.image || item.url || item.imageUrl);
                    }
                });
            }
        }
        if (imgs.length === 0 && Array.isArray(restaurant.menuImages) && restaurant.menuImages.length > 0) {
            restaurant.menuImages.forEach(img => {
                if (typeof img === 'string') imgs.push(img);
                else if (img?.image || img?.url) imgs.push(img.image || img.url);
            });
        }
        return imgs;
    })();

    return (
        <div className="w-full min-h-screen bg-[#1c1815] text-[#e7e2d8] font-serif selection:bg-[#8b5a2b] selection:text-white pb-16">

            {message.text && (
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white font-medium shadow-2xl border ${
                        message.type === 'error'
                            ? 'bg-rose-900/90 border-rose-700 shadow-rose-950/50'
                            : 'bg-emerald-900/90 border-emerald-700 shadow-emerald-950/50'
                    } backdrop-blur-md`}>
                        {message.type === 'error' ? <FaExclamationTriangle size={18} /> : <FaCheckCircle size={18} />}
                        <span className="text-sm">{message.text}</span>
                    </div>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6 w-full">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-[#2c2622] hover:bg-[#38312c] text-[#e7e2d8] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-[#3c3530] cursor-pointer text-xs"
                >
                    <FaArrowLeft size={12} /> Back
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showNotification('success', 'Link copied to clipboard!');
                    }}
                    className="bg-[#2c2622] hover:bg-[#38312c] text-[#e7e2d8] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-[#3c3530] cursor-pointer text-xs"
                >
                    <FaShareAlt size={12} /> Share
                </button>
            </div>

            {/* Hero Banner Section */}
            <div className="w-full relative h-[380px] sm:h-[480px] md:h-[540px] overflow-hidden">
                <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
                    alt={restaurant.name || restaurant.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1815] via-[#1c1815]/30 to-black/40"></div>

                <div className="absolute bottom-8 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 flex flex-col items-start gap-2">
                    <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                        {restaurant.category || 'Sri Lankan • Wood-Fired'} {restaurant.subCategory ? `• ${restaurant.subCategory}` : ''}
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-wide font-serif">
                        {restaurant.name || restaurant.title}
                    </h1>
                    <div className="flex items-center gap-3 text-sm">
                        <FaMapMarkerAlt className="text-[#8b5a2b] shrink-0" size={16} />
                        <span>{restaurant.location || '46 Park Street, Colombo 02'}</span>
                    </div>
                </div>
            </div>

            {/* Info and Map Preview Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    <div className="md:col-span-2 bg-[#4F3727] text-[#e7e2d8] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl border border-[#2c2622]">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-[#3c3530]/60 pb-4">
                                <span className="text-xs uppercase tracking-widest text-[#c59b67] font-semibold">Quick Information</span>
                                <div className="flex items-center gap-1.5 bg-[#1c1815]/40 px-3 py-1 rounded-full border border-[#3c3530]">
                                    <FaStar className="text-[#8b5a2b]" size={14} />
                                    <span className="text-xs font-bold text-white">{restaurant.rating || '4.8'} / 5</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 bg-[#1c1815]/30 p-4 rounded-2xl border border-[#3c3530]/50">
                                    <div className="p-2.5 bg-[#8b5a2b]/20 rounded-xl text-[#8b5a2b] mt-0.5">
                                        <FaPhoneAlt size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-[#b8b0a2] font-semibold">Contact</span>
                                        {restaurant.contact ? (
                                            <a href={`tel:${restaurant.contact}`} className="hover:underline text-xs font-bold text-white mt-0.5 block">
                                                {restaurant.contact}
                                            </a>
                                        ) : (
                                            <span className="text-xs font-bold text-white mt-0.5 block">+94 11 215 7060</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-[#1c1815]/30 p-4 rounded-2xl border border-[#3c3530]/50">
                                    <div className="p-2.5 bg-[#8b5a2b]/20 rounded-xl text-[#8b5a2b] mt-0.5">
                                        <FaClock size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-[#b8b0a2] font-semibold">Open Hours</span>
                                        <span className="text-xs font-bold text-white mt-0.5 block">10:00 AM - 11:00 PM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#1c1815]/30 p-4 rounded-2xl border border-[#3c3530]/50">
                                <div className="p-2.5 bg-[#8b5a2b]/20 rounded-xl text-[#8b5a2b]">
                                    <FaMapMarkerAlt size={14} />
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-[#b8b0a2] font-semibold">Location Address</span>
                                    <span className="text-xs font-medium text-white mt-0.5 block">{restaurant.location || '46 Park Street, Colombo 02'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#4F3727] text-[#e7e2d8] p-4 sm:p-6 rounded-3xl flex flex-col justify-between shadow-xl space-y-4 border border-[#2c2622]">
                        <div className="w-full h-36 sm:h-40 bg-[#2c2622] rounded-2xl overflow-hidden relative border border-[#3c3530]">
                            {restaurant.mapUrl ? (
                                <iframe
                                    title="Restaurant Map Preview"
                                    src={restaurant.mapUrl.includes('iframe') ? restaurant.mapUrl.match(/src="([^"]+)"/)?.[1] || restaurant.mapUrl : restaurant.mapUrl}
                                    className="w-full h-full border-0 pointer-events-none"
                                    loading="lazy"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-[#b8b0a2] text-center px-4">
                                    Map preview not configured
                                </div>
                            )}
                        </div>

                        <a
                            href={
                                restaurant.mapUrl && !restaurant.mapUrl.includes('iframe')
                                    ? restaurant.mapUrl
                                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((restaurant.name || restaurant.title) + ' ' + (restaurant.location || ''))}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#8b5a2b] hover:bg-[#724822] text-white py-3 rounded-2xl text-xs font-semibold transition shadow-md text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaRoute size={14} /> Get Directions / View Map
                        </a>
                    </div>
                </div>
            </div>

            {/* About the Restaurant Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 border-t border-b border-[#2c2622] py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#c59b67] font-semibold block mb-2">The House Story</span>
                        <h2 className="text-2xl sm:text-3xl font-serif text-white">About the Restaurant</h2>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-[#b8b0a2] leading-relaxed">
                            {restaurant.aboutUs || restaurant.description || 'Cinnamon & Smoke is a quiet, spice-led dining room where Sri Lankan produce meets a wood-fired kitchen. The menu changes with the market, guided by smoky clay ovens, bright coastal citrus, and a deep respect for long lunch rituals.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu Section Split into Two Columns (Showing Full Images) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
                <div className="text-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#c59b67] font-semibold">From the Kitchen</span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-white">A menu made for lingering.</h2>
                </div>

                {menuImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menuImages.map((imgUrl, idx) => (
                            <div key={idx} className="w-full bg-[#2c2622] rounded-3xl overflow-hidden relative shadow-2xl border border-[#3c3530] p-4 flex items-center justify-center">
                                <img
                                    src={imgUrl}
                                    alt={`Menu Page ${idx + 1}`}
                                    className="w-full h-auto max-h-[600px] object-contain rounded-2xl"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="w-full bg-[#2c2622] rounded-3xl overflow-hidden relative shadow-2xl border border-[#3c3530] p-4 flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200"
                                alt="Menu Preview"
                                className="w-full h-auto max-h-[600px] object-contain rounded-2xl"
                            />
                        </div>
                        <div className="w-full bg-[#2c2622] rounded-3xl overflow-hidden relative shadow-2xl border border-[#3c3530] p-4 flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200"
                                alt="Menu Preview 2"
                                className="w-full h-auto max-h-[600px] object-contain rounded-2xl"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Social Media Links Horizontal Scroll Section */}
            {(restaurant.facebookUrl || restaurant.instagramUrl || restaurant.tripadvisorUrl) && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-[#8b5a2b] scrollbar-track-[#2c2622]">
                        {restaurant.facebookUrl && (
                            <a
                                href={restaurant.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#4F3727] hover:bg-[#5e4330] text-[#e7e2d8] px-5 py-3 rounded-2xl border border-[#2c2622] shadow-lg shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                                    <FaFacebook size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-[#b8b0a2] font-semibold">Connect with us</span>
                                    <span className="text-xs font-bold text-white">Facebook Page</span>
                                </div>
                            </a>
                        )}

                        {restaurant.instagramUrl && (
                            <a
                                href={restaurant.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#4F3727] hover:bg-[#5e4330] text-[#e7e2d8] px-5 py-3 rounded-2xl border border-[#2c2622] shadow-lg shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-pink-600/20 text-pink-400 rounded-xl">
                                    <FaInstagram size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-[#b8b0a2] font-semibold">Follow photos</span>
                                    <span className="text-xs font-bold text-white">Instagram Profile</span>
                                </div>
                            </a>
                        )}

                        {restaurant.tripadvisorUrl && (
                            <a
                                href={restaurant.tripadvisorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#4F3727] hover:bg-[#5e4330] text-[#e7e2d8] px-5 py-3 rounded-2xl border border-[#2c2622] shadow-lg shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
                                    <FaTripadvisor size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-[#b8b0a2] font-semibold">Read reviews</span>
                                    <span className="text-xs font-bold text-white">TripAdvisor Listing</span>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Guest Notes Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 space-y-8">
                <div className="space-y-1 flex justify-between items-end">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#c59b67] font-semibold">Guest Notes</span>
                        <h2 className="text-2xl sm:text-3xl font-serif text-white">What guests remember.</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviewsList.length > 0 ? (
                        reviewsList.map((rev, index) => {
                            const reviewerName = rev.name || 'Guest';
                            const initial = reviewerName.charAt(0).toUpperCase();
                            const reviewText = rev.comment || rev.review || '';
                            const isLongText = reviewText.length > 100;
                            const isExpanded = expandedReviews[index];

                            return (
                                <div key={index} className="bg-[#4F3727] text-[#e7e2d8] p-6 rounded-3xl shadow-xl border border-[#2c2622] flex flex-col justify-between space-y-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#8b5a2b]/30 border border-[#8b5a2b]/50 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                                            {initial}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{reviewerName}</h4>
                                            <span className="text-[11px] text-[#b8b0a2]">{rev.date || 'Recent'}</span>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={14} className={i < (rev.rating || 5) ? 'text-amber-400' : 'text-[#3c3530]'} />
                                        ))}
                                    </div>

                                    {/* Comment & Read More */}
                                    <div className="space-y-2">
                                        <p className="text-xs sm:text-sm text-[#e7e2d8] leading-relaxed">
                                            {isLongText && !isExpanded ? `${reviewText.substring(0, 100)}...` : reviewText}
                                        </p>
                                        {isLongText && (
                                            <button
                                                type="button"
                                                onClick={() => toggleReadMore(index)}
                                                className="text-[#c59b67] hover:underline text-xs font-semibold focus:outline-none"
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-center text-[#b8b0a2] text-xs py-8">
                            No reviews available yet. Be the first to share your experience!
                        </div>
                    )}
                </div>
            </div>

            {/* Review Form Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
                <div className="bg-[#4F3727] text-[#e7e2d8] p-6 sm:p-10 rounded-3xl shadow-xl border border-[#2c2622]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-serif text-white">Dined with us?</h2>
                            <p className="text-xs sm:text-sm text-[#b8b0a2]">
                                Leave a note for our kitchen and future guests.
                            </p>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#e7e2d8]">Your name:</label>
                                <input
                                    type="text"
                                    value={customReviewerName}
                                    onChange={(e) => setCustomReviewerName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-[#2c2622] border border-[#3c3530] rounded-xl px-4 py-3 text-xs text-[#e7e2d8] focus:outline-none focus:border-[#8b5a2b]"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#e7e2d8]">Select Rating:</label>
                                <div className="flex items-center gap-2 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRatingValue(star)}
                                            className="focus:outline-none cursor-pointer"
                                        >
                                            <FaStar
                                                size={20}
                                                className={star <= ratingValue ? 'text-[#8b5a2b]' : 'text-[#3c3530]'}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs font-bold text-[#8b5a2b] ml-2">({ratingValue} / 5)</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#e7e2d8]">Your review:</label>
                                <textarea
                                    rows="4"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Tell us about your meal..."
                                    className="w-full bg-[#2c2622] border border-[#3c3530] rounded-xl p-4 text-xs text-[#e7e2d8] focus:outline-none focus:border-[#8b5a2b]"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="bg-[#8b5a2b] hover:bg-[#724822] text-white px-6 py-3 rounded-full text-xs font-semibold transition cursor-pointer shadow-md"
                            >
                                {submittingReview ? 'Submitting...' : 'Share review'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
}