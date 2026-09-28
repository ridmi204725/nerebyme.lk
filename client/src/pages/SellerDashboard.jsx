import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaStore, FaPlusCircle, FaUtensils, FaMapMarkerAlt, FaCoins, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaEdit } from 'react-icons/fa';
import { getTranslation } from '../utils/i18n';

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
  "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
  "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
  "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const SellerDashboard = () => {
  const context = useOutletContext() || {};
  const language = context.language || 'English';
  const t = getTranslation(language);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    category: 'food-hub',
    subCategory: 'Restaurant',
    location: '',
    district: 'Colombo',
    contact: '',
    description: '',
    image: '',
    mapUrl: '',
    aboutUs: '',
    menuItemName: '',
    menuItemPrice: ''
  });



  const fetchSellerItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/seller/items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data.data || []);
    } catch (err) {
      console.error("Seller items fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerItems();
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const pts = localStorage.getItem(`userPoints_${userEmail}`) || 0;
    setUserPoints(pts);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        ...formData,
        menu: formData.menuItemName ? [{ name: formData.menuItemName, price: formData.menuItemPrice }] : []
      };

      const res = await axios.post(`${API_BASE_URL}/api/seller/items`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.points !== undefined) {
        const userEmail = localStorage.getItem('userEmail') || 'guest';
        localStorage.setItem(`userPoints_${userEmail}`, res.data.points);
        setUserPoints(res.data.points);
      }

      alert("Submission successful! Your listing has been submitted for Admin approval. You earned +1 point!");
      setIsModalOpen(false);
      setFormData({
        name: '', category: 'food-hub', subCategory: 'Restaurant', location: '', district: 'Colombo',
        contact: '', description: '', image: '', mapUrl: '', aboutUs: '', menuItemName: '', menuItemPrice: ''
      });
      fetchSellerItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit listing");
    }
  };

  return (
    <div className="min-h-screen text-white pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <FaStore className="text-3xl text-amber-500" />
            <h1 className="text-2xl sm:text-4xl font-extrabold">{t.sellerTitle}</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">{t.sellerSub}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#11131a] border border-gray-800 p-3.5 rounded-2xl flex items-center gap-3">
            <FaCoins className="text-amber-400 text-xl animate-bounce" />
            <div>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{t.points}</p>
              <p className="text-lg font-black text-amber-400">{userPoints}</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-5 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer text-sm"
          >
            <FaPlusCircle />
            <span>{t.addListing}</span>
          </button>
        </div>
      </div>

      {/* Modal Form for Seller Listing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form className="bg-[#11131a] p-6 rounded-3xl w-full max-w-2xl border border-gray-800 max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4 text-amber-400">{t.addListing}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Business/Item Name *</label>
                <input required placeholder="e.g. Grand View Restaurant" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-amber-500" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Category *</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-amber-500">
                  <option value="food-hub">Food Hub / Restaurant</option>
                  <option value="dayout">Day Outing / Hotel</option>
                  <option value="travel">Travel Package</option>
                  <option value="offers">Special Offer</option>
                  <option value="functions">Function Venue</option>
                  <option value="movie-theater">Movie Theater</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">District *</label>
                <select value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-amber-500">
                  {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">City / Location *</label>
                <input required placeholder="e.g. Nugegoda" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Contact Number *</label>
                <input required placeholder="e.g. 0771234567" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-amber-500" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Image URL</label>
                <input placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-amber-500" />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-400 block mb-1">Google Maps URL</label>
              <input placeholder="https://maps.google.com/..." value={formData.mapUrl} onChange={e => setFormData({ ...formData, mapUrl: e.target.value })} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-amber-500" />
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-400 block mb-1">About Us / Overview</label>
              <textarea rows={2} placeholder="Describe your place or service..." value={formData.aboutUs} onChange={e => setFormData({ ...formData, aboutUs: e.target.value })} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-amber-500" />
            </div>

            {/* Menu Item Quick Add */}
            <div className="p-4 bg-[#161922] rounded-2xl border border-gray-800 mb-4">
              <p className="text-xs font-bold text-gray-300 mb-2">Featured Menu / Offer Item</p>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Item Name (e.g. Cheese Burger)" value={formData.menuItemName} onChange={e => setFormData({ ...formData, menuItemName: e.target.value })} className="bg-[#11131a] p-2.5 rounded-xl border border-gray-800 text-xs" />
                <input placeholder="Price (LKR)" value={formData.menuItemPrice} onChange={e => setFormData({ ...formData, menuItemPrice: e.target.value })} className="bg-[#11131a] p-2.5 rounded-xl border border-gray-800 text-xs" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 bg-gray-800 hover:bg-gray-700 p-3 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="w-1/2 bg-amber-600 hover:bg-amber-500 p-3 rounded-xl font-bold text-xs">Submit for Admin Approval</button>
            </div>
          </form>
        </div>
      )}

      {/* Seller Listings List */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t.myListings}</h2>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading listings...</div>
        ) : items.length === 0 ? (
          <div className="bg-[#11131a] p-8 rounded-3xl border border-gray-800 text-center">
            <p className="text-gray-400 text-sm">No listings submitted yet. Click "Add New Listing" to create your business profile.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <motion.div
                key={item._id}
                className="bg-[#11131a] border border-gray-800 rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-40 w-full">
                  <img src={item.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500'} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {item.status === 'approved' || item.isApproved ? (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 backdrop-blur-md">
                        <FaCheckCircle /> Approved
                      </span>
                    ) : item.status === 'rejected' ? (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 backdrop-blur-md">
                        <FaTimesCircle /> Rejected
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 backdrop-blur-md">
                        <FaHourglassHalf /> Pending Admin Approval
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{item.category}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{item.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-red-500" /> {item.location}, {item.district}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800/80 flex justify-between items-center text-xs text-gray-400">
                    <span>Contact: {item.contact}</span>
                    <span className="text-[10px] text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
