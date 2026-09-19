import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryMenu from '../components/CategoryMenu';
import LocationDetailsModal from '../components/LocationDetailsModal';
import { getTranslation } from '../utils/i18n';
import {
  FaMapMarkerAlt, FaPlusCircle, FaTimes, FaPhoneAlt, FaRoute, FaInfoCircle,
  FaStar, FaChair, FaWifi, FaParking, FaUtensils, FaVolumeUp, FaCoins, FaFilm, FaUserLock, FaSearch, FaCheckCircle, FaExclamationTriangle
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

const DATABASE_CATEGORIES = ["All", "Standard", "3D", "IMAX", "4DX", "VIP Lounge"];

const MovieTheaters = () => {
  const context = useOutletContext() || {};
  const language = context.language || 'English';
  const t = getTranslation(language);

  // Movie type selection: 'public' or 'private'
  const [movieTypeTab, setMovieTypeTab] = useState('public');

  const [selectedType, setSelectedType] = useState('all');
  const [selectedName, setSelectedName] = useState('All Districts');
  const [theaters, setTheaters] = useState([]);
  const [points, setPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationItem, setSelectedLocationItem] = useState(null);

  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [theaterSearch, setTheaterSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [modalCities, setModalCities] = useState([]);

  // Custom Toast Notification සඳහා state එක
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mobile specific filter states
  const [mobileDistrict, setMobileDistrict] = useState('');
  const [mobileCities, setMobileCities] = useState([]);
  const [mobileCity, setMobileCity] = useState('');

  // Dynamically track dark/light mode just like FoodHub
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

  // Custom Toast පණිවිඩ පෙන්වීම සඳහා වන Helper function එක
  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3500); // තත්පර 3.5 කින් පණිවිඩය ස්වයංක්‍රීයව අතුරුදහන් වේ
  };

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
    name: '', location: '', district: '', subCategory: 'Standard', contact: '',
    image: '', nowShowing: '', ticketPrice: '', rating: '4.5', reviewsCount: '120',
    seatCapacity: '150', facilities: '', movieType: 'public', mapUrl: '', aboutUs: ''
  });

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const userSpecificPointsKey = `userPoints_${userEmail}`;
    const savedPoints = localStorage.getItem(userSpecificPointsKey);
    setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
  }, []);

  const fetchTheaters = useCallback(async () => {
    try {
      const selectedDbCategory = DATABASE_CATEGORIES[activeCategory] || 'All';
      const params = {
        category: 'movie-theater',
        isApproved: 'true'
      };

      if (selectedDbCategory !== 'All') params.subCategory = selectedDbCategory;
      if (theaterSearch.trim()) params.search = theaterSearch.trim();

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

      const res = await axios.get(`${API_BASE_URL}/api/movie-theaters`, { params });
      let data = res.data.data || res.data || [];

      data = data.filter(item => (item.movieType || 'public') === movieTypeTab);
      setTheaters(data);
    } catch (err) {
      console.error("Error loading theaters:", err);
      setTheaters([]);
    }
  }, [activeCategory, theaterSearch, selectedType, selectedName, movieTypeTab, mobileDistrict, mobileCity]);

  useEffect(() => { fetchTheaters(); }, [fetchTheaters]);

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
        category: 'movie-theater',
        movieType: movieTypeTab
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const newPoints = points + 1;
      setPoints(newPoints);
      const userEmail = localStorage.getItem('userEmail') || 'guest';
      localStorage.setItem(`userPoints_${userEmail}`, newPoints.toString());

      showNotification('success', res.data.message || t.submitSuccess || "Submitted successfully! Pending admin approval. You earned +1 reward point!");
      setIsModalOpen(false);
      setFormData({
        name: '', location: '', district: '', subCategory: 'Standard', contact: '',
        image: '', nowShowing: '', ticketPrice: '', rating: '4.5', reviewsCount: '120',
        seatCapacity: '150', facilities: '', movieType: 'public', mapUrl: '', aboutUs: ''
      });
      fetchTheaters();
    } catch (err) {
      console.error(err);
      showNotification('error', err.response?.data?.message || t.submissionFailed || "Submission failed!");
    }
  };

  const filteredLocations = SRI_LANKA_LOCATIONS.map(loc => {
    const matchesDistrict = loc.district.toLowerCase().includes(locationSearch.toLowerCase());
    const filteredCities = loc.cities.filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()));
    return (matchesDistrict || filteredCities.length > 0) ? { ...loc, filteredCities } : null;
  }).filter(Boolean);

  return (
      <div className={`min-h-screen pt-6 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>

        {/* Custom Floating Toast Notification */}
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

        <style>{`
          .mobile-top-filter-row {
            display: none;
          }
          .mobile-add-theater-btn-wrapper {
            display: none;
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
            .mobile-add-theater-btn-wrapper {
              display: block !important;
              margin-top: 24px;
              width: 100%;
            }
          }
        `}</style>

        {/* Category Menu Fixed at the Top */}
        <div className="sticky top-0 z-40 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 bg-inherit">
          <CategoryMenu activeTab="movie-theater" />
        </div>

        {/* Location Details Modal */}
        <LocationDetailsModal
            isOpen={!!selectedLocationItem}
            item={selectedLocationItem}
            onClose={() => setSelectedLocationItem(null)}
            language={language}
        />

        {/* Submission Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className={`${isDark ? 'bg-[#11131a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} p-6 rounded-2xl w-full max-w-lg border shadow-2xl transition-colors duration-300`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{t.addTheater || 'Add Theater'} ({movieTypeTab === 'public' ? (t.publicCinemas || 'Public Cinemas') : (t.privateScreenings || 'Private Screenings')})</h2>
                  <FaTimes className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => setIsModalOpen(false)} />
                </div>

                <input required placeholder={t.name || "Theater Name"} value={formData.name} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => setFormData({ ...formData, name: e.target.value })} />

                <div className="grid grid-cols-2 gap-2">
                  <select required value={formData.district} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => handleModalDistrictChange(e.target.value)}>
                    <option value="" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>{t.selectDistrict || 'Select District'}</option>
                    {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district} className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>{l.district}</option>)}
                  </select>
                  <select required disabled={modalCities.length === 0} value={formData.location} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500 disabled:opacity-40`} onChange={e => setFormData({ ...formData, location: e.target.value })}>
                    <option value="" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>{t.selectCity || 'Select City'}</option>
                    {modalCities.map(c => <option key={c} value={c} className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select required value={formData.subCategory} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => setFormData({ ...formData, subCategory: e.target.value })}>
                    <option value="Standard" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>Standard</option>
                    <option value="3D" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>3D</option>
                    <option value="IMAX" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>IMAX</option>
                    <option value="4DX" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>4DX</option>
                    <option value="VIP Lounge" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>VIP Lounge</option>
                  </select>

                  <select required value={formData.movieType} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => setFormData({ ...formData, movieType: e.target.value })}>
                    <option value="public" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>{t.publicCinemas || 'Public Cinema'}</option>
                    <option value="private" className={isDark ? 'bg-[#161922] text-white' : 'bg-white text-gray-900'}>{t.privateScreenings || 'Private Screening'}</option>
                  </select>
                </div>

                <input placeholder={t.facilitiesPlaceholder || "Facilities (AC, Parking, Dolby, Food)"} value={formData.facilities} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => setFormData({ ...formData, facilities: e.target.value })} />

                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Rating (e.g. 4.5)" step="0.1" max="5" min="0" value={formData.rating} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
                  <input type="text" placeholder={t.pricePerNightPlaceholder || "Ticket Price (LKR)"} value={formData.ticketPrice} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                </div>

                <input required type="tel" placeholder={t.contactNumberPlaceholder || "Contact Number (e.g. 0771234567)"} value={formData.contact} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => setFormData({ ...formData, contact: e.target.value })} />

                <input placeholder={t.imageUrlPlaceholder || "Image URL"} value={formData.image} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'} p-3 mb-2 rounded-xl border text-sm focus:outline-none focus:border-orange-500`} onChange={e => setFormData({ ...formData, image: e.target.value })} />

                <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-xl font-bold mt-2 transition-colors cursor-pointer">{t.submit || 'Submit'}</button>
              </form>
            </div>
        )}

        {/* MOBILE TOP ROW: Points Box with subtitle (Left) & District/City Filter (Right, 50% width) */}
        <div className="mobile-top-filter-row">
          <div className={`${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl`} style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '12px 8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>Points</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><FaCoins size={14} /> {points}</span>
            <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '3px', lineHeight: '1.1' }}>Add theater and earn point</span>
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

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* District Sidebar */}
          <div className="w-full lg:w-64 flex flex-col gap-4 desktop-sidebar-pane">
            <div className={`${isDark ? 'bg-[#11131a]/80 border-gray-800 text-white' : 'bg-white/90 border-gray-200 text-gray-900'} p-4 rounded-2xl border flex justify-between items-center backdrop-blur-md shadow-sm transition-colors duration-300`}>
              <span className="text-xs font-bold text-gray-400">{t.points || 'Points'}</span>
              <span className="text-lg font-black text-amber-500 flex items-center gap-1.5"><FaCoins /> {points}</span>
            </div>

            <div className={`${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-4 rounded-2xl border shadow-xl transition-colors duration-300`}>
              <h3 className="font-bold mb-3 text-sm">{t.filterByDistrict || 'Filter by District'}</h3>

              {/* Glowing Search Bar for Location */}
              <div className="glow-search-container" style={{ marginBottom: '12px' }}>
                <span className="glow-search-icon"><FaSearch size={16} /></span>
                <input
                    type="text"
                    placeholder={t.search || "Search location..."}
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="glow-search-input"
                />
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[350px] scrollbar-thin">
                <button onClick={() => { setSelectedType('all'); setSelectedName('All Districts'); }} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-400 hover:text-orange-500 rounded-lg transition-colors">{t.allDistricts || 'All Districts'}</button>
                {filteredLocations.map(loc => (
                    <div key={loc.district}>
                      <div className={`px-4 py-2 text-xs font-medium ${isDark ? 'text-gray-300 hover:bg-[#161922]' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer rounded-lg transition-colors flex justify-between items-center`} onClick={() => { setSelectedType('district'); setSelectedName(loc.district); setExpandedDistrict(expandedDistrict === loc.district ? null : loc.district); }}>
                        <span>{loc.district}</span>
                      </div>
                      {expandedDistrict === loc.district && (
                          <div className="pl-6 pb-2 space-y-1 mt-1">
                            {loc.filteredCities.map((c) => (
                                <button key={c} onClick={() => { setSelectedType('city'); setSelectedName(c); }} className="block w-full text-left py-1 text-xs text-gray-500 hover:text-orange-400 transition-colors">
                                  {c}
                                </button>
                            ))}
                          </div>
                      )}
                    </div>
                ))}
              </div>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/20 text-xs"><FaPlusCircle /> {t.addTheater || 'Add Theater'}</button>
          </div>

          {/* Content Column */}
          <div className="flex-1">
            {/* Header & Public/Private Toggles (Styles matched with Dayout) */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold flex items-center gap-2.5">
                  <FaFilm className="text-amber-500" />
                  <span>{t.cinematicExperiences || 'Cinematic Experiences'}</span>
                </h1>
                <p className="text-sm text-gray-400 mt-1">{t.cinematicSubtitle || 'Discover public cinemas and private screening locations near you.'}</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Public vs Private Toggle Tabs */}
                <div className={`${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200 shadow-sm'} p-1 rounded-xl border flex gap-1 transition-colors duration-300`}>
                  <button
                      onClick={() => setMovieTypeTab('public')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${movieTypeTab === 'public' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <FaFilm size={12} />
                    <span>{t.publicCinemas || 'Public Cinemas'}</span>
                  </button>
                  <button
                      onClick={() => setMovieTypeTab('private')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${movieTypeTab === 'private' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <FaUserLock size={12} />
                    <span>{t.privateScreenings || 'Private Screenings'}</span>
                  </button>
                </div>

                {/* Glowing Search Bar for Main Search */}
                <div className="glow-search-container" style={{ width: '100%', maxWidth: '240px' }}>
                  <span className="glow-search-icon"><FaSearch size={18} /></span>
                  <input
                      type="text"
                      placeholder={t.searchTheater || "Search theater..."}
                      value={theaterSearch}
                      onChange={(e) => setTheaterSearch(e.target.value)}
                      className="glow-search-input"
                  />
                </div>
              </div>
            </div>

            {/* Subcategory Filter Tabs (Buttons for Desktop, Dropdown for Mobile) */}
            <div className="mb-6">
              {/* Desktop Subcategory Buttons */}
              <div className="hidden md:flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
                {DATABASE_CATEGORIES.map((cat, idx) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(idx)}
                        className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                            activeCategory === idx
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30'
                                : `${isDark ? 'bg-[#11131a] text-gray-400 border-gray-800 hover:text-white' : 'bg-white text-gray-700 border-gray-200 hover:text-gray-950'} border`
                        }`}
                    >
                      {t[cat.toLowerCase().replace(/\s+/g, '')] || cat}
                    </button>
                ))}
              </div>

              {/* Mobile Subcategory Dropdown ("Select Category") */}
              <div className="block md:hidden">
                <select
                    value={activeCategory}
                    className={`w-full ${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} p-3 rounded-xl border text-xs font-bold`}
                    onChange={(e) => setActiveCategory(Number(e.target.value))}
                >
                  <option value="" disabled>Select Category</option>
                  {DATABASE_CATEGORIES.map((cat, idx) => (
                      <option key={cat} value={idx}>{t[cat.toLowerCase().replace(/\s+/g, '')] || cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cards Display */}
            <div className={selectedName === 'All Districts' && !mobileDistrict ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6" : "flex flex-col gap-4 mt-6"}>
              {theaters.length === 0 ? (
                  <p className={`text-gray-400 text-sm col-span-full text-center py-12 ${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200'} rounded-2xl border transition-colors`}>No {movieTypeTab} movie theaters found for this location.</p>
              ) : (
                  theaters.map((pkg, index) => (
                      <motion.div
                          key={pkg._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${isDark ? 'bg-[#11131a] border-gray-800 hover:border-gray-700 text-white' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'} rounded-2xl overflow-hidden border flex ${selectedName === 'All Districts' && !mobileDistrict ? 'flex-col' : 'flex-col sm:flex-row'} justify-between shadow-xl transition-all group`}
                      >
                        {selectedName === 'All Districts' && !mobileDistrict && (
                            <div className="relative overflow-hidden h-48 w-full cursor-pointer shrink-0" onClick={() => setSelectedLocationItem(pkg)}>
                              <img src={pkg.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500'} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs font-black px-3 py-1 rounded-full uppercase">
                                {pkg.movieType || 'public'}
                              </span>
                            </div>
                        )}

                        <div className={`p-5 flex-1 flex ${selectedName === 'All Districts' && !mobileDistrict ? 'flex-col justify-between' : 'flex-col sm:flex-row justify-between items-start sm:items-center gap-4'}`}>
                          <div className={selectedName === 'All Districts' && !mobileDistrict ? '' : 'flex-1'}>
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1.5">
                              <FaMapMarkerAlt size={11} /> {pkg.location} {pkg.district ? `(${pkg.district})` : ''}
                              {!(selectedName === 'All Districts' && !mobileDistrict) && (
                                  <span className="ml-2 bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full inline-block uppercase">
                                    {pkg.movieType || 'public'}
                                  </span>
                              )}
                            </span>

                            <div className={`flex ${selectedName === 'All Districts' && !mobileDistrict ? 'justify-between items-start mt-2 gap-2' : 'items-center mt-2 gap-3'}`}>
                              <h3 className={`${selectedName === 'All Districts' && !mobileDistrict ? 'text-lg' : 'text-xl'} font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'} line-clamp-1 cursor-pointer hover:text-amber-400 transition-colors`} onClick={() => setSelectedLocationItem(pkg)}>{pkg.name}</h3>
                              <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-md text-xs font-bold shrink-0 border border-yellow-500/20">
                                <FaStar size={11} /> {pkg.rating || "4.5"}
                              </div>
                            </div>

                            {selectedName === 'All Districts' && !mobileDistrict && (
                                <div className="mt-3 space-y-2">
                                  <p className={`text-xs flex items-center gap-1.5 p-2 rounded-lg border ${isDark ? 'bg-[#161922] border-gray-800/40 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                                    <FaChair className="text-gray-400 text-xs shrink-0" />
                                    <span>Capacity:</span>
                                    <span className="text-amber-500 font-medium">{pkg.seatCapacity || '150'} Seats</span>
                                  </p>
                                  <div className="flex justify-between items-center pt-1">
                                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wide bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/20">{pkg.subCategory || 'Standard'}</span>
                                    <p className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>LKR {pkg.ticketPrice ? Number(pkg.ticketPrice).toLocaleString() : '0'}</p>
                                  </div>
                                </div>
                            )}
                          </div>

                          <div className={`flex justify-between items-center ${selectedName === 'All Districts' && !mobileDistrict ? 'mt-4 pt-3.5 border-t' : 'w-full sm:w-auto gap-2.5 pt-3 sm:pt-0 sm:border-l sm:border-t-0 pl-0 sm:pl-4 sm:ml-4'} ${isDark ? 'border-gray-800/80' : 'border-gray-200'}`}>
                            {pkg.contact ? (
                                <a
                                    href={`tel:${pkg.contact}`}
                                    className="bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-orange-600 hover:text-white transition-all"
                                >
                                  <FaPhoneAlt size={11} /> {t.call || 'Call'}
                                </a>
                            ) : (
                                <button disabled className={`border px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed ${isDark ? 'bg-gray-800/50 text-gray-600 border-gray-700/50' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                  <FaPhoneAlt size={11} /> {t.call || 'Call'}
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedLocationItem(pkg)}
                                className="text-xs font-bold text-amber-500 hover:text-orange-500 flex items-center gap-1.5 cursor-pointer bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl transition-all"
                            >
                              <FaInfoCircle size={13} /> {t.aboutUs || 'About Us'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                  ))
              )}
            </div>

            {/* Mobile Add Theater Button placed at the very bottom after all theater cards */}
            <div className="mobile-add-theater-btn-wrapper">
              <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/20 text-sm"
              >
                <FaPlusCircle /> {t.addTheater || 'Add Theater'}
              </button>
            </div>

          </div>
        </div>
      </div>
  );
};

export default MovieTheaters;