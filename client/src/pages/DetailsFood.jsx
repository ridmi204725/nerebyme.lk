import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import {
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaStar,
    FaUtensils,
    FaArrowLeft,
    FaShareAlt,
    FaCoins,
    FaRoute,
    FaInfoCircle,
    FaImages,
    FaPaperPlane,
    FaUserCircle,
    FaCheckCircle,
    FaExclamationTriangle
} from 'react-icons/fa';

export default function DetailsFood() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState(null);

    const [message, setMessage] = useState({ type: '', text: '' });

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [ratingValue, setRatingValue] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [customReviewerName, setCustomReviewerName] = useState(''); // නව නම ඇතුළත් කිරීමට State එකක්
    const [reviewsList, setReviewsList] = useState([]);
    const [submittingReview, setSubmittingReview] = useState(false);

    const [currentUser, setCurrentUser] = useState({
        name: 'Guest User',
        email: ''
    });

    const showNotification = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 3500);
    };

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
                setCustomReviewerName(finalName); // ආරම්භයේදී Storage එකේ නම පිරවීම
            } else {
                setCustomReviewerName('Guest User');
            }
        } catch (e) {
            console.error("Error reading user from localStorage", e);
            setCustomReviewerName('Guest User');
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

                    const savedReviewsKey = `reviews_${id}`;
                    const localSavedReviews = JSON.parse(localStorage.getItem(savedReviewsKey) || '[]');

                    let combinedReviews = [];
                    if (itemData.reviews && Array.isArray(itemData.reviews) && itemData.reviews.length > 0) {
                        combinedReviews = [...itemData.reviews];
                    }

                    localSavedReviews.forEach(localRev => {
                        if (!combinedReviews.some(r => r.id === localRev.id || r.comment === localRev.comment)) {
                            combinedReviews.unshift(localRev);
                        }
                    });

                    setReviewsList(combinedReviews);
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
        if (!reviewComment.trim()) {
            showNotification('error', 'කරුණාකර ඔබේ අදහස (Comment) ඇතුළත් කරන්න.');
            return;
        }

        setSubmittingReview(true);
        try {
            const newReview = {
                id: Date.now(),
                name: customReviewerName.trim() ? customReviewerName.trim() : 'Guest User', // පරිශීලකයා ලබාදුන් නම භාවිත කිරීම
                rating: Number(ratingValue),
                comment: reviewComment,
                date: new Date().toLocaleDateString()
            };

            const updatedReviews = [newReview, ...reviewsList];
            setReviewsList(updatedReviews);

            const savedReviewsKey = `reviews_${id}`;
            localStorage.setItem(savedReviewsKey, JSON.stringify(updatedReviews));

            try {
                await axios.post(`${API_BASE_URL}/api/admin/items/${id}/reviews`, newReview);
            } catch (backendErr) {
                console.log("Backend review endpoint note: Saved locally.", backendErr);
            }

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
                <p className="text-amber-400 animate-pulse text-sm font-semibold">loading...</p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white gap-4 font-poppins px-4 text-center">
                <div className="text-sm font-medium text-red-400">{error || "Restaurant not found."}</div>
                <Link to="/home" className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-xl text-xs font-bold transition text-white">
                    Back to Home
                </Link>
            </div>
        );
    }

    const menuImages = (() => {
        let rawImages = [];
        if (Array.isArray(restaurant.menuImages) && restaurant.menuImages.length > 0) {
            rawImages = restaurant.menuImages;
        } else if (Array.isArray(restaurant.menu) && restaurant.menu.length > 0) {
            rawImages = restaurant.menu;
        } else if (Array.isArray(restaurant.images) && restaurant.images.length > 0) {
            rawImages = restaurant.images;
        }

        return rawImages.map(item => {
            if (!item) return '';
            if (typeof item === 'string') return item;
            return item.image || item.url || item.imageUrl || '';
        }).filter(Boolean);
    })();

    return (
        <div className="w-full min-h-screen bg-gray-950 text-white p-2 sm:p-4 md:p-6 font-poppins relative">

            {message.text && (
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white font-medium shadow-2xl border ${
                        message.type === 'error'
                            ? 'bg-rose-600/90 border-rose-500 shadow-rose-900/50'
                            : 'bg-emerald-600/90 border-emerald-500 shadow-emerald-900/50'
                    } backdrop-blur-md`}>
                        {message.type === 'error' ? <FaExclamationTriangle size={18} /> : <FaCheckCircle size={18} />}
                        <span className="text-sm">{message.text}</span>
                    </div>
                </div>
            )}

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

            <div className="w-full bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative h-72 sm:h-96 md:h-[450px] w-full">
                    <img
                        src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
                        alt={restaurant.name || restaurant.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <span className="bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                                {restaurant.category || 'FoodHub Restaurant'} {restaurant.subCategory ? `• ${restaurant.subCategory}` : ''}
                            </span>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">{restaurant.name || restaurant.title}</h1>
                            <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5 mt-1">
                                <FaMapMarkerAlt className="text-amber-400" size={14} /> {restaurant.location || 'Location not specified'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-md border border-gray-700 px-4 py-2 rounded-2xl">
                            <FaStar className="text-yellow-400" size={16} />
                            <span className="text-base font-bold text-white">{restaurant.rating || '4.8'}</span>
                            <span className="text-xs text-gray-400">({reviewsList.length} Reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 md:p-10 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl flex items-center gap-3">
                            <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl border border-amber-500/20"><FaCoins size={18} /></div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-medium">Average Cost</p>
                                <p className="text-sm font-bold text-white">Rs. {restaurant.price ? Number(restaurant.price).toLocaleString() : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl flex items-center gap-3">
                            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20"><FaPhoneAlt size={18} /></div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-medium">Contact Number</p>
                                {restaurant.contact ? (
                                    <a href={`tel:${restaurant.contact}`} className="text-sm font-bold text-white hover:text-amber-400 transition">
                                        {restaurant.contact}
                                    </a>
                                ) : (
                                    <p className="text-sm font-bold text-white">N/A</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl flex items-center justify-between sm:col-span-2 md:col-span-1">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20"><FaRoute size={18} /></div>
                                <div>
                                    <p className="text-[11px] text-gray-400 font-medium">Navigation</p>
                                    <p className="text-sm font-bold text-white">Google Maps</p>
                                </div>
                            </div>
                            <a
                                href={restaurant.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((restaurant.name || restaurant.title) + ' ' + restaurant.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
                            >
                                Open Map
                            </a>
                        </div>
                    </div>

                    <div className="bg-gray-950/60 border border-gray-800 p-6 rounded-2xl space-y-3">
                        <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                            <FaInfoCircle size={16} /> About This Restaurant
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                            {restaurant.aboutUs || restaurant.description || 'No detailed description provided.'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                            <FaUtensils size={16} /> Food Menu & Price List Photos
                        </h2>

                        {menuImages.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {menuImages.map((imgUrl, index) => (
                                    <div key={index} className="bg-gray-950 border border-gray-800 p-2 rounded-2xl overflow-hidden group">
                                        <div className="relative h-60 w-full rounded-xl overflow-hidden">
                                            <img
                                                src={imgUrl}
                                                alt={`Menu item ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-950/50 border border-gray-800 p-6 rounded-2xl text-center space-y-2">
                                <FaImages className="mx-auto text-gray-500 text-3xl mb-1" />
                                <p className="text-xs text-gray-400">No menu photos available for this restaurant.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-950 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl text-center">
                                    <span className="text-2xl font-black text-yellow-400">{restaurant.rating || '4.8'}</span>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Overall Rating</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Visitor Experiences</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Share your feedback with other customers.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-lg"
                            >
                                {showReviewForm ? 'Cancel' : 'Write a Review'}
                            </button>
                        </div>

                        {showReviewForm && (
                            <form onSubmit={handleReviewSubmit} className="bg-gray-950 border border-amber-500/30 p-6 rounded-2xl space-y-4 animate-fadeIn">
                                <h3 className="text-sm font-bold text-amber-400">Add Your Review</h3>

                                {/* පරිශීලකයාට කැමති නමක් ඇතුළත් කිරීමට ලබා දී ඇති Input Field එක */}
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-300 font-medium">Your Name</label>
                                    <div className="relative flex items-center">
                                        <FaUserCircle className="absolute left-3 text-amber-400 text-lg" />
                                        <input
                                            type="text"
                                            value={customReviewerName}
                                            onChange={(e) => setCustomReviewerName(e.target.value)}
                                            placeholder="Enter your name..."
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                                            required
                                        />
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
                                        placeholder="Write about your experience here..."
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
        </div>
    );
}