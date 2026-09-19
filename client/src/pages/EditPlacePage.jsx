import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { FaEdit, FaTrash, FaCheckCircle, FaClock, FaSearch, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaPlus, FaImages, FaMapMarkedAlt } from 'react-icons/fa';

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
        aboutUs: '',
        location: '',
        mapUrl: '',
        contact: '',
        price: '',
        rating: '5.0',
        image: '',
        menuImages: [],
        roomType: '',
        duration: '',
        discount: '',
        movieShowtimes: '',
        capacity: '',
        isApproved: true
    });

    const [galleryInputUrl, setGalleryInputUrl] = useState('');

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
                            : (Array.isArray(item.menu) ? item.menu.map(m => m?.image || m?.url || (typeof m === 'string' ? m : '')).filter(Boolean) : []);

                        setFormData({
                            name: item.name || item.title || '',
                            category: item.category || 'food-hub',
                            subCategory: item.subCategory || '',
                            aboutUs: item.aboutUs || item.description || '',
                            location: item.location || '',
                            mapUrl: item.mapUrl || '',
                            contact: item.contact || '',
                            price: item.price || item.ticketPrice || '',
                            rating: item.rating || '5.0',
                            image: item.image || '',
                            menuImages: extractedImages,
                            roomType: item.roomType || '',
                            duration: item.duration || '',
                            discount: item.discount || '',
                            movieShowtimes: item.movieShowtimes || '',
                            capacity: item.capacity || '',
                            isApproved: item.isApproved ?? true
                        });
                        setActiveTab(item.category || 'food-hub');
                    }
                } catch (err) {
                    console.error("Error fetching item details:", err);
                    showNotification('error', 'දත්ත ලබා ගැනීමේදී දෝෂයක් ඇති විය.');
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
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddGalleryImage = () => {
        if (!galleryInputUrl.trim()) {
            showNotification('error', 'කරුණාකර වලංගු ඡායාරූප URL එකක් ඇතුළත් කරන්න.');
            return;
        }
        setFormData(prev => ({
            ...prev,
            menuImages: [...prev.menuImages, galleryInputUrl.trim()]
        }));
        setGalleryInputUrl('');
        showNotification('success', 'ඡායාරූපය සාර්ථකව එකතු කරන ලදී!');
    };

    const handleRemoveGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            menuImages: prev.menuImages.filter((_, i) => i !== index)
        }));
        showNotification('success', 'ඡායාරූපය ඉවත් කරන ලදී.');
    };

    const handleRowEdit = (item) => {
        setEditingId(item._id);
        navigate(`/edit-place/${item._id}`);

        const extractedImages = Array.isArray(item.menuImages)
            ? item.menuImages.map(img => typeof img === 'string' ? img : (img?.image || img?.url || '')).filter(Boolean)
            : (Array.isArray(item.menu) ? item.menu.map(m => m?.image || m?.url || (typeof m === 'string' ? m : '')).filter(Boolean) : []);

        setFormData({
            name: item.name || item.title || '',
            category: item.category || activeTab,
            subCategory: item.subCategory || '',
            aboutUs: item.aboutUs || item.description || '',
            location: item.location || '',
            mapUrl: item.mapUrl || '',
            contact: item.contact || '',
            price: item.price || item.ticketPrice || '',
            rating: item.rating || '5.0',
            image: item.image || '',
            menuImages: extractedImages,
            roomType: item.roomType || '',
            duration: item.duration || '',
            discount: item.discount || '',
            movieShowtimes: item.movieShowtimes || '',
            capacity: item.capacity || '',
            isApproved: item.isApproved ?? true
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const formattedMenu = formData.menuImages.map(url => ({
                name: 'Gallery Item',
                price: '',
                description: '',
                category: '',
                image: url
            }));

            const payload = {
                ...formData,
                menu: formattedMenu,
                menuImages: formData.menuImages
            };

            if (editingId) {
                await axios.put(`${API_BASE_URL}/api/admin/items/${editingId}`, payload, config);
                showNotification('success', 'විස්තර සාර්ථකව යාවත්කාලීන කරන ලදී!');
            } else {
                await axios.post(`${API_BASE_URL}/api/admin/items`, payload, config);
                showNotification('success', 'නව විස්තර සාර්ථකව එකතු කරන ලදී!');
            }

            fetchItemsList();
            setEditingId(null);
            navigate('/edit-place');
            setFormData({
                name: '', category: activeTab, subCategory: '', aboutUs: '', location: '', mapUrl: '', contact: '', price: '', rating: '5.0', image: '', menuImages: [], roomType: '', duration: '', discount: '', movieShowtimes: '', capacity: '', isApproved: true
            });

        } catch (err) {
            showNotification('error', err.response?.data?.message || 'செயක්‍රියාවේදී දෝෂයක් ඇති විය.');
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
            showNotification('success', 'වාර්තාව සාර්ථකව ඉවත් කරන ලදී.');
        } catch (err) {
            console.error("Delete error:", err);
            showNotification('error', 'මකා දැමීමේදී දෝෂයක් ඇති විය.');
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

    const getGallerySectionTitle = () => {
        switch (activeTab) {
            case 'food-hub': return 'Food Menu & Dishes Photo Gallery';
            case 'hotels':
            case 'rooms': return 'Room & Hotel Packages Photo Gallery';
            case 'dayout': return 'Day Out Packages & Activities Photo Gallery';
            case 'travel': return 'Travel Packages & Itinerary Photo Gallery';
            default: return 'Packages & Facilities Photo Gallery';
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
                                    setFormData({ name: '', category: activeTab, subCategory: '', aboutUs: '', location: '', mapUrl: '', contact: '', price: '', rating: '5.0', image: '', menuImages: [], roomType: '', duration: '', discount: '', movieShowtimes: '', capacity: '', isApproved: true });
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

                <div className="p-5 bg-gray-950/60 rounded-2xl border border-gray-800 space-y-4">
                    <h3 className="text-base font-bold text-blue-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                        <FaImages size={16} /> {getGallerySectionTitle()}
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Paste image URL here (e.g. https://example.com/image.jpg)"
                            value={galleryInputUrl}
                            onChange={e => setGalleryInputUrl(e.target.value)}
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddGalleryImage}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md"
                        >
                            <FaPlus size={11} /> Add Image to Gallery
                        </button>
                    </div>

                    {formData.menuImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-3">
                            {formData.menuImages.map((imgUrl, index) => (
                                <div key={index} className="relative bg-gray-900 border border-gray-800 p-2 rounded-2xl group overflow-hidden">
                                    <div className="h-28 w-full rounded-xl overflow-hidden bg-gray-950">
                                        <img src={imgUrl} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveGalleryImage(index)}
                                        className="absolute top-3 right-3 bg-rose-600 hover:bg-rose-500 text-white p-1.5 rounded-lg shadow-lg cursor-pointer transition"
                                        title="Remove Image"
                                    >
                                        <FaTrash size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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
                                    title="Click to edit this record"
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
                            <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-800 text-gray-300 text-xs rounded-xl cursor-pointer">Cancel</button>
                            <button onClick={executeDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}