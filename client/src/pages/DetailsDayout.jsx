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
    FaTripadvisor,
    FaCoins
} from 'react-icons/fa';

export default function DetailsDayout() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [itemDetails, setItemDetails] = useState(null);
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

        const fetchDetails = async () => {
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
                    setItemDetails(itemData);
                    setReviewsList(Array.isArray(itemData.reviews) ? itemData.reviews : []);
                }
            } catch (err) {
                console.error("Error fetching dayout details:", err);
                setError("Failed to load day out details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
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

            const reviewResponse = await axios.post(
                `${API_BASE_URL}/api/admin/items/${id}/reviews`,
                newReview,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }
            );
            if (reviewResponse.data?.data) setReviewsList(reviewResponse.data.data);

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
            <div className="min-h-screen bg-[#0d1b12] text-[#34d399] flex flex-col items-center justify-center font-serif gap-6">

            <PackageGallery images={itemDetails?.packageImages || []} title="Dayout Packages" />
                {/* Updated SVG Loading Animation */}
                <div className="w-24 h-24 relative flex items-center justify-center">
                    <svg className="animate-spin w-full h-full text-[#34d399]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 14.129 2.66872 16.1158 3.83404 17.75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#34d399] rounded-full animate-ping"></div>
                    </div>
                </div>
                <p className="text-[#34d399] animate-pulse text-xs font-semibold tracking-widest uppercase">Loading Eco-Resort Experience...</p>
            </div>
        );
    }

    if (error || !itemDetails) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1b12] text-[#a7f3d0] gap-4 font-serif px-4 text-center">
            <PackageGallery images={itemDetails?.packageImages || []} title="Dayout Packages" />
                <div className="text-sm font-medium text-rose-400">{error || "Day Out place not found."}</div>
                <Link to="/home" className="bg-[#34d399] hover:bg-[#10b981] px-4 py-2 rounded-xl text-xs font-bold transition text-[#0d1b12]">
                    Back to Home
                </Link>
            </div>
        );
    }

    const packageImages = (() => {
        let rawImages = [];

        if (Array.isArray(itemDetails.menuImages) && itemDetails.menuImages.length > 0) {
            rawImages = itemDetails.menuImages;
        } else if (Array.isArray(itemDetails.menu) && itemDetails.menu.length > 0) {
            rawImages = itemDetails.menu;
        } else if (Array.isArray(itemDetails.images) && itemDetails.images.length > 0) {
            rawImages = itemDetails.images;
        }

        return rawImages.map(item => {
            if (!item) return '';
            if (typeof item === 'string') return item;
            return item.image || item.url || item.imageUrl || '';
        }).filter(Boolean);
    })();

    return (
        <div className="w-full min-h-screen bg-[#0d1b12] text-[#a7f3d0] font-serif selection:bg-[#34d399] selection:text-[#0d1b12] pb-16">

            {message.text && (
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white font-medium shadow-2xl border ${
                        message.type === 'error'
                            ? 'bg-rose-950/95 border-rose-600 shadow-rose-950/50'
                            : 'bg-[#1b2e23]/95 border-[#34d399] shadow-emerald-950/50'
                    } backdrop-blur-md`}>
                        {message.type === 'error' ? <FaExclamationTriangle size={18} /> : <FaCheckCircle size={18} className="text-[#34d399]" />}
                        <span className="text-sm">{message.text}</span>
                    </div>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6 w-full">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-[#1b2e23] hover:bg-[#274433] text-[#34d399] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-[#274433] shadow-md cursor-pointer text-xs"
                >
                    <FaArrowLeft size={12} /> Back
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showNotification('success', 'Link copied to clipboard!');
                    }}
                    className="bg-[#1b2e23] hover:bg-[#274433] text-[#34d399] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-[#274433] shadow-md cursor-pointer text-xs"
                >
                    <FaShareAlt size={12} /> Share
                </button>
            </div>

            {/* Hero Banner Section */}
            <div className="w-full relative h-[380px] sm:h-[480px] md:h-[540px] overflow-hidden">
                <img
                    src={itemDetails.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200'}
                    alt={itemDetails.name || itemDetails.title}
                    className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b12] via-[#0d1b12]/40 to-black/60"></div>

                <div className="absolute bottom-8 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 flex flex-col items-start gap-2">
                    <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#fbbf24] uppercase font-bold bg-[#1b2e23]/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-[#274433]">
                        {itemDetails.category || 'Dayout • Nature Resort'} {itemDetails.subCategory ? `• ${itemDetails.subCategory}` : ''}
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-wide font-serif drop-shadow-md">
                        {itemDetails.name || itemDetails.title}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-[#a7f3d0] font-medium bg-[#1b2e23]/90 px-3.5 py-1.5 rounded-xl backdrop-blur-sm border border-[#274433]">
                        <FaMapMarkerAlt className="text-[#34d399] shrink-0" size={16} />
                        <span>{itemDetails.location || 'Kandy, Sri Lanka'}</span>
                    </div>
                </div>
            </div>

            {/* Info and Map Preview Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    <div className="md:col-span-2 bg-[#1b2e23] text-[#a7f3d0] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl border border-[#274433]">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-[#274433] pb-4">
                                <span className="text-xs uppercase tracking-widest text-[#fbbf24] font-bold">Day Out Information</span>
                                <div className="flex items-center gap-1.5 bg-[#111813] px-3 py-1 rounded-full border border-[#274433]">
                                    <FaStar className="text-[#fbbf24]" size={14} />
                                    <span className="text-xs font-bold text-white">{itemDetails.rating || '4.9'} / 5</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 bg-[#111813] p-4 rounded-2xl border border-[#274433]">
                                    <div className="p-2.5 bg-[#34d399]/10 text-[#34d399] rounded-xl mt-0.5">
                                        <FaPhoneAlt size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Contact</span>
                                        {itemDetails.contact ? (
                                            <a href={`tel:${itemDetails.contact}`} className="hover:underline text-xs font-bold text-white mt-0.5 block">
                                                {itemDetails.contact}
                                            </a>
                                        ) : (
                                            <span className="text-xs font-bold text-white mt-0.5 block">+94 81 223 4455</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-[#111813] p-4 rounded-2xl border border-[#274433]">
                                    <div className="p-2.5 bg-[#34d399]/10 text-[#34d399] rounded-xl mt-0.5">
                                        <FaClock size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Day Out Time</span>
                                        <span className="text-xs font-bold text-white mt-0.5 block">08:30 AM - 05:00 PM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#111813] p-4 rounded-2xl border border-[#274433]">
                                <div className="p-2.5 bg-[#fbbf24]/10 text-[#fbbf24] rounded-xl">
                                    <FaCoins size={14} />
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Package Starting Price</span>
                                    <span className="text-xs font-bold text-[#34d399] mt-0.5 block">Rs. {itemDetails.price || '3,500'} onwards per person</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1b2e23] text-[#a7f3d0] p-4 sm:p-6 rounded-3xl flex flex-col justify-between shadow-xl space-y-4 border border-[#274433]">
                        <div className="w-full h-36 sm:h-40 bg-[#111813] rounded-2xl overflow-hidden relative border border-[#274433]">
                            {itemDetails.mapUrl ? (
                                <iframe
                                    title="Dayout Map Preview"
                                    src={itemDetails.mapUrl.includes('iframe') ? itemDetails.mapUrl.match(/src="([^"]+)"/)?.[1] || itemDetails.mapUrl : itemDetails.mapUrl}
                                    className="w-full h-full border-0 pointer-events-none"
                                    loading="lazy"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 text-center px-4">
                                    Map preview not configured
                                </div>
                            )}
                        </div>

                        <a
                            href={
                                itemDetails.mapUrl && !itemDetails.mapUrl.includes('iframe')
                                    ? itemDetails.mapUrl
                                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((itemDetails.name || itemDetails.title) + ' ' + (itemDetails.location || ''))}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#34d399] hover:bg-[#10b981] text-[#0d1b12] py-3 rounded-2xl text-xs font-bold transition shadow-md text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaRoute size={14} /> Get Directions / View Map
                        </a>
                    </div>
                </div>
            </div>

            {/* About the Experience Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 border-t border-b border-[#274433] py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#fbbf24] font-bold block mb-2">Natural Escape</span>
                        <h2 className="text-2xl sm:text-3xl font-serif text-white">About This Day Out</h2>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                            {itemDetails.aboutUs || itemDetails.description || 'Immerse yourself in nature with a refreshing day out experience. Enjoy lush green surroundings, swimming pool access, authentic local meals, and peaceful outdoor relaxation spots tailored for family and friends.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery / Packages Photo Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
                <div className="text-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#34d399] font-bold">Visual Tour</span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-white">Captured moments of tranquility.</h2>
                </div>

                <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden relative shadow-xl border border-[#274433] bg-[#1b2e23] p-2">
                    <img
                        src={packageImages[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200'}
                        alt="Dayout Preview"
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>

                {packageImages.length > 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                        {packageImages.slice(1).map((imgUrl, index) => (
                            <div key={index} className="bg-[#1b2e23] border border-[#274433] p-2 rounded-2xl overflow-hidden group shadow-md">
                                <div className="relative h-48 w-full rounded-xl overflow-hidden">
                                    <img
                                        src={imgUrl}
                                        alt={`Dayout gallery ${index + 2}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Social Media Links Horizontal Scroll Section */}
            {(itemDetails.facebookUrl || itemDetails.instagramUrl || itemDetails.tripadvisorUrl) && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-[#34d399] scrollbar-track-[#111813]">
                        {itemDetails.facebookUrl && (
                            <a
                                href={itemDetails.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1b2e23] hover:bg-[#274433] text-white px-5 py-3 rounded-2xl border border-[#274433] shadow-md shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                                    <FaFacebook size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Connect with us</span>
                                    <span className="text-xs font-bold text-white">Facebook Page</span>
                                </div>
                            </a>
                        )}

                        {itemDetails.instagramUrl && (
                            <a
                                href={itemDetails.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1b2e23] hover:bg-[#274433] text-white px-5 py-3 rounded-2xl border border-[#274433] shadow-md shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-pink-500/20 text-pink-400 rounded-xl">
                                    <FaInstagram size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Follow photos</span>
                                    <span className="text-xs font-bold text-white">Instagram Profile</span>
                                </div>
                            </a>
                        )}

                        {itemDetails.tripadvisorUrl && (
                            <a
                                href={itemDetails.tripadvisorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1b2e23] hover:bg-[#274433] text-white px-5 py-3 rounded-2xl border border-[#274433] shadow-md shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                                    <FaTripadvisor size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Read reviews</span>
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
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#34d399] font-bold">Visitor Stories</span>
                        <h2 className="text-2xl sm:text-3xl font-serif text-white">What visitors remember.</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviewsList.length > 0 ? (
                        reviewsList.map((rev, index) => {
                            const reviewerName = rev.name || 'Visitor';
                            const initial = reviewerName.charAt(0).toUpperCase();
                            const reviewText = rev.comment || rev.review || '';
                            const isLongText = reviewText.length > 100;
                            const isExpanded = expandedReviews[index];

                            return (
                                <div key={index} className="bg-[#1b2e23] text-[#a7f3d0] p-6 rounded-3xl shadow-xl border border-[#274433] flex flex-col justify-between space-y-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#34d399]/20 border border-[#34d399]/40 text-[#34d399] flex items-center justify-center font-bold text-lg shadow-inner">
                                            {initial}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{reviewerName}</h4>
                                            <span className="text-[11px] text-zinc-400">{rev.date || 'Recent'}</span>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex items-center gap-1 text-[#fbbf24]">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={14} className={i < (rev.rating || 5) ? 'text-[#fbbf24]' : 'text-zinc-700'} />
                                        ))}
                                    </div>

                                    {/* Comment & Read More */}
                                    <div className="space-y-2">
                                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                                            {isLongText && !isExpanded ? `${reviewText.substring(0, 100)}...` : reviewText}
                                        </p>
                                        {isLongText && (
                                            <button
                                                type="button"
                                                onClick={() => toggleReadMore(index)}
                                                className="text-[#34d399] hover:underline text-xs font-semibold focus:outline-none"
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span2 text-center text-zinc-500 text-xs py-8">
                            No reviews available yet. Be the first to share your day out experience!
                        </div>
                    )}
                </div>
            </div>

            {/* Review Form Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
                <div className="bg-[#1b2e23] text-[#a7f3d0] p-6 sm:p-10 rounded-3xl shadow-xl border border-[#274433]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-serif text-white">Enjoyed your day out?</h2>
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                                Leave a note for the management and future visitors.
                            </p>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-300">Your name:</label>
                                <input
                                    type="text"
                                    value={customReviewerName}
                                    onChange={(e) => setCustomReviewerName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-[#111813] border border-[#274433] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#34d399]"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-300">Select Rating:</label>
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
                                                className={star <= ratingValue ? 'text-[#fbbf24]' : 'text-zinc-700'}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs font-bold text-[#fbbf24] ml-2">({ratingValue} / 5)</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-300">Your review:</label>
                                <textarea
                                    rows="4"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Tell us about your day out experience..."
                                    className="w-full bg-[#111813] border border-[#274433] rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#34d399] resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="bg-[#34d399] hover:bg-[#10b981] text-[#0d1b12] px-6 py-3 rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
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