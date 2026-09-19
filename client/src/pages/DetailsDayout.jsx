import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import {
    FaSun, FaMapMarkerAlt, FaRoute, FaStar, FaPhoneAlt,
    FaInfoCircle, FaCoins, FaArrowLeft, FaLayerGroup,
    FaCheckCircle, FaExclamationTriangle, FaPaperPlane, FaUserCircle, FaShareAlt
} from 'react-icons/fa';

export default function DetailsDayout() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subPart, setSubPart] = useState('dayout');
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Custom Toast Notification සඳහා state එක
    const [message, setMessage] = useState({ type: '', text: '' });

    // Review Form සහ Reviews සඳහා අවශ්‍ය States
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [ratingValue, setRatingValue] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewsList, setReviewsList] = useState([]);
    const [submittingReview, setSubmittingReview] = useState(false);

    // Login වී ඇති User ගේ විස්තර ලබා ගැනීම
    const [currentUser, setCurrentUser] = useState({
        name: 'Guest User',
        email: ''
    });

    // Custom Toast පණිවිඩ පෙන්වීම සඳහා වන Helper function එක
    const showNotification = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 3500); // තත්පර 3.5 කින් පණිවිඩය ස්වයංක්‍රීයව අතුරුදහන් වේ
    };

    // Backend එකෙන් අදාළ Dayout විස්තර සහ Reviews ලබාගැනීම
    useEffect(() => {
        try {
            const storedName = localStorage.getItem('name') || localStorage.getItem('username') || localStorage.getItem('userName');
            const storedUserObj = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');

            const finalName = storedName || storedUserObj.name || storedUserObj.username;

            if (finalName) {
                setCurrentUser({
                    name: finalName,
                    email: storedUserObj.email || ''
                });
            }
        } catch (e) {
            console.error("Error reading user from localStorage", e);
        }

        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/api/admin/items/${id}`);
                if (res.data && res.data.data) {
                    setItemDetails(res.data.data);
                    setSubPart(res.data.data.category || 'dayout');
                    if (res.data.data.reviews && Array.isArray(res.data.data.reviews)) {
                        setReviewsList(res.data.data.reviews);
                    }
                } else if (res.data) {
                    setItemDetails(res.data);
                    if (res.data.reviews && Array.isArray(res.data.reviews)) {
                        setReviewsList(res.data.reviews);
                    }
                }
            } catch (err) {
                console.error("Error fetching dayout details:", err);
                showNotification('error', 'විස්තර ලබා ගැනීමේදී දෝෂයක් ඇති විය.');
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

    // Review එක Submit කිරීමේ Function එක
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) {
            showNotification('error', 'කරුණාකර ඔබේ අදහස (Comment) ඇතුළත් කරන්න.');
            return;
        }

        setSubmittingReview(true);
        try {
            const newReview = {
                id: Date.now(),
                name: currentUser.name,
                rating: Number(ratingValue),
                comment: reviewComment,
                date: new Date().toLocaleDateString()
            };

            // Backend API එකට Review එක යැවීමට අවශ්‍ය නම් මෙහි කේතය එකතු කළ හැක.
            // await axios.post(`${API_BASE_URL}/api/admin/items/${id}/reviews`, newReview);

            setReviewsList([newReview, ...reviewsList]);
            setReviewComment('');
            setRatingValue(5);
            setShowReviewForm(false);
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
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-poppins">
                <p className="text-blue-400 animate-pulse text-sm font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-950 text-white p-2 sm:p-4 md:p-6 font-poppins relative">

            {/* Custom Floating Toast Notification */}
            {message.text && (
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white font-medium shadow-2xl border ${
                        message.type === 'error'
                            ? 'bg-rose-600/90 border-rose-500 shadow-rose-900/50'
                            : 'bg-amber-600/90 border-amber-500 shadow-amber-900/50'
                    } backdrop-blur-md`}>
                        {message.type === 'error' ? <FaExclamationTriangle size={18} /> : <FaCheckCircle size={18} />}
                        <span className="text-sm">{message.text}</span>
                    </div>
                </div>
            )}

            {/* Navigation Bar / Back button */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4 px-2 w-full">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-gray-700 cursor-pointer text-xs"
                >
                    <FaArrowLeft size={12} /> Back
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showNotification('success', 'Link copied to clipboard!');
                    }}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-xl transition duration-200 flex items-center gap-2 border border-gray-700 cursor-pointer text-xs"
                >
                    <FaShareAlt size={12} /> Share
                </button>
            </div>

            {itemDetails ? (
                <div className="w-full bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">

                    {/* Cover Image & Basic Info */}
                    <div className="relative h-72 sm:h-96 md:h-[450px] w-full">
                        <img
                            src={itemDetails.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200'}
                            alt={itemDetails.name || itemDetails.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <span className="bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                                  {itemDetails.category || subPart} {itemDetails.subCategory ? `• ${itemDetails.subCategory}` : ''}
                                </span>

                                {/* Dayout Place Name */}
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">{itemDetails.name || itemDetails.title}</h1>
                                <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5 mt-1">
                                    <FaMapMarkerAlt className="text-amber-400" size={14} /> {itemDetails.location || 'Location not specified'}
                                </p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-md border border-gray-700 px-4 py-2 rounded-2xl">
                                <FaStar className="text-yellow-400" size={16} />
                                <span className="text-base font-bold text-white">{itemDetails.rating || '5.0'}</span>
                                <span className="text-xs text-gray-400">({reviewsList.length || itemDetails.reviewsCount || '0'} Reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 md:p-10 space-y-8">

                        {/* Quick Details (Price, Contact, Navigation) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl flex items-center gap-3">
                                <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl border border-amber-500/20"><FaCoins size={18} /></div>
                                <div>
                                    <p className="text-[11px] text-gray-400 font-medium">Day Out Package Price</p>
                                    <p className="text-sm font-bold text-white">Rs. {itemDetails.price || itemDetails.pricePerNight || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl flex items-center gap-3">
                                <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20"><FaPhoneAlt size={18} /></div>
                                <div>
                                    <p className="text-[11px] text-gray-400 font-medium">Contact Number</p>
                                    <p className="text-sm font-bold text-white">{itemDetails.contact || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Navigation and Map */}
                            <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl flex items-center justify-between sm:col-span-2 md:col-span-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20"><FaRoute size={18} /></div>
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium">Navigation</p>
                                        <p className="text-sm font-bold text-white">Google Maps</p>
                                    </div>
                                </div>
                                <a
                                    href={itemDetails.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(itemDetails.name + ' ' + itemDetails.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
                                >
                                    Open Map
                                </a>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-gray-950/60 border border-gray-800 p-6 rounded-2xl space-y-3">
                            <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                                <FaInfoCircle size={16} /> About This Day Out Experience
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                {itemDetails.aboutUs || itemDetails.description || 'No detailed description provided.'}
                            </p>
                        </div>

                        {/* Packages & Facilities */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                                <FaLayerGroup size={16} /> Day Out Packages & Activities
                            </h2>
                            {Array.isArray(itemDetails.menu) && itemDetails.menu.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {itemDetails.menu.map((pkg, idx) => (
                                        <div key={idx} className="bg-gray-950 border border-gray-800 p-4 rounded-2xl space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-white">{pkg.name}</h3>
                                                <span className="text-xs bg-amber-600/20 text-amber-300 px-2 py-0.5 rounded-md font-semibold">{pkg.category || 'Standard'}</span>
                                            </div>
                                            <p className="text-xs text-emerald-400 font-bold">Rs. {pkg.price || 'N/A'}</p>
                                            {pkg.description && <p className="text-[11px] text-gray-400">{pkg.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : itemDetails.facilities ? (
                                <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl">
                                    <p className="text-xs font-semibold text-gray-300">Activities & Facilities Included:</p>
                                    <p className="text-xs sm:text-sm text-emerald-400 mt-1">{itemDetails.facilities}</p>
                                </div>
                            ) : (
                                <div className="bg-gray-950/50 border border-gray-800 p-6 rounded-2xl text-center">
                                    <p className="text-xs text-gray-400">No specific packages listed.</p>
                                </div>
                            )}
                        </div>

                        {/* Customer Reviews Section */}
                        <div className="space-y-6">
                            <div className="bg-gray-950 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl text-center">
                                        <span className="text-2xl font-black text-yellow-400">{itemDetails.rating || '5.0'}</span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Overall Rating</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Visitor Experiences</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Share your feedback with other visitors.</p>
                                    </div>
                                </div>

                                {/* Write a Review Button */}
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-lg"
                                >
                                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                                </button>
                            </div>

                            {/* Review Form */}
                            {showReviewForm && (
                                <form onSubmit={handleReviewSubmit} className="bg-gray-950 border border-amber-500/30 p-6 rounded-2xl space-y-4 animate-fadeIn">
                                    <h3 className="text-sm font-bold text-amber-400">Add Your Review</h3>

                                    <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-xl border border-gray-800">
                                        <FaUserCircle className="text-amber-400 text-2xl" />
                                        <div>
                                            <p className="text-xs text-gray-400">Posting as:</p>
                                            <p className="text-xs font-bold text-white">{currentUser.name} {currentUser.email ? `(${currentUser.email})` : ''}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-300 font-medium">Select Rating</label>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    onClick={() => setRatingValue(star)}
                                                    className="focus:outline-none cursor-pointer"
                                                >
                                                    <FaStar
                                                        size={22}
                                                        className={star <= ratingValue ? 'text-yellow-400' : 'text-gray-700'}
                                                    />
                                                </button>
                                            ))}
                                            <span className="text-xs font-bold text-amber-400 ml-2">({ratingValue} / 5 Stars)</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-300 font-medium">Your Review / Comment</label>
                                        <textarea
                                            rows="3"
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Write about your day out experience here..."
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                                    >
                                        <FaPaperPlane size={12} /> {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            )}

                            {/* Reviews List Display */}
                            <div className="space-y-3 mt-4">
                                <h3 className="text-sm font-bold text-white">All Reviews ({reviewsList.length})</h3>
                                {reviewsList.length > 0 ? (
                                    <div className="space-y-3">
                                        {reviewsList.map((rev, index) => (
                                            <div key={index} className="bg-gray-950 border border-gray-800 p-4 rounded-2xl space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                                                            {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-bold text-white">{rev.name || 'Anonymous'}</h4>
                                                            <p className="text-[10px] text-gray-400">{rev.date || 'Recent'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20">
                                                        <FaStar className="text-yellow-400" size={12} />
                                                        <span className="text-xs font-bold text-yellow-400">{rev.rating || 5}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed pl-10">
                                                    {rev.comment || rev.review}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-950/50 border border-gray-800 p-6 rounded-2xl text-center">
                                        <p className="text-xs text-gray-400">No reviews yet. Be the first one to write a review!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <div className="w-full bg-gray-900 border border-gray-800 p-12 rounded-3xl text-center space-y-4">
                    <p className="text-gray-400 text-sm">No dayout record selected.</p>
                    <button
                        onClick={() => navigate('/dayout')}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition cursor-pointer"
                    >
                        Go Back to Day Out Places
                    </button>
                </div>
            )}
        </div>
    );
}