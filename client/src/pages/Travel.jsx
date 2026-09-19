import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryMenu from '../components/CategoryMenu';
import LocationDetailsModal from '../components/LocationDetailsModal';
import { getTranslation } from '../utils/i18n';
import {
  FaMapMarkerAlt, FaPlusCircle, FaTimes, FaPhoneAlt, FaRoute, FaInfoCircle, FaPlane, FaCoins, FaStar, FaSearch, FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';

const DATABASE_CATEGORIES = [
  "All",
  "Adventure",
  "Beaches",
  "Hiking",
  "Historical",
  "Cultural & Heritage",
  "Wildlife & Safaris",
  "Tea Country & Hills",
  "Wellness & Ayurveda",
  "City & Nightlife"
];

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

const Travel = () => {
  const context = useOutletContext() || {};
  const language = context.language || 'English';
  const t = getTranslation(language);
  const useNavigateInstance = useNavigate();

  const [selectedType, setSelectedType] = useState('all');
  const [selectedName, setSelectedName] = useState('All Districts');
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [packageSearch, setPackageSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [packages, setPackages] = useState([]);
  const [points, setPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationItem, setSelectedLocationItem] = useState(null);
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

  const [mobileDistrict, setMobileDistrict] = useState('');
  const [mobileCities, setMobileCities] = useState([]);
  const [mobileCity, setMobileCity] = useState('');

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const [formData, setFormData] = useState({
    name: '', location: '', district: '', subCategory: 'Adventure', contact: '',
    image: '', mapUrl: '', aboutUs: '', price: '0'
  });
  const [modalCities, setModalCities] = useState([]);

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

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const userSpecificPointsKey = `userPoints_${userEmail}`;
    const savedPoints = localStorage.getItem(userSpecificPointsKey);
    setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
  }, []);

  const fetchTravelData = useCallback(async () => {
    try {
      const currentSubCategory = DATABASE_CATEGORIES[activeCategory] || 'All';
      const params = {
        category: 'travel',
        isApproved: 'true'
      };

      if (currentSubCategory !== 'All') params.subCategory = currentSubCategory;
      if (packageSearch.trim()) params.search = packageSearch.trim();

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

      const res = await axios.get(`${API_BASE_URL}/api/travel`, { params });
      setPackages(res.data.data || []);
    } catch (err) {
      console.error("Error loading travel packages:", err);
      setPackages([]);
    }
  }, [activeCategory, packageSearch, selectedType, selectedName, mobileDistrict, mobileCity]);

  useEffect(() => { fetchTravelData(); }, [fetchTravelData]);

  const handleMobileDistrictChange = (d) => {
    setMobileDistrict(d);
    setMobileCity('');
    const matched = SRI_LANKA_LOCATIONS.find(l => l.district === d);
    setMobileCities(matched ? matched.cities : []);
  };

  const handleModalDistrictChange = (d) => {
    setFormData({ ...formData, district: d, location: '' });
    const matched = SRI_LANKA_LOCATIONS.find(l => l.district === d);
    setModalCities(matched ? matched.cities : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(`${API_BASE_URL}/api/admin/items`, {
        ...formData,
        category: 'travel'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const newPoints = points + 1;
      setPoints(newPoints);
      const userEmail = localStorage.getItem('userEmail') || 'guest';
      localStorage.setItem(`userPoints_${userEmail}`, newPoints.toString());

      showToast(res.data.message || "Submitted successfully! Pending admin approval. You earned +1 reward point!", "success");
      setIsModalOpen(false);
      setFormData({
        name: '', location: '', district: '', subCategory: 'Adventure', contact: '',
        image: '', mapUrl: '', aboutUs: '', price: '0'
      });
      fetchTravelData();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Submission failed!", "error");
    }
  };

  const filteredLocations = SRI_LANKA_LOCATIONS.map(loc => {
    const matchesDistrict = loc.district.toLowerCase().includes(locationSearch.toLowerCase());
    const filteredCities = loc.cities.filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()));
    return (matchesDistrict || filteredCities.length > 0) ? { ...loc, filteredCities } : null;
  }).filter(Boolean);

  const isDark = mode === 'dark';

  return (
      <div className={`fh-root ${isDark ? 'fh-dark' : 'fh-light'}`}>
        <style>{`
        .mobile-top-filter-row {
          display: none;
        }
        .mobile-add-place-container {
          display: none;
        }
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
          .mobile-add-place-container {
            display: block !important;
            margin-top: 24px;
            margin-bottom: 30px;
            width: 100%;
          }
        }
      `}</style>

        <div className="fh-sticky-menu">
          <CategoryMenu activeTab="travel" />
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
            <div className="fh-modal-overlay">
              <form className="fh-modal-box" onSubmit={handleSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Add Travel Destination</h2>
                  <FaTimes style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setIsModalOpen(false)} />
                </div>

                <input required placeholder="Destination Name" value={formData.name} className="fh-input" onChange={e => setFormData({ ...formData, name: e.target.value })} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <select required value={formData.district} className="fh-select" onChange={e => handleModalDistrictChange(e.target.value)}>
                    <option value="">Select District</option>
                    {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district}>{l.district}</option>)}
                  </select>
                  <select required disabled={modalCities.length === 0} value={formData.location} className="fh-select" onChange={e => setFormData({ ...formData, location: e.target.value })}>
                    <option value="">Select City</option>
                    {modalCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <select required value={formData.subCategory} className="fh-select" onChange={e => setFormData({ ...formData, subCategory: e.target.value })}>
                  {DATABASE_CATEGORIES.filter(cat => cat !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input required type="tel" placeholder="Contact Number" value={formData.contact} className="fh-input" onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                <input placeholder="Image URL" value={formData.image} className="fh-input" onChange={e => setFormData({ ...formData, image: e.target.value })} />
                <input placeholder="Google Maps URL" value={formData.mapUrl} className="fh-input" onChange={e => setFormData({ ...formData, mapUrl: e.target.value })} />
                <textarea placeholder="About Us / Description" value={formData.aboutUs} className="fh-textarea" onChange={e => setFormData({ ...formData, aboutUs: e.target.value })} />

                <button type="submit" className="fh-btn-primary">Submit</button>
              </form>
            </div>
        )}

        {/* MOBILE TOP ROW */}
        <div className="mobile-top-filter-row">
          <div className="fh-card-box" style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '12px 8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>Points</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><FaCoins size={14} /> {points}</span>
            <span style={{ fontSize: '0.7rem', color: '#3b82f6', textAlign: 'center', marginTop: '4px', fontWeight: '600', lineHeight: '1.2' }}>Add place and earn point</span>
          </div>

          <div className="fh-card-box" style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '0.8rem' }}>Filter Location</h3>
            <select value={mobileDistrict} className="fh-select" style={{ marginBottom: '6px', padding: '6px', fontSize: '12px' }} onChange={e => handleMobileDistrictChange(e.target.value)}>
              <option value="">All Districts</option>
              {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district}>{l.district}</option>)}
            </select>
            <select disabled={mobileCities.length === 0} value={mobileCity} className="fh-select" style={{ marginBottom: '0', padding: '6px', fontSize: '12px' }} onChange={e => setMobileCity(e.target.value)}>
              <option value="">All Cities</option>
              {mobileCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="fh-layout">
          {/* DESKTOP SIDEBAR */}
          <div className="fh-sidebar desktop-sidebar-pane">
            <div className="fh-card-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af' }}>Points</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}><FaCoins /> {points}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600', marginTop: '6px' }}>Add place and earn point</span>
            </div>

            <div className="fh-card-box">
              <h3 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '0.9rem' }}>Filter by District</h3>

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

              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <button onClick={() => { setSelectedType('all'); setSelectedName('All Districts'); }} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>All Districts</button>
                {filteredLocations.map(loc => (
                    <div key={loc.district}>
                      <div style={{ padding: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }} onClick={() => { setSelectedType('district'); setSelectedName(loc.district); setExpandedDistrict(expandedDistrict === loc.district ? null : loc.district); }}>
                        <span>{loc.district}</span>
                      </div>
                      {expandedDistrict === loc.district && (
                          <div style={{ paddingLeft: '16px' }}>
                            {loc.filteredCities.map((c) => (
                                <button key={c} onClick={() => { setSelectedType('city'); setSelectedName(c); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 0', background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '0.85rem', cursor: 'pointer' }}>
                                  {c}
                                </button>
                            ))}
                          </div>
                      )}
                    </div>
                ))}
              </div>
            </div>

            <button onClick={() => setIsModalOpen(true)} className="fh-btn-primary"><FaPlusCircle /> Add Travel Item</button>
          </div>

          <div style={{ flex: 1 }}>

            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold flex items-center gap-2.5">
                  <FaPlane className="text-blue-500" />
                  <span>Travel Hub</span>
                </h1>
                <p className="text-sm text-gray-400 mt-1">Discover top destinations and travel spots.</p>
              </div>

              <div className="glow-search-container" style={{ width: '100%', maxWidth: '280px' }}>
                <span className="glow-search-icon"><FaSearch size={16} /></span>
                <input
                    type="text"
                    placeholder="Search destination or place..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    className="glow-search-input"
                />
              </div>
            </div>

            {/* TRAVEL CATEGORY */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: window.innerWidth <= 768 ? 'none' : 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {DATABASE_CATEGORIES.map((cat, idx) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(idx)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          border: activeCategory === idx ? 'none' : '1px solid #374151',
                          backgroundColor: activeCategory === idx ? '#2563eb' : 'transparent',
                          color: activeCategory === idx ? '#fff' : '#9ca3af'
                        }}
                    >
                      {cat}
                    </button>
                ))}
              </div>

              <div style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}>
                <select
                    value={activeCategory}
                    className="fh-select"
                    style={{ fontWeight: 'bold', padding: '10px' }}
                    onChange={(e) => setActiveCategory(Number(e.target.value))}
                >
                  <option value="" disabled>Select Category</option>
                  {DATABASE_CATEGORIES.map((cat, idx) => (
                      <option key={cat} value={idx}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`fh-restaurants-grid ${selectedName === 'All Districts' ? 'grid-view' : ''}`}>
              {packages.length === 0 ? (
                  <p style={{ color: '#9ca3af', textAlign: 'center', padding: '48px', gridColumn: '1 / -1' }} className="fh-card-box">No travel destinations found.</p>
              ) : (
                  packages.map((item, index) => (
                      <motion.div
                          key={item._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="fh-restaurant-card"
                      >
                        {selectedName === 'All Districts' && !mobileDistrict && (
                            <div
                                style={{ position: 'relative', height: '180px', width: '100%', cursor: 'pointer' }}
                                onClick={() => useNavigateInstance(`/travel/${item._id || item.id}`)}
                            >
                              <img src={item.image || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#60a5fa', fontSize: '0.7rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '999px' }}>
                        {item.subCategory || 'Adventure'}
                      </span>
                            </div>
                        )}

                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                          <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaMapMarkerAlt size={11} /> {item.location} {item.district ? `(${item.district})` : ''}
                      </span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                              <h3
                                  style={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                                  onClick={() => useNavigateInstance(`/travel/${item._id || item.id}`)}
                              >
                                {item.name}
                              </h3>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid rgba(156, 163, 175, 0.1)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#34d399' }}>
                        {item.price && item.price !== '0' ? `Rs. ${Number(item.price).toLocaleString()}` : 'Free'}
                      </span>
                            <button
                                onClick={() => useNavigateInstance(`/travel/${item._id || item.id}`)}
                                className="fh-btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.75rem', margin: 0, width: 'auto' }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                  ))
              )}
            </div>

            <div className="mobile-add-place-container">
              <button onClick={() => setIsModalOpen(true)} className="fh-btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <FaPlusCircle /> Add Travel Item
              </button>
            </div>

          </div>
        </div>
      </div>
  );
};

export default Travel;