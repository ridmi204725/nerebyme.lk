import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryMenu from '../components/CategoryMenu';
import LocationDetailsModal from '../components/LocationDetailsModal';
import { getTranslation } from '../utils/i18n';
import {
  FaMapMarkerAlt, FaPlusCircle, FaTimes, FaCoins, FaUtensils, FaSearch, FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';

const SRI_LANKA_LOCATIONS = [
  { district: "Ampara", cities: ["Addalaichenai", "Akkaraipattu", "Alayadivembu", "Ampara", "Damana", "Dehiattakandiya", "Irakkamam", "Kalmunai", "Karaitivu", "Lahugala", "Mahaoya", "Navithanveli", "Nintavur", "Oluvil", "Padiyathalawa", "Pottuvil", "Sainthamaruthu", "Sammanthurai", "Uhana"] },
  { district: "Anuradhapura", cities: ["Anuradhapura", "Bulnewa", "Eppawala", "Galenbindunuwewa", "Galgamuwa", "Habarana", "Horowpothana", "Ipalogama", "Kahatagasdigiliya", "Kebithigollewa", "Kekirawa", "Mahavilachchiya", "Medawachchiya", "Mihintale", "Nachchaduwa", "Nochiyagama", "Padaviya", "Palagala", "Palugaswewa", "Rajanganaya", "Rambewa", "Talawa", "Tambuttegama", "Thirappane"] },
  { district: "Badulla", cities: ["Badulla", "Bandarawela", "Demodara", "Diyatalawa", "Diyathalawa", "Ella", "Haldummulla", "Hali-Ela", "Haputale", "Kandaketiya", "Lunugala", "Mahiyanganaya", "Meegahakiula", "Passara", "Ridhimaliyadda", "Soranathota", "Uva-Paranagama", "Welimada", "Weliyaya"] },
  { district: "Batticaloa", cities: ["Araipattai", "Batticaloa", "Chenkalady", "Eravur", "Kaluwanchikudy", "Kattankudy", "Kiran", "Kokkadichcholai", "Oddamavadi", "Pasikudah", "Valachchenai", "Vakarai", "Vavunathivu", "Vellavely"] },
  { district: "Colombo", cities: ["Angoda", "Athurugiriya", "Avissawella", "Battaramulla", "Boralesgamuwa", "Colombo 1-15", "Dehiwala-Mount Lavinia", "Egoda Uyana", "Gothatuwa", "Hanwella", "Homagama", "Kaduwela", "Kohuwala", "Kolonnawa", "Kosgama", "Kottawa", "Kotte (Sri Jayawardenepura)", "Madapatha", "Maharagama", "Malabe", "Moratuwa", "Mulleriyawa", "Nawala", "Nugegoda", "Padukka", "Pannipitiya", "Piliyandala", "Rajagiriya", "Ratmalana", "Talawatugoda", "Wellampitiya"] },
  { district: "Galle", cities: ["Ahungalla", "Ambalangoda", "Baddegama", "Balapitiya", "Batapola", "Bentota", "Bope-Poddala", "Elpitiya", "Galle", "Habaraduwa", "Hikkaduwa", "Hiniduma", "Imaduwa", "Karandeniya", "Karapitiya", "Koggala", "Nagoda", "Neluwa", "Niawagama", "Thawalama", "Yakkalamulla"] },
  { district: "Gampaha", cities: ["Attanagalla", "Biyagama", "Delgoda", "Divulipitiya", "Dompe", "Enderamulla", "Gampaha", "Ganemulla", "Ja-Ela", "Kadawatha", "Kandana", "Katunayake", "Kelaniya", "Kiribathgoda", "Mahara", "Minuwangoda", "Mirigama", "Negombo", "Nittambuwa", "Pamunugama", "Pugoda", "Ragama", "Seeduwa", "Sapugaskanda", "Veyangoda", "Wattala", "Weliweriya"] },
  { district: "Hambantota", cities: ["Ambalantota", "Angunakolapelessa", "Beliatta", "Hambantota", "Katuwana", "Lunugamvehera", "Menerigama", "Okewela", "Sooriyawewa", "Tangalle", "Tissamaharama", "Walasmulla", "Weeraketiya"] },
  { district: "Jaffna", cities: ["Chankanai", "Chavakachcheri", "Delft", "Jaffna", "Karainagar", "Karaveddy", "Kayts", "Kopay", "Maruthankerney", "Nallur", "Point Pedro", "Sandilipay", "Tellippalai", "Uduvil", "Velanai"] },
  { district: "Kalutara", cities: ["Agalawatta", "Aluthgama", "Baduraliya", "Bandaragama", "Beruwala", "Dodangoda", "Horana", "Ingiriya", "Kalutara", "Mathugama", "Millaniya", "Panadura", "Pelawatta", "Wadduwa", "Walallawita"] },
  { district: "Kandy", cities: ["Akurana", "Alawatugoda", "Ambatenna", "Digana", "Galagedara", "Gampola", "Gelioya", "Harispattuwa", "Hasalaka", "Kadugannawa", "Kandy", "Katugastota", "Kundasale", "Madulkelle", "Menikhinna", "Minipe", "Nawalapitiya", "Panwila", "Pasbage Korale", "Peradeniya", "Pupuressa", "Teldeniya", "Uda-Dumbara", "Udunuwara", "Wattegama", "Welamboda"] },
  { district: "Kegalle", cities: ["Aranayaka", "Bulathkohupitiya", "Dehiowita", "Deraniyagala", "Galigamuwa", "Hemmatagama", "Karawanella", "Kegalle", "Kitulgala", "Mawanella", "Rambukkana", "Ruwanwella", "Warakapola", "Yatiyantota"] },
  { district: "Kilinochchi", cities: ["Elephant Pass", "Iranamadu", "Karachchi", "Kilinochchi", "Pallai", "Pooneryn", "Veravil"] },
  { district: "Kurunegala", cities: ["Alawwa", "Bingiriya", "Dambadeniya", "Dodangaslanda", "Galewela", "Galgamuwa", "Giriulla", "Ibbagamuwa", "Katupotha", "Kuliyapitiya", "Kurunegala", "Maho", "Mawathagama", "Narammala", "Nikaweratiya", "Paduwasnuwara", "Pannala", "Polgahawela", "Polpithigama", "Ridigama", "Wariyapola", "Weerambugedara"] },
  { district: "Mannar", cities: ["Adampan", "Madhu", "Mannar", "Mantai", "Murunkan", "Nanattan", "Pesalai", "Silavatturai"] },
  { district: "Matale", cities: ["Dambulla", "Galewela", "Inamaluwa", "Laggala-Pallegama", "Madawala Ulpotha", "Matale", "Nalanda", "Naula", "Palapathwela", "Pallepola", "Rattota", "Sigiriya", "Ukuwela", "Wilgamuwa", "Yatawatta"] },
  { district: "Matara", cities: ["Akuressa", "Athuraliya", "Deniyaya", "Devinuwara (Dondra)", "Dikwella", "Hakmana", "Kamburupitiya", "Kekanadurra", "Kirinda", "Kotapola", "Malimbada", "Matara", "Mirissa", "Morawaka", "Pasgoda", "Thihagoda", "Weligama", "Welipitiya"] },
  { district: "Monaragala", cities: ["Badalkumbura", "Bibile", "Buttala", "Kataragama", "Madulla", "Medagama", "Monaragala", "Okampitiya", "Sevanagala", "Siyambalanduwa", "Tanamalwila", "Wellawaye"] },
  { district: "Mullaitivu", cities: ["Mallavi", "Maritimepattu", "Mullaitivu", "Oddusuddan", "Puthukudiyiruppu", "Thunukkai", "Welioya"] },
  { district: "Nuwara Eliya", cities: ["Agarapatana", "Ambagamuwa", "Ginigathena", "Hanguranketha", "Hatton", "Kotmale", "Lindula", "Maskeliya", "Nanu Oya", "Nuwara Eliya", "Pundaluoya", "Ragala", "Ramboda", "Talawakele", "Walapane"] },
  { district: "Polonnaruwa", cities: ["Bakamuna", "Dimbulagala", "Giritale", "Hingurakgoda", "Kaduruwela", "Lankapura", "Medirigiriya", "Minneriya", "Polonnaruwa", "Thamankaduwa", "Welikanda"] },
  { district: "Puttalam", cities: ["Anamaduwa", "Arachchikattuwa", "Chilaw", "Dankotuwa", "Kalpitiya", "Karwagaswewa", "Kumarakattuwa", "Madampe", "Mahawewa", "Marawila", "Mundel", "Nattandiya", "Nawagattegama", "Pallama", "Puttalam", "Vanathavilluwa", "Wennappuwa"] },
  { district: "Ratnapura", cities: ["Ayagama", "Balangoda", "Eheliyagoda", "Embilipitiya", "Godakawela", "Imbulpe", "Kahawatta", "Kalawana", "Kiriella", "Kuruwita", "Nivitigala", "Opanayaka", "Pelmadulla", "Rakwana", "Ratnapura", "Weligepola"] },
  { district: "Trincomalee", cities: ["Gomarankadawala", "Kantale", "Kinniya", "Kuchchaveli", "Mutur", "Padavi Sri Pura", "Seruwila", "Thampalakamam", "Trincomalee", "Verugal"] },
  { district: "Vavuniya", cities: ["Cheddikulam", "Nedunkeni", "Vavuniya", "Vengalacheddikulam"] }
];

const DATABASE_CATEGORIES = [
  "All", "Sri Lankan", "Indian", "Chinese", "Fast Food",
  "Pizza & Burgers", "Kottu & Rice", "Beverages", "Desserts", "Seafood", "Healthy"
];

const FoodHub = () => {
  const context = useOutletContext() || {};
  const language = context.language || 'English';
  const t = getTranslation(language);
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('all');
  const [selectedName, setSelectedName] = useState('All Districts');
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [foodSearch, setFoodSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [points, setPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationItem, setSelectedLocationItem] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Mobile specific filter states
  const [mobileDistrict, setMobileDistrict] = useState('');
  const [mobileCities, setMobileCities] = useState([]);
  const [mobileCity, setMobileCity] = useState('');

  const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

  useEffect(() => {
    const handleStorageChange = () => {
      const currentMode = localStorage.getItem('mode');
      if (currentMode) setMode(currentMode);
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const storedMode = localStorage.getItem('mode');
      if (storedMode && storedMode !== mode) {
        setMode(storedMode);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [mode]);

  const isDark = mode === 'dark';

  const [formData, setFormData] = useState({
    name: '', location: '', district: '', subCategory: 'Sri Lankan', contact: '',
    image: '', mapUrl: '', aboutUs: '', priceCategory: '$$'
  });
  const [modalCities, setModalCities] = useState([]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const userSpecificPointsKey = `userPoints_${userEmail}`;
    const savedPoints = localStorage.getItem(userSpecificPointsKey);
    setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
  }, []);

  const fetchRestaurantsData = useCallback(async () => {
    try {
      const selectedDbCategory = DATABASE_CATEGORIES[activeCategory] || 'All';
      const params = {
        category: 'food-hub',
        isApproved: 'true'
      };

      if (selectedDbCategory !== 'All') params.subCategory = selectedDbCategory;
      if (foodSearch.trim()) params.search = foodSearch.trim();

      // Handle desktop vs mobile filters
      if (window.innerWidth <= 768) {
        if (mobileCity) {
          params.city = mobileCity;
        } else if (mobileDistrict) {
          params.district = mobileDistrict;
        }
      } else {
        if (selectedType === 'district' && selectedName !== 'All Districts') params.district = selectedName;
        if (selectedType === 'city') params.city = selectedName;
      }

      const res = await axios.get(`${API_BASE_URL}/api/restaurants`, { params });
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error("Error loading restaurants:", err);
      setRestaurants([]);
    }
  }, [activeCategory, foodSearch, selectedType, selectedName, mobileDistrict, mobileCity, API_BASE_URL]);

  useEffect(() => { fetchRestaurantsData(); }, [fetchRestaurantsData]);

  const handleModalDistrictChange = (d) => {
    setFormData({ ...formData, district: d, location: '' });
    const matched = SRI_LANKA_LOCATIONS.find(l => l.district === d);
    setModalCities(matched ? matched.cities : []);
  };

  const handleMobileDistrictChange = (d) => {
    setMobileDistrict(d);
    setMobileCity('');
    const matched = SRI_LANKA_LOCATIONS.find(l => l.district === d);
    setMobileCities(matched ? matched.cities : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/admin/items`, {
        ...formData,
        category: 'food-hub'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const newPoints = points + 1;
      setPoints(newPoints);
      const userEmail = localStorage.getItem('userEmail') || 'guest';
      localStorage.setItem(`userPoints_${userEmail}`, newPoints.toString());

      showToast(res.data.message || "Submitted successfully! Pending admin approval. You earned +1 reward point!", 'success');
      setIsModalOpen(false);
      setFormData({
        name: '', location: '', district: '', subCategory: 'Sri Lankan', contact: '',
        image: '', mapUrl: '', aboutUs: '', priceCategory: '$$'
      });
      fetchRestaurantsData();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Submission failed!", 'error');
    }
  };

  const filteredLocations = SRI_LANKA_LOCATIONS.map(loc => {
    const matchesDistrict = loc.district.toLowerCase().includes(locationSearch.toLowerCase());
    const filteredCities = loc.cities.filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()));
    return (matchesDistrict || filteredCities.length > 0) ? { ...loc, filteredCities } : null;
  }).filter(Boolean);

  return (
      <div className={`min-h-screen pt-6 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>
        <style>{`
          /* Mobile Custom Top Bar & Fixed Menu Styles */
          .mobile-top-filter-row {
            display: none;
          }
          .mobile-add-restaurant-container {
            display: none;
          }
          
          /* Fixed Category Menu styling */
          .fh-sticky-menu {
            position: sticky;
            top: 0;
            z-index: 1000;
            background-color: var(--bg-color, inherit);
          }

          @media screen and (max-width: 768px) {
            .mobile-top-filter-row {
              display: flex !important;
              gap: 10px;
              margin-bottom: 20px;
              width: 100%;
              align-items: stretch;
            }
            .desktop-sidebar-pane {
              display: none !important;
            }
            .mobile-add-restaurant-container {
              display: block !important;
              margin-top: 24px;
              margin-bottom: 30px;
              width: 100%;
            }
          }
        `}</style>

        <div className="fh-sticky-menu">
          <CategoryMenu activeTab="food-hub" />
        </div>

        {/* Custom Toast Notification Container */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-xs font-bold ${
                        toast.type === 'success'
                            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300 shadow-emerald-950/50'
                            : 'bg-rose-950/90 border-rose-500/30 text-rose-300 shadow-rose-950/50'
                    }`}
                >
                  {toast.type === 'success' ? (
                      <FaCheckCircle className="text-emerald-400 text-base shrink-0" />
                  ) : (
                      <FaExclamationCircle className="text-rose-400 text-base shrink-0" />
                  )}
                  <span>{toast.message}</span>
                  <button
                      onClick={() => setToast(null)}
                      className="ml-2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <FaTimes size={12} />
                  </button>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        <LocationDetailsModal
            isOpen={!!selectedLocationItem}
            item={selectedLocationItem}
            onClose={() => setSelectedLocationItem(null)}
            language={language}
        />

        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
              <form className={`${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-6 rounded-2xl w-full max-w-lg border shadow-2xl transition-colors duration-300`} onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{t.addRestaurant || 'Add Restaurant'}</h2>
                  <FaTimes className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => setIsModalOpen(false)} />
                </div>

                <input required placeholder="Restaurant Name" value={formData.name} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, name: e.target.value })} />

                <div className="grid grid-cols-2 gap-2">
                  <select required value={formData.district} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => handleModalDistrictChange(e.target.value)}>
                    <option value="">{t.selectDistrict || 'Select District'}</option>
                    {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district}>{l.district}</option>)}
                  </select>
                  <select required disabled={modalCities.length === 0} value={formData.location} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-40`} onChange={e => setFormData({ ...formData, location: e.target.value })}>
                    <option value="">{t.selectCity || 'Select City'}</option>
                    {modalCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select required value={formData.subCategory} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, subCategory: e.target.value })}>
                    {DATABASE_CATEGORIES.filter(cat => cat !== "All").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select value={formData.priceCategory} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, priceCategory: e.target.value })}>
                    <option value="$">$ (Budget)</option>                     <option value="$$">$$ (Moderate)</option>                     <option value="$$$">$$$ (Luxury)</option>
                  </select>
                </div>

                <input required type="tel" placeholder="Contact Number" value={formData.contact} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                <input placeholder="Image URL" value={formData.image} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                <input placeholder="Google Maps URL" value={formData.mapUrl} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, mapUrl: e.target.value })} />
                <textarea placeholder="About Us / Description" value={formData.aboutUs} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, aboutUs: e.target.value })} />

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold mt-2 transition-colors cursor-pointer text-sm">Submit</button>
              </form>
            </div>
        )}

        {/* MOBILE TOP ROW: Points Box with "Add food and earn point" inside & District/City Filter */}
        <div className="mobile-top-filter-row">
          <div className={`${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl flex flex-col justify-between p-3.5 text-left`} style={{ flex: '1' }}>
            <div className="flex justify-between items-center w-full">
              <span className="text-xs font-bold text-gray-400">Points</span>
              <span className="text-[1.1rem] font-black text-amber-500 flex items-center gap-1"><FaCoins size={14} /> {points}</span>
            </div>
            <span className="text-[0.6rem] text-emerald-500 mt-2 font-semibold leading-tight">Add food and earn point</span>
          </div>

          <div className={`${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl`} style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '0.8rem' }}>Filter Location</h3>
            <select value={mobileDistrict} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-1.5 mb-1.5 rounded-lg border text-xs`} onChange={e => handleMobileDistrictChange(e.target.value)}>
              <option value="">All Districts</option>
              {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district}>{l.district}</option>)}
            </select>
            <select disabled={mobileCities.length === 0} value={mobileCity} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-1.5 rounded-lg border text-xs disabled:opacity-40`} onChange={e => setMobileCity(e.target.value)}>
              <option value="">All Cities</option>
              {mobileCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* DESKTOP SIDEBAR */}
          <div className="w-full lg:w-64 flex flex-col gap-4 desktop-sidebar-pane">
            <div className={`${isDark ? 'bg-[#11131a]/80 border-gray-800 text-white' : 'bg-white/90 border-gray-200 text-gray-900'} p-4 rounded-2xl border flex flex-col justify-between backdrop-blur-md shadow-sm transition-colors duration-300`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-gray-400">Points</span>
                <span className="text-xl font-black text-amber-500 flex items-center gap-1.5"><FaCoins size={16} /> {points}</span>
              </div>
              <span className="text-[0.65rem] text-emerald-500 mt-2 font-semibold leading-tight">Add food and earn point</span>
            </div>

            <div className={`${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-4 rounded-2xl border shadow-xl transition-colors duration-300`}>
              <h3 className="font-bold mb-3 text-sm">Filter by District</h3>

              <div className="glow-search-container" style={{ marginBottom: '12px' }}>
                <span className="glow-search-icon"><FaSearch size={16} /></span>
                <input
                    type="text"
                    placeholder="Search location..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="glow-search-input"
                />
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[350px] scrollbar-thin">
                <button onClick={() => { setSelectedType('all'); setSelectedName('All Districts'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-emerald-500 rounded-lg transition-colors">All Districts</button>
                {filteredLocations.map(loc => (
                    <div key={loc.district}>
                      <div className={`px-4 py-2.5 text-sm font-medium ${isDark ? 'text-gray-300 hover:bg-[#161922]' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer rounded-lg transition-colors flex justify-between items-center`} onClick={() => { setSelectedType('district'); setSelectedName(loc.district); setExpandedDistrict(expandedDistrict === loc.district ? null : loc.district); }}>
                        <span>{loc.district}</span>
                      </div>
                      {expandedDistrict === loc.district && (
                          <div className="pl-6 pb-2 space-y-1.5 mt-1">
                            {loc.filteredCities.map((c) => (
                                <button key={c} onClick={() => { setSelectedType('city'); setSelectedName(c); }} className="block w-full text-left py-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                                  {c}
                                </button>
                            ))}
                          </div>
                      )}
                    </div>
                ))}
              </div>
            </div>

            <button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/20 text-sm"><FaPlusCircle /> Add Restaurant</button>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold flex items-center gap-2.5">
                  <FaUtensils className="text-emerald-500" />
                  <span>Food Hub</span>
                </h1>
                <p className="text-sm text-gray-400 mt-1">Discover top restaurants and dining spots.</p>
              </div>

              <div className="glow-search-container" style={{ width: '100%', maxWidth: '320px' }}>
                <span className="glow-search-icon"><FaSearch size={18} /></span>
                <input
                    type="text"
                    placeholder="Search food or restaurant..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    className="glow-search-input"
                />
              </div>
            </div>

            {/* FOOD CATEGORY: Buttons for Desktop, Dropdown for Mobile */}
            <div className="mb-6">
              {/* Desktop Category Buttons */}
              <div className="hidden md:flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
                {DATABASE_CATEGORIES.map((cat, idx) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(idx)}
                        className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                            activeCategory === idx
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                                : `${isDark ? 'bg-[#11131a] text-gray-400 border-gray-800 hover:text-white' : 'bg-white text-gray-700 border-gray-200 hover:text-gray-950'} border`
                        }`}
                    >
                      {cat}
                    </button>
                ))}
              </div>

              {/* Mobile Category Dropdown ("Select Category") */}
              <div className="block md:hidden">
                <select
                    value={activeCategory}
                    className={`w-full ${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} p-3 rounded-xl border text-xs font-bold`}
                    onChange={(e) => setActiveCategory(Number(e.target.value))}
                >
                  <option value="" disabled>Select Category</option>
                  {DATABASE_CATEGORIES.map((cat, idx) => (
                      <option key={cat} value={idx}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={selectedName === 'All Districts' && !mobileDistrict ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6" : "flex flex-col gap-4 mt-6"}>
              {restaurants.length === 0 ? (
                  <p className={`text-gray-400 text-sm col-span-full text-center py-12 ${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200'} rounded-2xl border transition-colors`}>No restaurants found.</p>
              ) : (
                  restaurants.map((pkg, index) => (
                      <motion.div
                          key={pkg._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${isDark ? 'bg-[#11131a] border-gray-800 hover:border-gray-700 text-white' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'} rounded-2xl overflow-hidden border flex ${selectedName === 'All Districts' && !mobileDistrict ? 'flex-col' : 'flex-col sm:flex-row'} justify-between shadow-xl transition-all group`}
                      >
                        {selectedName === 'All Districts' && !mobileDistrict && (
                            <div className="relative overflow-hidden h-48 w-full cursor-pointer shrink-0" onClick={() => navigate(`/foodhub/${pkg._id || pkg.id}`)}>
                              <img src={pkg.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full">
                                {pkg.priceCategory || '$$'}
                              </span>
                            </div>
                        )}

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                              <FaMapMarkerAlt size={11} /> {pkg.location} {pkg.district ? `(${pkg.district})` : ''}
                            </span>
                            <div className="flex justify-between items-center mt-2">
                              <h3
                                  className="text-lg font-bold line-clamp-1 cursor-pointer hover:text-emerald-500 transition-colors"
                                  onClick={() => navigate(`/foodhub/${pkg._id || pkg.id}`)}
                              >
                                {pkg.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                  ))
              )}
            </div>

            {/* Mobile View එකේදී අන්තිමට add කරන ලද restaurant එකට යටින් පෙන්වන Add Restaurant බටන් එක */}
            <div className="mobile-add-restaurant-container">
              <button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all cursor-pointer shadow-lg text-sm">
                <FaPlusCircle /> Add Restaurant
              </button>
            </div>

          </div>
        </div>
      </div>
  );
};

export default FoodHub;