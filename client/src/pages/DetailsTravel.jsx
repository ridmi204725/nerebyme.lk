import React, { useState, useEffect } from 'react';
import PackageGallery from '../components/PackageGallery';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { notify } from '../utils/notifications';
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
    FaCompass,
    FaCoins
} from 'react-icons/fa';

export default function DetailsTravel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [travelPlace, setTravelPlace] = useState(null);
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

    const showNotification = (type, text) => notify(type, text);

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

        const fetchTravelDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/api/items/${id}`);
                let itemData = null;

                if (res.data && res.data.data) {
                    itemData = res.data.data;
                } else if (res.data) {
                    itemData = res.data;
                }

                if (itemData) {
                    setTravelPlace(itemData);
                    setReviewsList(Array.isArray(itemData.reviews) ? itemData.reviews : []);
                }
            } catch (err) {
                console.error("Error fetching travel details:", err);
                setError("Failed to load travel details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTravelDetails();
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

            const reviewResponse = await axios.post(
                `${API_BASE_URL}/api/reviews/items/${id}/reviews`,
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
            <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex items-center justify-center font-sans">

            <PackageGallery images={travelPlace?.packageImages || []} title="Travel Packages" />
                <p className="text-[#0284c7] animate-pulse text-sm font-semibold">Loading Adventure...</p>
            </div>
        );
    }

    if (error || !travelPlace) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-[#f8fafc] gap-4 font-sans px-4 text-center">
            <PackageGallery images={travelPlace?.packageImages || []} title="Travel Packages" />
                <div className="text-sm font-medium text-rose-400">{error || "Travel destination not found."}</div>
                <Link to="/travel" className="bg-[#0284c7] hover:bg-[#0369a1] px-4 py-2 rounded-xl text-xs font-bold transition text-white">
                    Back to Destinations
                </Link>
            </div>
        );
    }

    // Gallery / Packages images helper
    const galleryImages = (() => {
        let rawImages = [];

        if (Array.isArray(travelPlace.menuImages) && travelPlace.menuImages.length > 0) {
            rawImages = travelPlace.menuImages;
        } else if (Array.isArray(travelPlace.menu) && travelPlace.menu.length > 0) {
            rawImages = travelPlace.menu;
        } else if (Array.isArray(travelPlace.images) && travelPlace.images.length > 0) {
            rawImages = travelPlace.images;
        }

        return rawImages.map(item => {
            if (!item) return '';
            if (typeof item === 'string') return item;
            return item.image || item.url || item.imageUrl || '';
        }).filter(Boolean);
    })();

    return (
        <div className="w-full min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans selection:bg-[#f97316] selection:text-white pb-16">

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
                    className="bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-[#334155] cursor-pointer text-xs"
                >
                    <FaArrowLeft size={12} /> Back
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showNotification('success', 'Link copied to clipboard!');
                    }}
                    className="bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-[#334155] cursor-pointer text-xs"
                >
                    <FaShareAlt size={12} /> Share
                </button>
            </div>

            {/* Hero Banner Section */}
            <div className="w-full relative h-[380px] sm:h-[480px] md:h-[540px] overflow-hidden">
                <img
                    src={travelPlace.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
                    alt={travelPlace.name || travelPlace.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/30 to-black/40"></div>

                <div className="absolute bottom-8 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 flex flex-col items-start gap-2">
                    <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#f97316] uppercase font-bold">
                        {travelPlace.category || 'Adventure • Exploration'} {travelPlace.subCategory ? `• ${travelPlace.subCategory}` : ''}
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide">
                        {travelPlace.name || travelPlace.title}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-slate-200">
                        <FaMapMarkerAlt className="text-[#f97316] shrink-0" size={16} />
                        <span>{travelPlace.location || 'Ella, Sri Lanka'}</span>
                    </div>
                </div>
            </div>

            {/* Info and Map Preview Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    <div className="md:col-span-2 bg-[#1e293b] text-[#f8fafc] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl border border-[#334155]">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
                                <span className="text-xs uppercase tracking-widest text-[#0284c7] font-bold">Trip Quick Info</span>
                                <div className="flex items-center gap-1.5 bg-[#0f172a]/60 px-3 py-1 rounded-full border border-[#334155]">
                                    <FaStar className="text-amber-400" size={14} />
                                    <span className="text-xs font-bold text-white">{travelPlace.rating || '4.9'} / 5</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 bg-[#0f172a]/40 p-4 rounded-2xl border border-[#334155]">
                                    <div className="p-2.5 bg-[#0284c7]/20 rounded-xl text-[#0284c7] mt-0.5">
                                        <FaPhoneAlt size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Inquiries</span>
                                        {travelPlace.contact ? (
                                            <a href={`tel:${travelPlace.contact}`} className="hover:underline text-xs font-bold text-white mt-0.5 block">
                                                {travelPlace.contact}
                                            </a>
                                        ) : (
                                            <span className="text-xs font-bold text-white mt-0.5 block">+94 77 123 4567</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-[#0f172a]/40 p-4 rounded-2xl border border-[#334155]">
                                    <div className="p-2.5 bg-[#f97316]/20 rounded-xl text-[#f97316] mt-0.5">
                                        <FaCoins size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Package Price</span>
                                        <span className="text-xs font-bold text-white mt-0.5 block">Rs. {travelPlace.price || travelPlace.pricePerNight || '5,500'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#0f172a]/40 p-4 rounded-2xl border border-[#334155]">
                                <div className="p-2.5 bg-[#0284c7]/20 rounded-xl text-[#0284c7]">
                                    <FaMapMarkerAlt size={14} />
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Destination Location</span>
                                    <span className="text-xs font-medium text-white mt-0.5 block">{travelPlace.location || 'Ella, Sri Lanka'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] text-[#f8fafc] p-4 sm:p-6 rounded-3xl flex flex-col justify-between shadow-xl space-y-4 border border-[#334155]">
                        <div className="w-full h-36 sm:h-40 bg-[#0f172a] rounded-2xl overflow-hidden relative border border-[#334155]">
                            {travelPlace.mapUrl ? (
                                <iframe
                                    title="Travel Map Preview"
                                    src={travelPlace.mapUrl.includes('iframe') ? travelPlace.mapUrl.match(/src="([^"]+)"/)?.[1] || travelPlace.mapUrl : travelPlace.mapUrl}
                                    className="w-full h-full border-0 pointer-events-none"
                                    loading="lazy"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 text-center px-4">
                                    Map preview not configured
                                </div>
                            )}
                        </div>

                        <a
                            href={
                                travelPlace.mapUrl && !travelPlace.mapUrl.includes('iframe')
                                    ? travelPlace.mapUrl
                                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((travelPlace.name || travelPlace.title) + ' ' + (travelPlace.location || ''))}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-2xl text-xs font-bold transition shadow-md text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaRoute size={14} /> Get Directions / Map
                        </a>
                    </div>
                </div>
            </div>

            {/* About the Destination Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 border-t border-b border-[#334155] py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#f97316] font-bold block mb-2">Explore & Discover</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">About the Destination</h2>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {travelPlace.aboutUs || travelPlace.description || 'Embark on an unforgettable journey surrounded by breathtaking landscapes, misty mountains, and thrilling trails designed for true adventure seekers and nature enthusiasts.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery / Highlights Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
                <div className="text-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#f97316] font-bold">Visual Journey</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Moments captured on the trail.</h2>
                </div>

                <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden relative shadow-2xl border border-[#334155]">
                    <img
                        src={galleryImages[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'}
                        alt="Gallery Preview"
                        className="w-full h-full object-cover"
                    />
                </div>

                {galleryImages.length > 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                        {galleryImages.slice(1).map((imgUrl, index) => (
                            <div key={index} className="bg-[#1e293b] border border-[#334155] p-2 rounded-2xl overflow-hidden group">
                                <div className="relative h-48 w-full rounded-xl overflow-hidden">
                                    <img
                                        src={imgUrl}
                                        alt={`Gallery item ${index + 2}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Social Media Links Section */}
            {(travelPlace.facebookUrl || travelPlace.instagramUrl) && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-2">
                        {travelPlace.facebookUrl && (
                            <a
                                href={travelPlace.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] px-5 py-3 rounded-2xl border border-[#334155] shadow-lg shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                                    <FaFacebook size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Join community</span>
                                    <span className="text-xs font-bold text-white">Facebook Page</span>
                                </div>
                            </a>
                        )}

                        {travelPlace.instagramUrl && (
                            <a
                                href={travelPlace.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] px-5 py-3 rounded-2xl border border-[#334155] shadow-lg shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-pink-600/20 text-pink-400 rounded-xl">
                                    <FaInstagram size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">View adventures</span>
                                    <span className="text-xs font-bold text-white">Instagram Profile</span>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Traveler Reviews Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 space-y-8">
                <div className="space-y-1 flex justify-between items-end">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#f97316] font-bold">Traveler Notes</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Stories from fellow travelers.</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviewsList.length > 0 ? (
                        reviewsList.map((rev, index) => {
                            const reviewerName = rev.name || 'Traveler';
                            const initial = reviewerName.charAt(0).toUpperCase();
                            const reviewText = rev.comment || rev.review || '';
                            const isLongText = reviewText.length > 100;
                            const isExpanded = expandedReviews[index];

                            return (
                                <div key={index} className="bg-[#1e293b] text-[#f8fafc] p-6 rounded-3xl shadow-xl border border-[#334155] flex flex-col justify-between space-y-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#0284c7]/20 border border-[#0284c7]/40 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                                            {initial}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{reviewerName}</h4>
                                            <span className="text-[11px] text-slate-400">{rev.date || 'Recent'}</span>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={14} className={i < (rev.rating || 5) ? 'text-amber-400' : 'text-[#334155]'} />
                                        ))}
                                    </div>

                                    {/* Comment & Read More */}
                                    <div className="space-y-2">
                                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                                            {isLongText && !isExpanded ? `${reviewText.substring(0, 100)}...` : reviewText}
                                        </p>
                                        {isLongText && (
                                            <button
                                                type="button"
                                                onClick={() => toggleReadMore(index)}
                                                className="text-[#f97316] hover:underline text-xs font-semibold focus:outline-none"
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-center text-slate-400 text-xs py-8">
                            No reviews available yet. Be the first explorer to share your experience!
                        </div>
                    )}
                </div>
            </div>

            {/* Review Form Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
                <div className="bg-[#1e293b] text-[#f8fafc] p-6 sm:p-10 rounded-3xl shadow-xl border border-[#334155]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Visited this place?</h2>
                            <p className="text-xs sm:text-sm text-slate-300">
                                Share your expedition tips and feedback with upcoming travelers.
                            </p>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-200">Your name:</label>
                                <input
                                    type="text"
                                    value={customReviewerName}
                                    onChange={(e) => setCustomReviewerName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0284c7]"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-200">Select Rating:</label>
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
                                                className={star <= ratingValue ? 'text-amber-400' : 'text-[#334155]'}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs font-bold text-amber-400 ml-2">({ratingValue} / 5)</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-200">Your review:</label>
                                <textarea
                                    rows="4"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Tell us about your trip..."
                                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#0284c7]"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-full text-xs font-bold transition cursor-pointer shadow-md"
                            >
                                {submittingReview ? 'Submitting...' : 'Share Review'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
}