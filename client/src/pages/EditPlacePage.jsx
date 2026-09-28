import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { HOTEL_TYPES, HOTEL_TIERS, getHotelCategories, getLegacyHotelMeta } from '../utils/hotelCategories';
import { FaEdit, FaTrash, FaCheckCircle, FaClock, FaSearch, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaPlus, FaImages, FaMapMarkedAlt, FaFacebook, FaInstagram, FaTripadvisor, FaStar, FaBed, FaUtensils, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const CATEGORIES = [
    { id: 'food-hub', label: 'FoodHub' },
    { id: 'hotels', label: 'Hotels' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'dayout', label: 'Dayout' },
    { id: 'travel', label: 'Travel' },
    { id: 'movie-theaters', label: 'Movie Theaters' },
    { id: 'functions', label: 'Function & Events' },
    { id: 'offers', label: 'Offers' }
];

export default function EditPlacePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('food-hub');
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [itemsList, setItemsList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [formData, setFormData] = useState({
        name: '',
        category: 'food-hub',
        subCategory: '',
        hotelType: 'Indoor',
        hotelTier: 'Budget',
        aboutUs: '',
        location: '',
        mapUrl: '',
        contact: '',
        price: '',
        rating: '5.0',
        image: '',
        menuImages: [],
        roomPackages: [],
        packageImages: [],
        menu: [],
        facebookUrl: '',
        instagramUrl: '',
        tripadvisorUrl: '',
        isApproved: true,
        reviews: []
    });

    const [galleryInputUrl, setGalleryInputUrl] = useState('');

    const [pkgName, setPkgName] = useState('');
    const [pkgPrice, setPkgPrice] = useState('');
    const [pkgDesc, setPkgDesc] = useState('');
    const [pkgImage, setPkgImage] = useState('');

    // Food Menu Photos Array State for FoodHub
    const [foodMenuPhotos, setFoodMenuPhotos] = useState([]);
    const [foodMenuInputUrl, setFoodMenuInputUrl] = useState('');

    const [editingReviewIndex, setEditingReviewIndex] = useState(null);
    const [reviewEditText, setReviewEditText] = useState('');
    const [reviewEditRating, setReviewEditRating] = useState(5);

    const showNotification = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 3500);
    };

    const fetchItemsList = async () => {
        setTableLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get(`${API_BASE_URL}/api/admin/items?category=${activeTab}&isApproved=all`, config);

            if (res.data && res.data.success && Array.isArray(res.data.data)) {
                setItemsList(res.data.data);
            } else if (Array.isArray(res.data)) {
                setItemsList(res.data);
            } else {
                setItemsList([]);
            }
        } catch (err) {
            console.error("Error fetching items list:", err);
            setItemsList([]);
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchItemsList();
    }, [activeTab]);

    useEffect(() => {
        if (id) {
            const fetchItemDetails = async () => {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                    const res = await axios.get(`${API_BASE_URL}/api/admin/items/${id}`, config);
                    if (res.data && res.data.data) {
                        const item = res.data.data;
                        setEditingId(item._id);

                        const extractedImages = Array.isArray(item.menuImages)
                            ? item.menuImages.map(img => typeof img === 'string' ? img : (img?.image || img?.url || '')).filter(Boolean)
                            : [];

                        let loadedMenu = item.menu || [];
                        if (item.category === 'food-hub') {
                            if (typeof item.menu === 'string' && item.menu.trim()) {
                                setFoodMenuPhotos([item.menu]);
                            } else if (Array.isArray(item.menu)) {
                                const parsedMenus = item.menu.map(m => typeof m === 'string' ? m : (m?.image || m?.url || '')).filter(Boolean);
                                setFoodMenuPhotos(parsedMenus);
                            } else {
                                setFoodMenuPhotos([]);
                            }
                        }

                        setFormData({
                            name: item.name || item.title || '',
                            category: item.category || 'food-hub',
                            subCategory: item.subCategory || '',
                            hotelType: item.hotelType || getLegacyHotelMeta(item.subCategory).hotelType || 'Indoor',
                            hotelTier: item.hotelTier || getLegacyHotelMeta(item.subCategory).hotelTier || 'Budget',
                            aboutUs: item.aboutUs || item.description || '',
                            location: item.location || '',
                            mapUrl: item.mapUrl || '',
                            contact: item.contact || '',
                            price: item.price || item.ticketPrice || '',
                            rating: item.rating || '5.0',
                            image: item.image || '',
                            menuImages: extractedImages,
                            roomPackages: Array.isArray(item.roomPackages) ? item.roomPackages : (item.category === 'hotels' && Array.isArray(item.menu) ? item.menu : []),
                            packageImages: Array.isArray(item.packageImages) ? item.packageImages : [],
                            menu: loadedMenu,
                            facebookUrl: item.facebookUrl || '',
                            instagramUrl: item.instagramUrl || '',
                            tripadvisorUrl: item.tripadvisorUrl || '',
                            isApproved: item.isApproved ?? true,
                            reviews: Array.isArray(item.reviews) ? item.reviews : []
                        });
                        setActiveTab(item.category || 'food-hub');
                    }
                } catch (err) {
                    console.error("Error fetching item details:", err);
                    showNotification('error', 'An error occurred while retrieving the data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchItemDetails();
        }
    }, [id]);

    const handleTabChange = (catId) => {
        setActiveTab(catId);
        setEditingId(null);
        navigate('/edit-place');
        setFormData(prev => ({ ...prev, category: catId }));
        setFoodMenuPhotos([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddGalleryImage = () => {
        if (!galleryInputUrl.trim()) {
            showNotification('error', 'Please enter a valid photo URL.');
            return;
        }
        setFormData(prev => ({
            ...prev,
            menuImages: [...prev.menuImages, galleryInputUrl.trim()]
        }));
        setGalleryInputUrl('');
        showNotification('success', 'A photo was successfully added!');
    };

    const handleRemoveGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            menuImages: prev.menuImages.filter((_, i) => i !== index)
        }));
        showNotification('success', 'The photograph was removed.');
    };

    // Add Food Menu Photo to FoodHub
    const handleAddFoodMenuPhoto = () => {
        if (!foodMenuInputUrl.trim()) {
            showNotification('error', 'Please enter a menu photo URL.');
            return;
        }
        setFoodMenuPhotos(prev => [...prev, foodMenuInputUrl.trim()]);
        setFoodMenuInputUrl('');
        showNotification('success', 'Menu photo added!');
    };

    const handleRemoveFoodMenuPhoto = (index) => {
        setFoodMenuPhotos(prev => prev.filter((_, i) => i !== index));
        showNotification('success', 'The menu photo was removed.');
    };

    const handleAddFunctionPackage = () => {
        if (!galleryInputUrl.trim()) {
            showNotification('error', 'Please enter a valid package image URL.');
            return;
        }
        setFormData(prev => ({
            ...prev,
            packageImages: [...prev.packageImages, { url: galleryInputUrl.trim(), title: 'Function / Event Package', description: '' }]
        }));
        setGalleryInputUrl('');
        showNotification('success', 'Function / Event package image added!');
    };

    const handleRemoveFunctionPackage = (index) => {
        setFormData(prev => ({
            ...prev,
            packageImages: prev.packageImages.filter((_, i) => i !== index)
        }));
        showNotification('success', 'Function / Event package image removed.');
    };

    const handleAddCustomItem = () => {
        if (!pkgName.trim()) {
            showNotification('error', 'Please enter a name.');
            return;
        }

        const newItem = {
            name: pkgName.trim(),
            price: pkgPrice.trim(),
            description: pkgDesc.trim(),
            image: pkgImage.trim()
        };

        if (activeTab === 'hotels') {
            setFormData(prev => ({
                ...prev,
                roomPackages: [...prev.roomPackages, newItem]
            }));
            showNotification('success', 'The hotel room package has been added!');
        }

        setPkgName('');
        setPkgPrice('');
        setPkgDesc('');
        setPkgImage('');
    };

    const handleRemoveCustomItem = (index) => {
        setFormData(prev => ({
            ...prev,
            roomPackages: prev.roomPackages.filter((_, i) => i !== index)
        }));
        showNotification('success', 'The item was removed.');
    };

    const handleEditReviewClick = (index, review) => {
        setEditingReviewIndex(index);
        setReviewEditText(review.comment || review.review || '');
        setReviewEditRating(review.rating || 5);
    };

    const handleSaveReviewEdit = (index) => {
        const updatedReviews = [...formData.reviews];
        updatedReviews[index] = {
            ...updatedReviews[index],
            comment: reviewEditText,
            review: reviewEditText,
            rating: reviewEditRating
        };
        setFormData(prev => ({ ...prev, reviews: updatedReviews }));
        setEditingReviewIndex(null);
        showNotification('success', 'The review has been updated.');
    };

    const handleDeleteReview = (index) => {
        const updatedReviews = formData.reviews.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, reviews: updatedReviews }));
        showNotification('success', 'The review was removed.');
    };

    const handleRowEdit = (item) => {
        setEditingId(item._id);
        navigate(`/edit-place/${item._id}`);

        const extractedImages = Array.isArray(item.menuImages)
            ? item.menuImages.map(img => typeof img === 'string' ? img : (img?.image || img?.url || '')).filter(Boolean)
            : [];

        let loadedMenu = item.menu || [];
        if (item.category === 'food-hub') {
            if (typeof item.menu === 'string' && item.menu.trim()) {
                setFoodMenuPhotos([item.menu]);
            } else if (Array.isArray(item.menu)) {
                const parsedMenus = item.menu.map(m => typeof m === 'string' ? m : (m?.image || m?.url || '')).filter(Boolean);
                setFoodMenuPhotos(parsedMenus);
            } else {
                setFoodMenuPhotos([]);
            }
        } else {
            setFoodMenuPhotos([]);
        }

        setFormData({
            name: item.name || item.title || '',
            category: item.category || activeTab,
            subCategory: item.subCategory || '',
            hotelType: item.hotelType || getLegacyHotelMeta(item.subCategory).hotelType || 'Indoor',
            hotelTier: item.hotelTier || getLegacyHotelMeta(item.subCategory).hotelTier || 'Budget',
            aboutUs: item.aboutUs || item.description || '',
            location: item.location || '',
            mapUrl: item.mapUrl || '',
            contact: item.contact || '',
            price: item.price || item.ticketPrice || '',
            rating: item.rating || '5.0',
            image: item.image || '',
            menuImages: extractedImages,
            roomPackages: Array.isArray(item.roomPackages) ? item.roomPackages : (item.category === 'hotels' && Array.isArray(item.menu) ? item.menu : []),
            menu: loadedMenu,
            facebookUrl: item.facebookUrl || '',
            instagramUrl: item.instagramUrl || '',
            tripadvisorUrl: item.tripadvisorUrl || '',
            isApproved: item.isApproved ?? true,
            reviews: Array.isArray(item.reviews) ? item.reviews : []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let finalMenu = formData.menu;
            let finalRoomPackages = formData.roomPackages;

            if (activeTab === 'hotels') {
                finalMenu = formData.roomPackages;
            } else if (activeTab === 'food-hub') {
                finalMenu = foodMenuPhotos;
            }

            const payload = {
                ...formData,
                menu: finalMenu,
                roomPackages: finalRoomPackages,
                menuImages: formData.menuImages
            };

            if (editingId) {
                await axios.put(`${API_BASE_URL}/api/admin/items/${editingId}`, payload, config);
                showNotification('success', 'Details successfully updated!');
            } else {
                await axios.post(`${API_BASE_URL}/api/admin/items`, payload, config);
                showNotification('success', 'New details have been successfully added!');
            }

            fetchItemsList();
            setEditingId(null);
            navigate('/edit-place');
            setFoodMenuPhotos([]);
            setFormData({
                name: '', category: activeTab, subCategory: '', hotelType: 'Indoor', hotelTier: 'Budget', aboutUs: '', location: '', mapUrl: '', contact: '', price: '', rating: '5.0', image: '', menuImages: [], roomPackages: [], packageImages: [], menu: [], facebookUrl: '', instagramUrl: '', tripadvisorUrl: '', isApproved: true, reviews: []
            });

        } catch (err) {
            showNotification('error', err.response?.data?.message || 'An error occurred during the operation.');
        } finally {
            setLoading(false);
        }
    };

    const executeDelete = async () => {
        if (!itemToDelete) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.delete(`${API_BASE_URL}/api/admin/items/${itemToDelete._id}`, config);
            setItemToDelete(null);
            fetchItemsList();
            showNotification('success', 'The record was successfully removed.');
        } catch (err) {
            console.error("Delete error:", err);
            showNotification('error', 'An error occurred during deletion.');
        }
    };

    const filteredItems = itemsList.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getEntityLabel = () => {
        switch (activeTab) {
            case 'hotels': return 'Hotel Name';
            case 'rooms': return 'Room / Property Name';
            case 'dayout': return 'Dayout Package Name';
            case 'travel': return 'Travel Destination / Tour Name';
            case 'movie-theaters': return 'Movie / Theater Name';
            case 'functions': return 'Event Venue Name';
            case 'offers': return 'Offer / Deal Title';
            default: return 'Restaurant / Place Name';
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-950 text-white p-4 md:p-8 font-poppins relative">

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

            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <button
                    type="button"
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-2.5 px-5 rounded-xl transition duration-200 flex items-center gap-2 shadow-md border border-gray-700 cursor-pointer text-sm"
                >
                    ⬅ Back to Dashboard
                </button>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    {editingId ? '✏ Edit Record (Admin CRUD)' : '➕ Add New Record (Admin CRUD)'}
                </h1>
                <div className="w-24"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-8 bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-800">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleTabChange(cat.id)}
                        className={`py-2.5 px-3 rounded-xl font-semibold text-xs transition-all text-center shadow-sm cursor-pointer ${
                            activeTab === cat.id
                                ? 'bg-blue-600 text-white shadow-blue-500/30 shadow-lg scale-105'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 mb-12">
                <div className="flex justify-between items-center bg-blue-950/40 border border-blue-800/50 p-4 rounded-2xl">
                    <span className="text-blue-400 font-medium text-sm">Active Category Section:</span>
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white uppercase text-xs font-bold px-3 py-1 rounded-full tracking-wider">
                            {CATEGORIES.find(c => c.id === activeTab)?.label}
                        </span>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    navigate('/edit-place');
                                    setFoodMenuPhotos([]);
                                    setFormData({ name: '', category: activeTab, subCategory: '', hotelType: 'Indoor', hotelTier: 'Budget', aboutUs: '', location: '', mapUrl: '', contact: '', price: '', rating: '5.0', image: '', menuImages: [], roomPackages: [], packageImages: [], menu: [], facebookUrl: '', instagramUrl: '', tripadvisorUrl: '', isApproved: true, reviews: [] });
                                }}
                                className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold cursor-pointer"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">{getEntityLabel()} <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter name..."
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Contact Number <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 0712345678"
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">About / Description <span className="text-red-500">*</span></label>
                    <textarea
                        name="aboutUs"
                        rows="3"
                        value={formData.aboutUs}
                        onChange={handleChange}
                        required
                        placeholder="Write a description here..."
                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Address / Location <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Colombo 03, Sri Lanka"
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2">
                            <FaMapMarkedAlt className="text-blue-400" /> Navigation Map URL & Preview
                        </label>
                        <input
                            type="text"
                            name="mapUrl"
                            value={formData.mapUrl}
                            onChange={handleChange}
                            placeholder="Google Maps Share Link or Embed URL"
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm mb-3"
                        />
                        {formData.mapUrl ? (
                            <div className="w-full h-36 bg-gray-950 rounded-xl overflow-hidden border border-gray-800 relative">
                                <iframe
                                    title="Map Preview"
                                    src={formData.mapUrl.includes('iframe') ? formData.mapUrl.match(/src="([^"]+)"/)?.[1] || formData.mapUrl : formData.mapUrl}
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="w-full h-20 bg-gray-950/40 rounded-xl border border-dashed border-gray-800 flex items-center justify-center text-gray-500 text-xs">
                                Enter a Map URL above to see live preview
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 bg-gray-950/60 rounded-2xl border border-gray-800 space-y-4">
                    <h3 className="text-base font-bold text-blue-400 border-b border-gray-800 pb-2">
                        🌐 Social Media & Review Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-300 flex items-center gap-1.5"><FaFacebook className="text-blue-400"/> Facebook Link</label>
                            <input
                                type="text"
                                name="facebookUrl"
                                value={formData.facebookUrl}
                                onChange={handleChange}
                                placeholder="https://facebook.com/..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-300 flex items-center gap-1.5"><FaInstagram className="text-pink-400"/> Instagram Link</label>
                            <input
                                type="text"
                                name="instagramUrl"
                                value={formData.instagramUrl}
                                onChange={handleChange}
                                placeholder="https://instagram.com/..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-300 flex items-center gap-1.5"><FaTripadvisor className="text-emerald-400"/> TripAdvisor Link</label>
                            <input
                                type="text"
                                name="tripadvisorUrl"
                                value={formData.tripadvisorUrl}
                                onChange={handleChange}
                                placeholder="https://tripadvisor.com/..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Cover Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://image-link.com/photo.jpg"
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Price / Rate (Rs.)</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g. 5000"
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {activeTab === 'hotels' && (
                    <div className="p-5 bg-gray-950/60 rounded-2xl border border-gray-800 space-y-4">
                        <h3 className="text-base font-bold text-cyan-400 border-b border-gray-800 pb-2">Hotel Classification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold mb-2 text-gray-300">Hotel Type</label>
                                <select
                                    value={formData.hotelType}
                                    onChange={e => {
                                        const type = e.target.value;
                                        const tier = formData.hotelTier || 'Budget';
                                        setFormData(prev => ({ ...prev, hotelType: type, subCategory: getHotelCategories(type, tier)[0] || '' }));
                                    }}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                                >
                                    {HOTEL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-2 text-gray-300">Budget / Luxury</label>
                                <select
                                    value={formData.hotelTier}
                                    onChange={e => {
                                        const tier = e.target.value;
                                        setFormData(prev => ({ ...prev, hotelTier: tier, subCategory: getHotelCategories(prev.hotelType, tier)[0] || '' }));
                                    }}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                                >
                                    {HOTEL_TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-2 text-gray-300">Hotel Category</label>
                                <select
                                    value={formData.subCategory}
                                    onChange={e => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                                >
                                    {getHotelCategories(formData.hotelType, formData.hotelTier).map(category => <option key={category} value={category}>{category}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* HOTELS SECTION WITH ROOM PACKAGES & PHOTOS */}
                {activeTab === 'hotels' && (
                    <div className="p-5 bg-gray-950/60 rounded-2xl border border-gray-800 space-y-4">
                        <h3 className="text-base font-bold text-amber-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                            <FaBed size={16} /> Manage Hotel Room Packages & Photos
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <input
                                type="text"
                                placeholder="Room Name (e.g. Deluxe Suite)"
                                value={pkgName}
                                onChange={e => setPkgName(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs"
                            />
                            <input
                                type="text"
                                placeholder="Price (e.g. 15000)"
                                value={pkgPrice}
                                onChange={e => setPkgPrice(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs"
                            />
                            <input
                                type="text"
                                placeholder="Room Photo URL"
                                value={pkgImage}
                                onChange={e => setPkgImage(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomItem}
                                className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                                <FaPlus size={10} /> Add Room Package
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Room Description (e.g. King size bed, ocean view)"
                            value={pkgDesc}
                            onChange={e => setPkgDesc(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs mt-2"
                        />

                        {formData.roomPackages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3">
                                {formData.roomPackages.map((pkg, index) => (
                                    <div key={index} className="bg-gray-900 border border-gray-800 p-3 rounded-xl flex flex-col justify-between space-y-2">
                                        {pkg.image && (
                                            <div className="w-full h-28 rounded-lg overflow-hidden bg-gray-950 border border-gray-800">
                                                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            <p className="font-bold text-white text-xs">{pkg.name}</p>
                                            <p className="text-[11px] text-amber-400 font-semibold">Rs. {pkg.price}</p>
                                            {pkg.description && <p className="text-[10px] text-gray-400">{pkg.description}</p>}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCustomItem(index)}
                                            className="self-end text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* FOOD-HUB SECTION WITH MULTIPLE MENU PHOTOS */}
                {activeTab === 'food-hub' && (
                    <div className="p-5 bg-gray-950/60 rounded-2xl border border-gray-800 space-y-4">
                        <h3 className="text-base font-bold text-emerald-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                            <FaUtensils size={16} /> Food Menu Photos
                        </h3>
                        <p className="text-xs text-gray-400">Add one or more menu photos for this FoodHub location via URL:</p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Paste Food Menu Photo URL here..."
                                value={foodMenuInputUrl}
                                onChange={e => setFoodMenuInputUrl(e.target.value)}
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddFoodMenuPhoto}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            >
                                <FaPlus size={11} /> Add Menu Photo
                            </button>
                        </div>

                        {foodMenuPhotos.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-3">
                                {foodMenuPhotos.map((photoUrl, index) => (
                                    <div key={index} className="relative bg-gray-900 border border-gray-800 p-2 rounded-2xl group">
                                        <div className="h-32 w-full rounded-xl overflow-hidden bg-gray-950 border border-gray-800">
                                            <img src={photoUrl} alt={`Menu ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFoodMenuPhoto(index)}
                                            className="absolute top-4 right-4 bg-rose-600 hover:bg-rose-500 text-white p-1.5 rounded-lg shadow-lg cursor-pointer transition"
                                            title="Remove Menu Photo"
                                        >
                                            <FaTrash size={10} />
                                        </button>
                                        <p className="text-[10px] text-gray-400 mt-1 text-center truncate">Menu Photo {index + 1}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}


                {activeTab === 'functions' && (
                    <div className="p-5 bg-slate-950/70 rounded-2xl border border-violet-800/40 space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                            <FaCalendarAlt className="text-cyan-400" />
                            <div>
                                <h3 className="text-base font-bold text-violet-300">Function & Event Details</h3>
                                <p className="text-xs text-slate-400">Add event-specific information and package images. Only admins can manage these images.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="eventDate" value={formData.eventDate || ''} onChange={handleChange}
                                   placeholder="Event Date" className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500" />
                            <input type="text" name="eventTime" value={formData.eventTime || ''} onChange={handleChange}
                                   placeholder="Event Time" className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500" />
                            <input type="text" name="capacity" value={formData.capacity || ''} onChange={handleChange}
                                   placeholder="Capacity (e.g. 250 guests)" className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input type="text" value={galleryInputUrl} onChange={e => setGalleryInputUrl(e.target.value)}
                                   placeholder="Paste Function / Event package image URL"
                                   className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-violet-500" />
                            <button type="button" onClick={handleAddFunctionPackage}
                                    className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2">
                                <FaPlus size={11} /> Add Package Image
                            </button>
                        </div>
                        {formData.packageImages?.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {formData.packageImages.map((pkg, index) => {
                                    const url = typeof pkg === 'string' ? pkg : (pkg?.url || pkg?.image || '');
                                    return (
                                        <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-2 relative">
                                            <img src={url} alt={`Function package ${index + 1}`} className="w-full h-40 object-cover rounded-xl" />
                                            <button type="button" onClick={() => handleRemoveFunctionPackage(index)}
                                                    className="absolute top-4 right-4 bg-rose-600 hover:bg-rose-500 text-white p-2 rounded-lg">
                                                <FaTrash size={11} />
                                            </button>
                                            <p className="text-[10px] text-slate-400 mt-2 text-center">Package {index + 1}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {editingId && (
                    <div className="p-5 bg-gray-950/60 rounded-2xl border border-gray-800 space-y-4">
                        <h3 className="text-base font-bold text-amber-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                            ⭐ Manage User Reviews / Comments ({formData.reviews.length})
                        </h3>
                        {formData.reviews.length === 0 ? (
                            <p className="text-xs text-gray-400">No reviews found for this place yet.</p>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                {formData.reviews.map((rev, index) => (
                                    <div key={index} className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="font-bold text-white text-xs">{rev.name || 'Guest'}</span>
                                                <span className="text-[10px] text-gray-400 ml-2">({rev.date || 'Recent'})</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-400">
                                                <FaStar size={12} />
                                                <span className="text-xs font-semibold">{rev.rating || 5}</span>
                                            </div>
                                        </div>

                                        {editingReviewIndex === index ? (
                                            <div className="space-y-2 pt-2">
                                                <textarea
                                                    rows="2"
                                                    value={reviewEditText}
                                                    onChange={(e) => setReviewEditText(e.target.value)}
                                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingReviewIndex(null)}
                                                        className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveReviewEdit(index)}
                                                        className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start gap-4">
                                                <p className="text-xs text-gray-300 leading-relaxed">{rev.comment || rev.review}</p>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditReviewClick(index, rev)}
                                                        className="p-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition text-xs cursor-pointer"
                                                    >
                                                        <FaEdit size={12} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteReview(index)}
                                                        className="p-1.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition text-xs cursor-pointer"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl transition duration-200 shadow-lg cursor-pointer disabled:opacity-50 text-sm tracking-wide"
                >
                    {loading ? 'Processing...' : (editingId ? '💾 Update Record Details' : '💾 Save & Publish Record')}
                </button>
            </form>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-2xl">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-blue-400 capitalize flex items-center gap-2">
                        <span>Existing {CATEGORIES.find(c => c.id === activeTab)?.label} Records</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-700">{filteredItems.length} items</span>
                    </h2>
                    <div className="relative min-w-[220px]">
                        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-9 pr-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:outline-none"
                        />
                    </div>
                </div>

                {tableLoading ? (
                    <div className="p-12 text-center text-gray-400 animate-pulse font-medium">Loading records...</div>
                ) : paginatedItems.length === 0 ? (
                    <div className="p-12 text-center bg-gray-950/50 rounded-xl border border-gray-800 my-4">
                        <p className="text-gray-400 text-sm">No records found for this category.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-800">
                        <table className="w-full text-left text-xs text-gray-300">
                            <thead className="bg-gray-950 text-[11px] uppercase font-bold text-gray-400 border-b border-gray-800">
                            <tr>
                                <th className="p-3">Record Details</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                            {paginatedItems.map(item => (
                                <tr
                                    key={item._id}
                                    onClick={() => handleRowEdit(item)}
                                    className="hover:bg-blue-950/40 transition-colors cursor-pointer"
                                >
                                    <td className="p-3 flex items-center gap-3">
                                        <img src={item.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100'} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0 border border-gray-700" />
                                        <div>
                                            <p className="font-bold text-white max-w-[180px] truncate">{item.name || item.title}</p>
                                            <p className="text-[10px] text-gray-400">Price: Rs. {item.price || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-300 max-w-[150px] truncate">{item.location || 'N/A'}</td>
                                    <td className="p-3 font-mono text-[11px]">{item.contact || 'N/A'}</td>
                                    <td className="p-3">
                                        {item.isApproved !== false ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><FaCheckCircle size={10} /> Active</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30"><FaClock size={10} /> Pending</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => handleRowEdit(item)} className="p-2 bg-blue-600/30 hover:bg-blue-600 text-blue-300 rounded-lg cursor-pointer transition-colors" title="Edit">
                                                <FaEdit size={11} />
                                            </button>
                                            <button onClick={() => setItemToDelete(item)} className="p-2 bg-rose-600/30 hover:bg-rose-600 text-rose-300 rounded-lg cursor-pointer transition-colors" title="Delete">
                                                <FaTrash size={11} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-800 text-xs">
                        <span className="text-gray-400">Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong></span>
                        <div className="flex items-center gap-2">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-3 py-1.5 bg-gray-800 disabled:opacity-40 text-gray-200 rounded-lg flex items-center gap-1 cursor-pointer"><FaChevronLeft size={10} /> Prev</button>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-3 py-1.5 bg-gray-800 disabled:opacity-40 text-gray-200 rounded-lg flex items-center gap-1 cursor-pointer">Next <FaChevronRight size={10} /></button>
                        </div>
                    </div>
                )}
            </div>

            {itemToDelete && (
                <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center gap-3 text-rose-400 mb-3">
                            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20"><FaExclamationTriangle size={20} /></div>
                            <h3 className="text-lg font-bold text-white">Delete Record</h3>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-6">Are you sure you want to permanently delete <strong className="text-rose-300">"{itemToDelete.name || itemToDelete.title}"</strong>?</p>
                        <div className="flex justify-end items-center gap-3">
                            <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-800 text-gray-300 text-xs rounded-xl cursor-pointer">Cancel, Go back</button>
                            <button onClick={executeDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}