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
    FaFilm,
    FaChair,
    FaTicketAlt
} from 'react-icons/fa';

export default function DetailsMovie() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [theater, setThemeData] = useState(null);
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

        const fetchTheaterDetails = async () => {
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
                    setThemeData(itemData);
                    setReviewsList(Array.isArray(itemData.reviews) ? itemData.reviews : []);
                }
            } catch (err) {
                console.error("Error fetching theater details:", err);
                setError("Failed to load movie theater details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTheaterDetails();
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

            try {
                const reviewResponse = await axios.post(
                    `${API_BASE_URL}/api/reviews/items/${id}/reviews`,
                    newReview,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }
                );
                if (reviewResponse.data?.data) setReviewsList(reviewResponse.data.data);
            } catch (backendErr) {
                throw backendErr;
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
            <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center font-sans">

            <PackageGallery images={theater?.packageImages || []} title="Special Offers" />
                <p className="text-[#d4af37] animate-pulse text-sm font-semibold">Loading Cinematic Experience...</p>
            </div>
        );
    }

    if (error || !theater) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-[#f4f4f5] gap-4 font-sans px-4 text-center">
            <PackageGallery images={theater?.packageImages || []} title="Movie Packages" />
                <div className="text-sm font-medium text-[#dc2626]">{error || "Movie theater not found."}</div>
                <Link to="/movie-theaters" className="bg-[#dc2626] hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-bold transition text-white">
                    Back to Theaters
                </Link>
            </div>
        );
    }

    const showImages = (() => {
        let imgs = [];
        if (theater.menuImages && Array.isArray(theater.menuImages)) {
            theater.menuImages.forEach(img => {
                if (typeof img === 'string') imgs.push(img);
                else if (img?.image || img?.url) imgs.push(img.image || img.url);
            });
        }
        return imgs;
    })();

    return (
        <div className="w-full min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-[#dc2626] selection:text-white pb-16">

            {message.text && (
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white font-medium shadow-2xl border ${
                        message.type === 'error'
                            ? 'bg-rose-950/90 border-[#dc2626] shadow-rose-950/50'
                            : 'bg-emerald-950/90 border-emerald-600 shadow-emerald-950/50'
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
                    className="bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-zinc-800 cursor-pointer text-xs"
                >
                    <FaArrowLeft size={12} /> Back
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showNotification('success', 'Link copied to clipboard!');
                    }}
                    className="bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-zinc-800 cursor-pointer text-xs"
                >
                    <FaShareAlt size={12} /> Share
                </button>
            </div>

            {/* Hero Banner Section */}
            <div className="w-full relative h-[380px] sm:h-[480px] md:h-[540px] overflow-hidden">
                <img
                    src={theater.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200'}
                    alt={theater.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-black/60"></div>

                <div className="absolute bottom-8 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 flex flex-col items-start gap-2">
                    <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold flex items-center gap-1.5">
                        <FaFilm className="text-[#dc2626]" /> {theater.subCategory || 'IMAX / 3D'} • {theater.movieType || 'Public Cinema'}
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wide">
                        {theater.name}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <FaMapMarkerAlt className="text-[#dc2626] shrink-0" size={16} />
                        <span>{theater.location} {theater.district ? `(${theater.district})` : ''}</span>
                    </div>
                </div>
            </div>

            {/* Info and Map Preview Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    <div className="md:col-span-2 bg-[#121216] text-[#f4f4f5] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl border border-zinc-800/80">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">Theater Details</span>
                                <div className="flex items-center gap-1.5 bg-[#dc2626]/10 px-3 py-1 rounded-full border border-[#dc2626]/30">
                                    <FaStar className="text-[#d4af37]" size={14} />
                                    <span className="text-xs font-bold text-white">{theater.rating || '4.5'} / 5</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 bg-[#18181b] p-4 rounded-2xl border border-zinc-800">
                                    <div className="p-2.5 bg-[#dc2626]/15 rounded-xl text-[#dc2626] mt-0.5">
                                        <FaPhoneAlt size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Contact</span>
                                        {theater.contact ? (
                                            <a href={`tel:${theater.contact}`} className="hover:underline text-xs font-bold text-white mt-0.5 block">
                                                {theater.contact}
                                            </a>
                                        ) : (
                                            <span className="text-xs font-bold text-white mt-0.5 block">N/A</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-[#18181b] p-4 rounded-2xl border border-zinc-800">
                                    <div className="p-2.5 bg-[#d4af37]/15 rounded-xl text-[#d4af37] mt-0.5">
                                        <FaTicketAlt size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Ticket Price</span>
                                        <span className="text-xs font-bold text-emerald-400 mt-0.5 block">LKR {theater.ticketPrice ? Number(theater.ticketPrice).toLocaleString() : '1,500'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 bg-[#18181b] p-4 rounded-2xl border border-zinc-800">
                                    <div className="p-2.5 bg-blue-500/15 rounded-xl text-blue-400 mt-0.5">
                                        <FaChair size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Seat Capacity</span>
                                        <span className="text-xs font-bold text-white mt-0.5 block">{theater.seatCapacity || '150'} Seats</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-[#18181b] p-4 rounded-2xl border border-zinc-800">
                                    <div className="p-2.5 bg-emerald-500/15 rounded-xl text-emerald-400 mt-0.5">
                                        <FaClock size={14} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Facilities</span>
                                        <span className="text-xs font-bold text-white mt-0.5 block">{theater.facilities || 'AC, Dolby Audio, Parking'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#121216] text-[#f4f4f5] p-4 sm:p-6 rounded-3xl flex flex-col justify-between shadow-xl space-y-4 border border-zinc-800">
                        <div className="w-full h-36 sm:h-40 bg-[#18181b] rounded-2xl overflow-hidden relative border border-zinc-800">
                            {theater.mapUrl ? (
                                <iframe
                                    title="Theater Map Preview"
                                    src={theater.mapUrl.includes('iframe') ? theater.mapUrl.match(/src="([^"]+)"/)?.[1] || theater.mapUrl : theater.mapUrl}
                                    className="w-full h-full border-0 pointer-events-none"
                                    loading="lazy"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 text-center px-4">
                                    Map preview not available
                                </div>
                            )}
                        </div>

                        <a
                            href={
                                theater.mapUrl && !theater.mapUrl.includes('iframe')
                                    ? theater.mapUrl
                                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(theater.name + ' ' + theater.location)}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#dc2626] hover:bg-red-700 text-white py-3 rounded-2xl text-xs font-bold transition shadow-md text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaRoute size={14} /> Get Directions / View Map
                        </a>
                    </div>
                </div>
            </div>

            {/* About the Theater Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 border-t border-b border-zinc-800 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold block mb-2">Cinematic Luxury</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">About the Theater</h2>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                            {theater.aboutUs || 'Experience world-class movie screenings with state-of-the-art surround sound, crystal-clear projection, and premium seating arrangements designed for ultimate cinematic comfort.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery / Additional Photos Section */}
            {showImages.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold">Gallery</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Inside the Cinema.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {showImages.map((imgUrl, idx) => (
                            <div key={idx} className="w-full bg-[#121216] rounded-3xl overflow-hidden relative shadow-2xl border border-zinc-800 p-4 flex items-center justify-center">
                                <img
                                    src={imgUrl}
                                    alt={`Gallery ${idx + 1}`}
                                    className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Guest Reviews Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 space-y-8">
                <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold">Feedback</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">Audience Reviews.</h2>
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
                                <div key={index} className="bg-[#121216] text-[#f4f4f5] p-6 rounded-3xl shadow-xl border border-zinc-800 flex flex-col justify-between space-y-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] flex items-center justify-center font-bold text-lg">
                                            {initial}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{reviewerName}</h4>
                                            <span className="text-[10px] text-zinc-500">{rev.date || 'Recent'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1 text-[#d4af37]">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={12} className={i < (rev.rating || 5) ? 'text-[#d4af37]' : 'text-zinc-700'} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-zinc-300 leading-relaxed">
                                            {isLongText && !isExpanded ? `${reviewText.substring(0, 100)}...` : reviewText}
                                        </p>
                                        {isLongText && (
                                            <button
                                                type="button"
                                                onClick={() => toggleReadMore(index)}
                                                className="text-[11px] font-bold text-[#dc2626] hover:underline cursor-pointer pt-1"
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-xs text-zinc-500 col-span-full">No reviews yet. Be the first to share your experience!</p>
                    )}
                </div>

                {/* Add Review Form - Styled as requested based on reference image */}
                <div className="bg-[#121216] border border-zinc-800 p-8 sm:p-12 rounded-[32px] mt-12 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        {/* Left Side: Title & Description */}
                        <div className="space-y-3">
                            <h3 className="text-3xl font-bold text-white tracking-wide">
                                Enjoyed the show?
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Leave a note for our cinema management and future moviegoers.
                            </p>
                        </div>

                        {/* Right Side: Form Inputs */}
                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-zinc-300 mb-2">
                                    Your name:
                                </label>
                                <input
                                    type="text"
                                    value={customReviewerName}
                                    onChange={(e) => setCustomReviewerName(e.target.value)}
                                    required
                                    placeholder="Enter your name"
                                    className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#d4af37] transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-300 mb-2">
                                    Select Rating:
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 cursor-pointer">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                size={22}
                                                onClick={() => setRatingValue(star)}
                                                className={`transition-colors ${
                                                    star <= ratingValue ? 'text-[#d4af37]' : 'text-zinc-700'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-[#d4af37] font-semibold ml-2">
                                        ({ratingValue} / 5)
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-300 mb-2">
                                    Your review:
                                </label>
                                <textarea
                                    rows="4"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    required
                                    placeholder="Tell us about your experience..."
                                    className="w-full bg-[#18181b] border border-zinc-800 rounded-2xl p-4 text-white text-xs focus:outline-none focus:border-[#d4af37] transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="bg-[#dc2626] hover:bg-red-700 text-white py-3.5 px-7 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer disabled:opacity-50 shadow-lg inline-flex items-center justify-center"
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