import React, { useState, useEffect } from 'react';
import CategoryMenu from '../components/CategoryMenu';

// Sub-categories exactly as defined in the Admin Dashboard
const SUB_CATEGORIES = ["Seasonal", "Bank Offers", "Flash Sales"];

const SRI_LANKA_LOCATIONS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
  "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
  "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 🌟 ස්වයංක්‍රීයව Current Host එක හඳුනාගෙන API URL එක සකස් කිරීම
  const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  // Fetch data from the Backend API
  const fetchOffers = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/offers?`;
      if (selectedCategory) url += `subCategory=${selectedCategory}&`;
      if (selectedDistrict) url += `district=${selectedDistrict}`;

      const response = await fetch(url);
      const resData = await response.json();

      if (resData.success && Array.isArray(resData.data)) {
        setOffers(resData.data);
      } else if (Array.isArray(resData)) {
        setOffers(resData);
      } else {
        setOffers([]);
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
      setOffers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, [selectedCategory, selectedDistrict]);

  // Client-side filtering for Search Query (matches Title Name or City Location)
  const filteredOffers = offers.filter(offer => {
    const matchesSearch =
      offer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Helper function to return beautiful custom badge colors per Sub-Category
  const getBadgeColor = (subCat) => {
    switch (subCat) {
      case "Flash Sales":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "Bank Offers":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Seasonal":
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
  };

  return (
    <div className="min-h-screen text-white font-poppins pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">

      {/* 🧭 Category Navigation Menu (activeTab sets focus on 'offers') */}
      <CategoryMenu activeTab="offers" />

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden border-b border-slate-800/50 py-12 px-6 mt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
            Limited Time Promotions
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-3 tracking-tight">
            🎁 Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Offers & Deals</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Grab the best seasonal discounts, credit card promo offers, and exciting flash sales across Sri Lanka.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* 🔍 Search & Filter Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">

          {/* 1. Search Inputs */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Search Deals</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, brand, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-orange-500 transition-all text-sm"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
            </div>
          </div>

          {/* 2. Sub-Category Filter Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Offer Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-all text-sm appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-slate-900 text-white">All Offers</option>
              {SUB_CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
              ))}
            </select>
          </div>

          {/* 3. District Filter Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-all text-sm appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-slate-900 text-white">All Districts</option>
              {SRI_LANKA_LOCATIONS.map(dist => (
                <option key={dist} value={dist} className="bg-slate-900 text-white">{dist}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 🎴 Dynamic Offers Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Searching for active offers...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 rounded-2xl border border-slate-800">
            <span className="text-4xl block mb-3">🏷️</span>
            <p className="text-slate-400 text-lg">No active offers matched your search criteria.</p>
            <button
              onClick={() => { setSelectedCategory(''); setSelectedDistrict(''); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white font-bold text-xs rounded-lg transition-all shadow-[0_0_10px_rgba(234,88,12,0.3)]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map(offer => (
              <div
                key={offer._id}
                className="bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 hover:border-orange-500/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Offer Image & Absolute Badge */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={offer.image || 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7'}
                      alt={offer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 right-3 px-3 py-1 font-extrabold text-xs rounded-full uppercase shadow-lg ${getBadgeColor(offer.subCategory)}`}>
                      {offer.subCategory}
                    </span>
                  </div>

                  {/* Card Body Information */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200 mb-2">
                      {offer.name}
                    </h3>

                    <p className="text-slate-400 text-sm flex items-center gap-1.5 mb-3">
                      <span>📍</span> {offer.location}, {offer.district}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-4 border-t border-slate-800/60 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Claim Offer:</span>
                    <span className="text-sm font-semibold text-orange-400">{offer.contact || 'N/A'}</span>
                  </div>
                  <a
                    href={`tel:${offer.contact}`}
                    className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-slate-950 border border-orange-500/20 font-bold text-xs rounded-xl transition-all duration-300"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;