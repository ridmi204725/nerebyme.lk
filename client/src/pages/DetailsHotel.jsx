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
    FaFacebook,
    FaInstagram,
    FaTripadvisor,
    FaBed,
    FaCoins
} from 'react-icons/fa';

export default function DetailsHotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [hotel, setHotel] = useState(null);
    const [error, setError] = useState(null);

    const [message, setMessage] = useState({ type: '', text: '' });

    const [ratingValue, setRatingValue] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [customReviewerName, setCustomReviewerName] = useState('');
    const [reviewsList, setReviewsList] = useState([]);
    const [submittingReview, setSubmittingReview] = useState(false);

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

        const fetchHotelDetails = async () => {
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
                    setHotel(itemData);
                    setReviewsList(Array.isArray(itemData.reviews) ? itemData.reviews : []);
                }
            } catch (err) {
                console.error("Error fetching hotel details:", err);
                setError("Failed to load hotel details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHotelDetails();
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
            <div className="min-h-screen bg-[#0f172a] text-[#cbd5e1] flex items-center justify-center font-serif">

            <PackageGallery images={hotel?.packageImages || []} title="Hotel Packages" />
                <p className="text-[#d4af37] animate-pulse text-sm font-semibold">Loading Luxury Suite...</p>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-[#cbd5e1] gap-4 font-serif px-4 text-center">
            <PackageGallery images={hotel?.packageImages || []} title="Hotel Packages" />
                <div className="text-sm font-medium text-rose-400">{error || "Hotel not found."}</div>
                <Link to="/hotels" className="bg-[#d4af37] hover:bg-[#b3922d] px-4 py-2 rounded-xl text-xs font-bold transition text-[#0f172a]">
                    Back to Hotels
                </Link>
            </div>
        );
    }

    const hotelImages = (() => {
        let rawImages = [];
        if (Array.isArray(hotel.images) && hotel.images.length > 0) {
            rawImages = hotel.images;
        } else if (Array.isArray(hotel.menuImages) && hotel.menuImages.length > 0) {
            rawImages = hotel.menuImages;
        }
        return rawImages.map(item => {
            if (!item) return '';
            if (typeof item === 'string') return item;
            return item.image || item.url || item.imageUrl || '';
        }).filter(Boolean);
    })();

    // Hotel Room Packages ලබා ගැනීම (roomPackages හෝ menu හරහා)
    const roomPackages = (() => {
        if (Array.isArray(hotel.roomPackages) && hotel.roomPackages.length > 0) {
            return hotel.roomPackages;
        }
        if (Array.isArray(hotel.menu) && hotel.menu.length > 0) {
            return hotel.menu;
        }
        return [];
    })();

    return (
        <div className="w-full min-h-screen bg-[#0f172a] text-[#cbd5e1] font-serif selection:bg-[#d4af37] selection:text-[#0f172a] pb-16">

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
                    className="bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-[#334155] cursor-pointer text-xs"
                >
                    <FaArrowLeft size={12} /> Back
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showNotification('success', 'Link copied to clipboard!');
                    }}
                    className="bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-[#334155] cursor-pointer text-xs"
                >
                    <FaShareAlt size={12} /> Share
                </button>
            </div>

            {/* Hero Banner Section */}
            <div className="w-full relative h-[380px] sm:h-[480px] md:h-[540px] overflow-hidden">
                <img
                    src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'}
                    alt={hotel.name || hotel.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/30 to-black/40"></div>

                <div className="absolute bottom-8 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 flex flex-col items-start gap-2">
                    <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                        {hotel.category || 'Luxury Hotel'} {hotel.subCategory ? `• ${hotel.subCategory}` : ''}
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-wide font-serif">
                        {hotel.name || hotel.title}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                        <FaMapMarkerAlt className="text-[#d4af37] shrink-0" size={16} />
                        <span>{hotel.location || 'Colombo, Sri Lanka'}</span>
                    </div>
                </div>
            </div>

            {/* Info and Map Preview Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    <div className="md:col-span-2 bg-[#1e293b] text-[#cbd5e1] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl border border-[#334155]">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-[#334155]/60 pb-4">
                                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Quick Information</span>
                                <div className="flex items-center gap-1.5 bg-[#0f172a]/40 px-3 py-1 rounded-full border border-[#334155]">
                                    <FaStar className="text-[#d4af37]" size={14} />
                                    <span className="text-xs font-bold text-white">{hotel.rating || '5.0'} / 5</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 bg-[#0f172a]/30 p-4 rounded-2xl border border-[#334155]/50">
                                    <div className="p-2.5 bg-[#d4af37]/20 rounded-xl text-[#d4af37] mt-0.5">
                                        <FaCoins size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Price per Night</span>
                                        <span className="text-xs font-bold text-white mt-0.5 block">Rs. {hotel.price || hotel.pricePerNight || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-[#0f172a]/30 p-4 rounded-2xl border border-[#334155]/50">
                                    <div className="p-2.5 bg-[#d4af37]/20 rounded-xl text-[#d4af37] mt-0.5">
                                        <FaPhoneAlt size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Contact</span>
                                        {hotel.contact ? (
                                            <a href={`tel:${hotel.contact}`} className="hover:underline text-xs font-bold text-white mt-0.5 block">
                                                {hotel.contact}
                                            </a>
                                        ) : (
                                            <span className="text-xs font-bold text-white mt-0.5 block">+94 11 200 3000</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#0f172a]/30 p-4 rounded-2xl border border-[#334155]/50">
                                <div className="p-2.5 bg-[#d4af37]/20 rounded-xl text-[#d4af37]">
                                    <FaMapMarkerAlt size={14} />
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Location Address</span>
                                    <span className="text-xs font-medium text-white mt-0.5 block">{hotel.location || 'Colombo, Sri Lanka'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] text-[#cbd5e1] p-4 sm:p-6 rounded-3xl flex flex-col justify-between shadow-xl space-y-4 border border-[#334155]">
                        <div className="w-full h-36 sm:h-40 bg-[#0f172a] rounded-2xl overflow-hidden relative border border-[#334155]">
                            {hotel.mapUrl ? (
                                <iframe
                                    title="Hotel Map Preview"
                                    src={hotel.mapUrl.includes('iframe') ? hotel.mapUrl.match(/src="([^"]+)"/)?.[1] || hotel.mapUrl : hotel.mapUrl}
                                    className="w-full h-full border-0 pointer-events-none"
                                    loading="lazy"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-[#94a3b8] text-center px-4">
                                    Map preview not configured
                                </div>
                            )}
                        </div>

                        <a
                            href={
                                hotel.mapUrl && !hotel.mapUrl.includes('iframe')
                                    ? hotel.mapUrl
                                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((hotel.name || hotel.title) + ' ' + (hotel.location || ''))}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#d4af37] hover:bg-[#b3922d] text-[#0f172a] py-3 rounded-2xl text-xs font-bold transition shadow-md text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaRoute size={14} /> Get Directions / View Map
                        </a>
                    </div>
                </div>
            </div>

            {/* About the Hotel Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 border-t border-b border-[#334155] py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block mb-2">The Legacy</span>
                        <h2 className="text-2xl sm:text-3xl font-serif text-white">About the Property</h2>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                            {hotel.aboutUs || hotel.description || 'Experience world-class luxury, immaculate comfort, and bespoke hospitality tailored for the distinguished traveler. Enjoy serene views, fine dining, and exclusive amenities designed for absolute relaxation.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Room Packages / Suites Section (Dynamic from EditPlacePage) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
                <div className="text-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold">Accommodation & Suites</span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-white">Available Room Packages & Rates</h2>
                </div>

                {roomPackages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                        {roomPackages.map((pkg, index) => (
                            <div key={index} className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
                                {pkg.image && (
                                    <div className="w-full h-40 rounded-2xl overflow-hidden mb-2 bg-[#0f172a]">
                                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            <FaBed className="text-[#d4af37]" size={14} /> {pkg.name}
                                        </h3>
                                        <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2.5 py-1 rounded-full font-semibold">{pkg.category || 'Suite'}</span>
                                    </div>
                                    <p className="text-xs text-[#d4af37] font-bold">Rs. {pkg.price || 'N/A'}</p>
                                    {pkg.description && <p className="text-xs text-[#94a3b8] leading-relaxed">{pkg.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-[#94a3b8] text-xs bg-[#1e293b] border border-[#334155] rounded-3xl">
                        No specific room packages configured yet.
                    </div>
                )}

                {/* Hotel Gallery Images */}
                {hotelImages.length > 0 && (
                    <div className="pt-8 space-y-4">
                        <h3 className="text-lg font-serif text-white text-center">Property Gallery</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {hotelImages.map((imgUrl, index) => (
                                <div key={index} className="bg-[#1e293b] border border-[#334155] p-2 rounded-2xl overflow-hidden group">
                                    <div className="relative h-48 w-full rounded-xl overflow-hidden">
                                        <img
                                            src={imgUrl}
                                            alt={`Hotel view ${index + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Social Media Links Horizontal Scroll Section */}
            {(hotel.facebookUrl || hotel.instagramUrl || hotel.tripadvisorUrl) && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-2">
                        {hotel.facebookUrl && (
                            <a
                                href={hotel.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] px-5 py-3 rounded-2xl border border-[#334155] shadow-lg shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                                    <FaFacebook size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Connect with us</span>
                                    <span className="text-xs font-bold text-white">Facebook Page</span>
                                </div>
                            </a>
                        )}

                        {hotel.instagramUrl && (
                            <a
                                href={hotel.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] px-5 py-3 rounded-2xl border border-[#334155] shadow-lg shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-pink-600/20 text-pink-400 rounded-xl">
                                    <FaInstagram size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Follow photos</span>
                                    <span className="text-xs font-bold text-white">Instagram Profile</span>
                                </div>
                            </a>
                        )}

                        {hotel.tripadvisorUrl && (
                            <a
                                href={hotel.tripadvisorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] px-5 py-3 rounded-2xl border border-[#334155] shadow-lg shrink-0 transition duration-200"
                            >
                                <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
                                    <FaTripadvisor size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Read reviews</span>
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
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold">Guest Notes</span>
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
                                <div key={index} className="bg-[#1e293b] text-[#cbd5e1] p-6 rounded-3xl shadow-xl border border-[#334155] flex flex-col justify-between space-y-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#d4af37]/30 border border-[#d4af37]/50 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                                            {initial}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{reviewerName}</h4>
                                            <span className="text-[11px] text-[#94a3b8]">{rev.date || 'Recent'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-[#d4af37]">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={14} className={i < (rev.rating || 5) ? 'text-[#d4af37]' : 'text-[#334155]'} />
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                                            {isLongText && !isExpanded ? `${reviewText.substring(0, 100)}...` : reviewText}
                                        </p>
                                        {isLongText && (
                                            <button
                                                type="button"
                                                onClick={() => toggleReadMore(index)}
                                                className="text-[#d4af37] hover:underline text-xs font-semibold focus:outline-none"
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-center text-[#94a3b8] text-xs py-8">
                            No reviews available yet. Be the first to share your experience!
                        </div>
                    )}
                </div>
            </div>

            {/* Review Form Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
                <div className="bg-[#1e293b] text-[#cbd5e1] p-6 sm:p-10 rounded-3xl shadow-xl border border-[#334155]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-serif text-white">Stayed with us?</h2>
                            <p className="text-xs sm:text-sm text-[#94a3b8]">
                                Leave a note for our management and future guests.
                            </p>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#cbd5e1]">Your name:</label>
                                <input
                                    type="text"
                                    value={customReviewerName}
                                    onChange={(e) => setCustomReviewerName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-xs text-[#cbd5e1] focus:outline-none focus:border-[#d4af37]"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#cbd5e1]">Select Rating:</label>
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
                                                className={star <= ratingValue ? 'text-[#d4af37]' : 'text-[#334155]'}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs font-bold text-[#d4af37] ml-2">({ratingValue} / 5)</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#cbd5e1]">Your review:</label>
                                <textarea
                                    rows="4"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Tell us about your stay..."
                                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-4 text-xs text-[#cbd5e1] focus:outline-none focus:border-[#d4af37]"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="bg-[#d4af37] hover:bg-[#b3922d] text-[#0f172a] px-6 py-3 rounded-full text-xs font-semibold transition cursor-pointer shadow-md"
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