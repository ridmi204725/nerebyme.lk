import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryMenu from '../components/CategoryMenu';
import { getTranslation } from '../utils/i18n';
import { HOTEL_TYPES, HOTEL_TIERS, getHotelCategories, getLegacyHotelMeta } from '../utils/hotelCategories';
import {
    FaMapMarkerAlt, FaPlusCircle, FaTimes, FaPhoneAlt, FaInfoCircle,
    FaStar, FaBed, FaCoins, FaHotel, FaUserLock, FaSearch, FaCheckCircle, FaExclamationCircle
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

const HOTEL_GROUP_OPTIONS = [
    { id: 'all', label: 'All Hotels' },
    { id: 'Indoor', label: 'Indoor' },
    { id: 'Outdoor', label: 'Outdoor' }
];

const ROOMS_CATEGORIES = [
    { id: 'all', label: 'All Categories' },
    { id: 'Standard', label: 'Standard' },
    { id: 'Deluxe', label: 'Deluxe' },
    { id: 'Apartment', label: 'Apartment' },
    { id: 'Annex', label: 'Annex' },
    { id: 'Single Room', label: 'Single Room' }
];

const HotelsAndRooms = () => {
    const navigate = useNavigate();
    const context = useOutletContext() || {};
    const language = context.language || 'English';
    const t = getTranslation(language);

    const [sectionTab, setSectionTab] = useState('hotels');

    const [selectedType, setSelectedType] = useState('all');
    const [selectedName, setSelectedName] = useState('All Districts');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedHotelGroup, setSelectedHotelGroup] = useState('all');
    const [selectedHotelTier, setSelectedHotelTier] = useState('all');
    const [itemsList, setItemsList] = useState([]);
    const [points, setPoints] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    const [expandedDistrict, setExpandedDistrict] = useState(null);
    const [locationSearch, setLocationSearch] = useState('');
    const [hotelSearch, setHotelSearch] = useState('');
    const [modalCities, setModalCities] = useState([]);

    const [mobileDistrict, setMobileDistrict] = useState('');
    const [mobileCities, setMobileCities] = useState([]);
    const [mobileCity, setMobileCity] = useState('');

    const [nicNumber, setNicNumber] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [nicError, setNicError] = useState('');

    const [formData, setFormData] = useState({
        name: '', location: '', district: '', hotelType: 'Indoor', hotelTier: 'Budget', subCategory: 'City Hostels / Backpackers', contact: '',
        image: '', pricePerNight: '', rating: '4.5', reviewsCount: '120',
        capacity: '2', facilities: '', mapUrl: '', aboutUs: ''
    });

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

    const fetchItems = useCallback(async () => {
        try {
            const params = { category: sectionTab, isApproved: 'true' };
            if (sectionTab === 'hotels') {
                if (selectedHotelGroup !== 'all') params.hotelType = selectedHotelGroup;
                if (selectedHotelTier !== 'all') params.hotelTier = selectedHotelTier;
                if (selectedCategory !== 'all' && selectedHotelGroup !== 'all' && selectedHotelTier !== 'all') {
                    params.subCategory = selectedCategory;
                }
            } else if (selectedCategory !== 'all') {
                params.subCategory = selectedCategory;
            }
            if (hotelSearch.trim()) params.search = hotelSearch.trim();
            if (window.innerWidth <= 768) {
                if (mobileCity) params.city = mobileCity;
                else if (mobileDistrict) params.district = mobileDistrict;
            } else {
                if (selectedType === 'district' && selectedName !== 'All Districts') params.district = selectedName;
                if (selectedType === 'city') params.city = selectedName;
            }
            let res = await axios.get(`${API_BASE_URL}/api/items`, { params }).catch(() => axios.get(`${API_BASE_URL}/api/${sectionTab}`, { params }));
            const data = res.data.data || res.data || [];
            const filteredData = Array.isArray(data) ? data.filter(item => {
                const matchesSection = item.category?.toLowerCase() === sectionTab.toLowerCase() ||
                    (sectionTab === 'hotels' && item.category?.toLowerCase() === 'hotel');
                if (!matchesSection) return false;
                if (sectionTab !== 'hotels') return selectedCategory === 'all' || item.subCategory?.toLowerCase() === selectedCategory.toLowerCase();
                const legacy = getLegacyHotelMeta(item.subCategory);
                const type = item.hotelType || legacy.hotelType;
                const tier = item.hotelTier || legacy.hotelTier;
                if (selectedHotelGroup !== 'all' && type.toLowerCase() !== selectedHotelGroup.toLowerCase()) return false;
                if (selectedHotelTier !== 'all' && tier.toLowerCase() !== selectedHotelTier.toLowerCase()) return false;
                if (selectedCategory !== 'all' && item.subCategory?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
                return true;
            }) : [];
            setItemsList(filteredData);
        } catch (err) {
            console.error('Error loading data:', err);
            setItemsList([]);
        }
    }, [selectedType, selectedName, sectionTab, selectedCategory, selectedHotelGroup, selectedHotelTier, hotelSearch, mobileDistrict, mobileCity]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const validateAgeFromNIC = (nic) => {
        let birthYear = 0;
        let days = 0;
        const cleanNic = nic.trim();

        if (cleanNic.length === 10) {
            birthYear = parseInt("19" + cleanNic.substring(0, 2), 10);
            days = parseInt(cleanNic.substring(2, 5), 10);
        } else if (cleanNic.length === 12) {
            birthYear = parseInt(cleanNic.substring(0, 4), 10);
            days = parseInt(cleanNic.substring(4, 7), 10);
        } else {
            return false;
        }

        if (days > 500) days -= 500;

        const birthDate = new Date(birthYear, 0, days);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    };

    const handleNICVerification = (e) => {
        e.preventDefault();
        setNicError('');
        if (validateAgeFromNIC(nicNumber)) {
            setIsVerified(true);
        } else {
            setNicError(t.nicUnderageError || "Sorry, you must be over 18 years old.");
        }
    };

    const handleModalDistrictChange = (d) => {
        setFormData({ ...formData, district: d, location: '' });
        const matched = SRI_LANKA_LOCATIONS.find(l => l.district === d);
        setModalCities(matched ? matched.cities : []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!localStorage.getItem('token')) { alert('Please login before adding a listing.'); return; }
        try {
            const token = localStorage.getItem('token');

            // පරීක්ෂා කිරීම සඳහා දත්ත Console එකට මුද්‍රණය කරමු
            console.log("Submitting form data:", {
                ...formData,
                category: sectionTab,
                isApproved: false
            });

            const res = await axios.post(`${API_BASE_URL}/api/seller/items`, {
                ...formData,
                category: sectionTab,
                isApproved: false
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const newPoints = points + 1;
            setPoints(newPoints);
            const userEmail = localStorage.getItem('userEmail') || 'guest';
            localStorage.setItem(`userPoints_${userEmail}`, newPoints.toString());

            showToast(res.data.message || "Submitted successfully! Pending admin approval.", 'success');
            setIsModalOpen(false);
            setFormData({
                name: '', location: '', district: '', hotelType: sectionTab === 'hotels' ? 'Indoor' : '', hotelTier: sectionTab === 'hotels' ? 'Budget' : '', subCategory: sectionTab === 'hotels' ? 'City Hostels / Backpackers' : 'Standard', contact: '',
                image: '', pricePerNight: '', rating: '4.5', reviewsCount: '120',
                capacity: '2', facilities: '', mapUrl: '', aboutUs: ''
            });

            // අකර්මන්‍ය කර තිබූ (ignored) Promise එක නිවැරදිව await කිරීම
            await fetchItems();

        } catch (err) {
            console.error("Submission Error Details:", err.response || err);
            // Backend එකෙන් එන නිශ්චිත Error පණිවිඩය Toast එකේ පෙන්වීම
            const errorMessage = err.response?.data?.message || err.message || "Submission failed!";
            showToast(errorMessage, 'error');
        }
    };
    const filteredLocations = SRI_LANKA_LOCATIONS.map(loc => {
        const matchesDistrict = loc.district.toLowerCase().includes(locationSearch.toLowerCase());
        const filteredCities = loc.cities.filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()));
        return (matchesDistrict || filteredCities.length > 0) ? { ...loc, filteredCities } : null;
    }).filter(Boolean);

    const isDark = mode === 'dark';

    const handleHotelGroupSelect = (groupId) => {
        setSelectedHotelGroup(groupId);
        setSelectedHotelTier('all');
        setSelectedCategory('all');
    };

    const handleHotelTierSelect = (tier) => {
        setSelectedHotelTier(tier);
        setSelectedCategory('all');
    };

    const handleHotelLeafSelect = (category) => setSelectedCategory(category);

    const handleHotelTypeChange = (hotelType) => {
        const hotelTier = 'Budget';
        const categories = getHotelCategories(hotelType, hotelTier);
        setFormData(prev => ({ ...prev, hotelType, hotelTier, subCategory: categories[0] || '' }));
    };

    const handleHotelTierChange = (hotelTier) => {
        const categories = getHotelCategories(formData.hotelType, hotelTier);
        setFormData(prev => ({ ...prev, hotelTier, subCategory: categories[0] || '' }));
    };

    return (
        <div className={`min-h-screen pt-6 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>
            <style>{`
          .mobile-top-filter-row { display: none; }
          .mobile-add-hotel-container { display: none; }
          .fh-sticky-menu { position: sticky; top: 0; z-index: 1000; background-color: var(--bg-color, inherit); }
          @media screen and (max-width: 768px) {
            .mobile-top-filter-row { display: flex !important; gap: 10px; margin-bottom: 20px; width: 100%; align-items: stretch; }
            .desktop-sidebar-pane { display: none !important; }
            .mobile-add-hotel-container { display: block !important; margin-top: 24px; margin-bottom: 30px; width: 100%; }
          }
        `}</style>

            <div className="fh-sticky-menu">
                <CategoryMenu activeTab={sectionTab} />
            </div>

            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-xs font-bold ${
                                toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/90 border-rose-500/30 text-rose-300'
                            }`}
                        >
                            {toast.type === 'success' ? <FaCheckCircle className="text-emerald-400 text-base shrink-0" /> : <FaExclamationCircle className="text-rose-400 text-base shrink-0" />}
                            <span>{toast.message}</span>
                            <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-white cursor-pointer"><FaTimes size={12} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <form className={`${isDark ? 'bg-[#11131a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} p-6 rounded-2xl w-full max-w-lg border shadow-2xl`} onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{t.addNew || 'Add New'} {sectionTab === 'hotels' ? 'Hotels' : 'Rooms'}</h2>
                            <FaTimes className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setIsModalOpen(false)} />
                        </div>
                        <input required placeholder="Name" value={formData.name} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm`} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                            <select required value={formData.district} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm`} onChange={e => handleModalDistrictChange(e.target.value)}>
                                <option value="">Select District</option>
                                {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district}>{l.district}</option>)}
                            </select>
                            <select required disabled={modalCities.length === 0} value={formData.location} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm disabled:opacity-40`} onChange={e => setFormData({ ...formData, location: e.target.value })}>
                                <option value="">Select City</option>
                                {modalCities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        {sectionTab === 'hotels' ? (
                            <div className="mb-3 space-y-2">
                                <label className="block text-xs font-semibold text-gray-400">Hotel Type</label>
                                <select value={formData.hotelType} onChange={e => handleHotelTypeChange(e.target.value)} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 rounded-xl border text-sm`}>
                                    {HOTEL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                                <label className="block text-xs font-semibold text-gray-400 pt-1">Budget / Luxury</label>
                                <select value={formData.hotelTier} onChange={e => handleHotelTierChange(e.target.value)} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 rounded-xl border text-sm`}>
                                    {HOTEL_TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                                </select>
                                <label className="block text-xs font-semibold text-gray-400 pt-1">Hotel Category</label>
                                <select value={formData.subCategory} onChange={e => setFormData({ ...formData, subCategory: e.target.value })} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 rounded-xl border text-sm`}>
                                    {getHotelCategories(formData.hotelType, formData.hotelTier).map(category => <option key={category} value={category}>{category}</option>)}
                                </select>
                            </div>
                        ) : (
                            <select value={formData.subCategory} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm`} onChange={e => setFormData({ ...formData, subCategory: e.target.value })}>
                                {ROOMS_CATEGORIES.filter(cat => cat.id !== 'all').map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        )}
                        <input placeholder="Facilities (WiFi, AC, Parking)" value={formData.facilities} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm`} onChange={e => setFormData({ ...formData, facilities: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="number" placeholder="Price Per Night" value={formData.pricePerNight} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm`} onChange={e => setFormData({ ...formData, pricePerNight: e.target.value })} />
                            <input required type="tel" placeholder="Contact Number" value={formData.contact} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm`} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                        </div>
                        <input placeholder="Image URL" value={formData.image} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm`} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold mt-2 cursor-pointer text-sm">Submit</button>
                    </form>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 mt-6">
                {/* Sidebar */}
                <div className="w-full lg:w-64 flex flex-col gap-4 desktop-sidebar-pane">
                    <div className={`${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-4 rounded-2xl border shadow-sm`}>
                        <div className="w-full flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400">Points</span>
                            <span className="text-lg font-black text-amber-500 flex items-center gap-1.5"><FaCoins /> {points}</span>
                        </div>
                        <span className="text-xs text-emerald-500 font-semibold mt-1.5 block">Add hotel and earn point</span>
                    </div>
                    <div className={`${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-4 rounded-2xl border shadow-xl`}>
                        <h3 className="font-bold mb-3 text-sm">Filter by District</h3>
                        <input
                            type="text"
                            placeholder="Search location..."
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            className={`w-full p-2 mb-3 rounded-lg border text-xs ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                        />
                        <div className="space-y-1 overflow-y-auto max-h-[350px]">
                            <button onClick={() => { setSelectedType('all'); setSelectedName('All Districts'); }} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-400 hover:text-emerald-500 rounded-lg">All Districts</button>
                            {filteredLocations.map(loc => (
                                <div key={loc.district}>
                                    <div className={`px-3 py-2 text-xs font-medium ${isDark ? 'text-gray-300 hover:bg-[#161922]' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer rounded-lg flex justify-between items-center`} onClick={() => { setSelectedType('district'); setSelectedName(loc.district); setExpandedDistrict(expandedDistrict === loc.district ? null : loc.district); }}>
                                        <span>{loc.district}</span>
                                    </div>
                                    {expandedDistrict === loc.district && (
                                        <div className="pl-4 pb-2 space-y-1 mt-1">
                                            {loc.filteredCities.map((c) => (
                                                <button key={c} onClick={() => { setSelectedType('city'); setSelectedName(c); }} className="block w-full text-left py-1 text-xs text-gray-500 hover:text-emerald-400">
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 cursor-pointer text-xs"><FaPlusCircle /> Add {sectionTab === 'hotels' ? 'Hotels' : 'Rooms'}</button>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold flex items-center gap-2.5">
                                <FaHotel className="text-emerald-500" />
                                <span>Accommodation Options</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200'} p-1 rounded-xl border flex gap-1`}>
                                <button onClick={() => { setSectionTab('hotels'); setSelectedCategory('all'); setSelectedHotelGroup('all'); setSelectedHotelTier('all'); }} className={`px-4 py-2 rounded-lg font-bold text-xs cursor-pointer ${sectionTab === 'hotels' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>Hotels</button>
                                <button onClick={() => { setSectionTab('rooms'); setSelectedCategory('all'); setSelectedHotelGroup('all'); setSelectedHotelTier('all'); }} className={`px-4 py-2 rounded-lg font-bold text-xs cursor-pointer ${sectionTab === 'rooms' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>Rooms</button>
                            </div>
                        </div>
                    </div>

                    {sectionTab === 'hotels' && (
                        <div className="mb-6 space-y-3">
                            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                                {HOTEL_GROUP_OPTIONS.map(group => (
                                    <button key={group.id} type="button" onClick={() => handleHotelGroupSelect(group.id)} className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${selectedHotelGroup === group.id ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/30' : `${isDark ? 'bg-[#11131a] text-gray-400 border-gray-800 hover:text-white' : 'bg-white text-gray-700 border-gray-200 hover:text-gray-950'}`}`}>{group.label}</button>
                                ))}
                            </div>
                            {selectedHotelGroup !== 'all' && (
                                <div className="flex items-center gap-2 overflow-x-auto py-1 pl-1 scrollbar-none">
                                    <button type="button" onClick={() => handleHotelTierSelect('all')} className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border ${selectedHotelTier === 'all' ? 'bg-emerald-600 text-white border-emerald-500' : `${isDark ? 'bg-[#11131a] text-gray-400 border-gray-800' : 'bg-white text-gray-700 border-gray-200'}`}`}>All {selectedHotelGroup}</button>
                                    {HOTEL_TIERS.map(tier => <button key={tier} type="button" onClick={() => handleHotelTierSelect(tier)} className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border ${selectedHotelTier === tier ? 'bg-emerald-600 text-white border-emerald-500' : `${isDark ? 'bg-[#11131a] text-gray-400 border-gray-800' : 'bg-white text-gray-700 border-gray-200'}`}`}>{tier}</button>)}
                                </div>
                            )}
                            {selectedHotelGroup !== 'all' && selectedHotelTier !== 'all' && (
                                <div className="flex items-center gap-2 overflow-x-auto py-1 pl-1 scrollbar-none">
                                    <button type="button" onClick={() => setSelectedCategory('all')} className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border ${selectedCategory === 'all' ? 'bg-cyan-600 text-white border-cyan-500' : `${isDark ? 'bg-[#11131a] text-gray-400 border-gray-800' : 'bg-white text-gray-700 border-gray-200'}`}`}>All {selectedHotelTier}</button>
                                    {getHotelCategories(selectedHotelGroup, selectedHotelTier).map(category => <button key={category} type="button" onClick={() => handleHotelLeafSelect(category)} className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border ${selectedCategory === category ? 'bg-cyan-600 text-white border-cyan-500' : `${isDark ? 'bg-[#11131a] text-gray-400 border-gray-800' : 'bg-white text-gray-700 border-gray-200'}`}`}>{category}</button>)}
                                </div>
                            )}
                        </div>
                    )}

                    {sectionTab === 'rooms' && !isVerified ? (
                        <div className={`${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-8 rounded-2xl border text-center max-w-md mx-auto my-12`}>
                            <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2"><FaUserLock className="text-emerald-500" /> Age Verification Required</h3>
                            <p className="text-sm mb-6 text-gray-400">Please enter your NIC number to verify your age.</p>
                            <form onSubmit={handleNICVerification}>
                                <input type="text" placeholder="Enter NIC Number" value={nicNumber} onChange={(e) => setNicNumber(e.target.value)} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm`} />
                                {nicError && <p className="text-xs text-rose-500 mb-3">{nicError}</p>}
                                <button type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold text-sm cursor-pointer">Verify Age</button>
                            </form>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {Array.isArray(itemsList) && itemsList.length === 0 ? (
                                <p className="text-gray-400 text-xs col-span-full text-center py-10">No {sectionTab} found matching your criteria.</p>
                            ) : (
                                Array.isArray(itemsList) && itemsList.map((item, index) => (
                                    <div key={item._id || index} className={`nm-listing-card ${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} rounded-2xl overflow-hidden border flex flex-col shadow-xl`}>
                                        <div className="relative overflow-hidden h-44 w-full cursor-pointer" onClick={() => navigate(`/hotels/${item._id || item.id}`)}>
                                            <img src={item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4 flex flex-col justify-between flex-1">
                                            <div>
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                                                    <FaMapMarkerAlt size={9} /> {item.location} {item.district ? `(${item.district})` : ''}
                                                </span>
                                                <h3 className="text-base font-bold mt-1 line-clamp-1 cursor-pointer" onClick={() => navigate(`/hotels/${item._id || item.id}`)}>{item.name}</h3>
                                            </div>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800/40">
                                                <span className="text-xs font-semibold text-emerald-400">LKR {item.pricePerNight ? Number(item.pricePerNight).toLocaleString() : '0'}</span>
                                                <button onClick={() => navigate(`/hotels/${item._id || item.id}`)} className="text-xs font-bold text-emerald-400 cursor-pointer flex items-center gap-1">
                                                    <FaInfoCircle size={12} /> View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HotelsAndRooms;