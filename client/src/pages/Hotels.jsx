import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryMenu from '../components/CategoryMenu';
import { getTranslation } from '../utils/i18n';
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

const HOTELS_CATEGORIES = [
    { id: 'all', label: 'All Categories' },
    { id: 'Luxury', label: 'Luxury' },
    { id: 'Resort', label: 'Resort' },
    { id: 'Boutique', label: 'Boutique' },
    { id: 'Budget', label: 'Budget' },
    { id: 'Villa', label: 'Villa' }
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
    const [itemsList, setItemsList] = useState([]);
    const [points, setPoints] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(localStorage.getItem('mode') || 'dark');

    // Toast notification state
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

    // Mobile specific filter states
    const [mobileDistrict, setMobileDistrict] = useState('');
    const [mobileCities, setMobileCities] = useState([]);
    const [mobileCity, setMobileCity] = useState('');

    const [nicNumber, setNicNumber] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [nicError, setNicError] = useState('');

    const [formData, setFormData] = useState({
        name: '', location: '', district: '', subCategory: 'Standard', contact: '',
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
            const params = {
                category: sectionTab,
                isApproved: 'true'
            };

            if (selectedCategory !== 'all') params.subCategory = selectedCategory;
            if (hotelSearch.trim()) params.search = hotelSearch.trim();

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

            let res = await axios.get(`${API_BASE_URL}/api/items`, { params }).catch(() => {
                return axios.get(`${API_BASE_URL}/api/${sectionTab}`, { params });
            });

            let data = res.data.data || res.data || [];

            const filteredData = data.filter(item =>
                item.category?.toLowerCase() === sectionTab.toLowerCase() ||
                (sectionTab === 'hotels' && item.category?.toLowerCase() === 'hotel')
            );

            setItemsList(filteredData.length > 0 ? filteredData : data);
        } catch (err) {
            console.error("Error loading data:", err);
            setItemsList([]);
        }
    }, [selectedType, selectedName, sectionTab, selectedCategory, hotelSearch, mobileDistrict, mobileCity, API_BASE_URL]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleMobileDistrictChange = (d) => {
        setMobileDistrict(d);
        setMobileCity('');
        const matched = SRI_LANKA_LOCATIONS.find(l => l.district === d);
        setMobileCities(matched ? matched.cities : []);
    };

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
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/admin/items`, {
                ...formData,
                category: sectionTab
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const newPoints = points + 1;
            setPoints(newPoints);
            const userEmail = localStorage.getItem('userEmail') || 'guest';
            localStorage.setItem(`userPoints_${userEmail}`, newPoints.toString());

            showToast(res.data.message || (t.submitSuccess || "Submitted successfully! Pending admin approval. You earned +1 reward point!"), 'success');
            setIsModalOpen(false);
            setFormData({
                name: '', location: '', district: '', subCategory: 'Standard', contact: '',
                image: '', pricePerNight: '', rating: '4.5', reviewsCount: '120',
                capacity: '2', facilities: '', mapUrl: '', aboutUs: ''
            });
            fetchItems();
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || (t.submissionFailed || "Submission failed!"), 'error');
        }
    };

    const filteredLocations = SRI_LANKA_LOCATIONS.map(loc => {
        const matchesDistrict = loc.district.toLowerCase().includes(locationSearch.toLowerCase());
        const filteredCities = loc.cities.filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()));
        return (matchesDistrict || filteredCities.length > 0) ? { ...loc, filteredCities } : null;
    }).filter(Boolean);

    const currentCategories = sectionTab === 'hotels' ? HOTELS_CATEGORIES : ROOMS_CATEGORIES;
    const isDark = mode === 'dark';

    return (
        <div className={`min-h-screen pt-6 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto font-sans transition-colors duration-300 ${isDark ? 'text-white bg-[#0b0f19]' : 'text-gray-950 bg-gray-50'}`}>
            <style>{`
          .mobile-top-filter-row {
            display: none;
          }
          .mobile-add-hotel-container {
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
            .mobile-add-hotel-container {
              display: block !important;
              margin-top: 24px;
              margin-bottom: 30px;
              width: 100%;
            }
          }
        `}</style>

            <div className="fh-sticky-menu">
                <CategoryMenu activeTab={sectionTab} />
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

            {/* Submission Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <form className={`${isDark ? 'bg-[#11131a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} p-6 rounded-2xl w-full max-w-lg border shadow-2xl transition-colors duration-300`} onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{t.addNew || 'Add New'} {sectionTab === 'hotels' ? (t.hotels || 'Hotels') : (t.rooms || 'Rooms')}</h2>
                            <FaTimes className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => setIsModalOpen(false)} />
                        </div>

                        <input required placeholder={t.name || "Name"} value={formData.name} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, name: e.target.value })} />

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

                        <select value={formData.subCategory} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, subCategory: e.target.value })}>
                            {currentCategories.filter(cat => cat.id !== 'all').map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>

                        <input placeholder={t.facilitiesPlaceholder || "Facilities (WiFi, AC, Parking)"} value={formData.facilities} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, facilities: e.target.value })} />

                        <div className="grid grid-cols-2 gap-2">
                            <input type="number" placeholder={t.pricePerNightPlaceholder || "Price Per Night (LKR)"} value={formData.pricePerNight} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, pricePerNight: e.target.value })} />
                            <input required type="tel" placeholder={t.contactNumberPlaceholder || "Contact Number"} value={formData.contact} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                        </div>

                        <input placeholder={t.imageUrlPlaceholder || "Image URL"} value={formData.image} className={`w-full ${isDark ? 'bg-[#161922] border-gray-800/60 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`} onChange={e => setFormData({ ...formData, image: e.target.value })} />

                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold mt-2 transition-colors cursor-pointer text-sm">{t.submit || 'Submit'}</button>
                    </form>
                </div>
            )}

            {/* MOBILE TOP ROW: Points Box with "Add hotel and earn point" inside & District/City Filter */}
            <div className="mobile-top-filter-row">
                <div className={`${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl`} style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '12px 8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>Points</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><FaCoins size={14} /> {points}</span>
                    <span style={{ fontSize: '0.8rem', color: '#10b981', textAlign: 'center', marginTop: '4px', fontWeight: '600', lineHeight: '1.2' }}>Add hotel and earn point</span>
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
                {/* Sidebar */}
                <div className="w-full lg:w-64 flex flex-col gap-4 desktop-sidebar-pane">
                    <div className={`${isDark ? 'bg-[#11131a]/80 border-gray-800 text-white' : 'bg-white/90 border-gray-200 text-gray-900'} p-4 rounded-2xl border flex flex-col justify-center items-start backdrop-blur-md shadow-sm transition-colors duration-300`}>
                        <div className="w-full flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400">{t.points || 'Points'}</span>
                            <span className="text-lg font-black text-amber-500 flex items-center gap-1.5"><FaCoins /> {points}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600', marginTop: '6px' }}>Add hotel and earn point</span>
                    </div>

                    <div className={`${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-4 rounded-2xl border shadow-xl transition-colors duration-300`}>
                        <h3 className="font-bold mb-3 text-sm">{t.filterByDistrict || 'Filter by District'}</h3>

                        <div className="glow-search-container mb-3">
                            <span className="glow-search-icon"><FaSearch size={16} /></span>
                            <input
                                type="text"
                                placeholder="Search location..."
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                                className="glow-search-input"
                            />
                        </div>

                        <div className="space-y-1 overflow-y-auto max-h-[350px] scrollbar-thin">
                            <button onClick={() => { setSelectedType('all'); setSelectedName('All Districts'); }} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-400 hover:text-emerald-500 rounded-lg transition-colors">{t.allDistricts || 'All Districts'}</button>
                            {filteredLocations.map(loc => (
                                <div key={loc.district}>
                                    <div className={`px-4 py-2 text-xs font-medium ${isDark ? 'text-gray-300 hover:bg-[#161922]' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer rounded-lg transition-colors flex justify-between items-center`} onClick={() => { setSelectedType('district'); setSelectedName(loc.district); setExpandedDistrict(expandedDistrict === loc.district ? null : loc.district); }}>
                                        <span>{loc.district}</span>
                                    </div>
                                    {expandedDistrict === loc.district && (
                                        <div className="pl-6 pb-2 space-y-1 mt-1">
                                            {loc.filteredCities.map((c) => (
                                                <button key={c} onClick={() => { setSelectedType('city'); setSelectedName(c); }} className="block w-full text-left py-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors">
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/20 text-xs"><FaPlusCircle /> {t.add || 'Add'} {sectionTab === 'hotels' ? (t.hotels || 'Hotels') : (t.rooms || 'Rooms')}</button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold flex items-center gap-2.5">
                                <FaHotel className="text-emerald-500" />
                                <span>{t.accommodationOptions || 'Accommodation Options'}</span>
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">Discover top hotels and private rooms near you.</p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Hotels vs Rooms Toggle Switch Tabs */}
                            <div className={`${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200 shadow-sm'} p-1 rounded-xl border flex gap-1 transition-colors duration-300`}>
                                <button
                                    onClick={() => { setSectionTab('hotels'); setSelectedCategory('all'); }}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${sectionTab === 'hotels' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    <FaHotel size={12} />
                                    <span>{t.hotels || 'Hotels'}</span>
                                </button>
                                <button
                                    onClick={() => { setSectionTab('rooms'); setSelectedCategory('all'); }}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${sectionTab === 'rooms' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    <FaBed size={12} />
                                    <span>{t.rooms || 'Rooms'}</span>
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="glow-search-container" style={{ width: '100%', maxWidth: '240px' }}>
                                <span className="glow-search-icon"><FaSearch size={18} /></span>
                                <input
                                    type="text"
                                    placeholder="Search hotel or room..."
                                    value={hotelSearch}
                                    onChange={(e) => setHotelSearch(e.target.value)}
                                    className="glow-search-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subcategory Filter Tabs (Buttons for Desktop, Dropdown for Mobile) */}
                    <div className="mb-6">
                        {/* Desktop Subcategory Buttons */}
                        <div className="hidden md:flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
                            {currentCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        selectedCategory === cat.id
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                                            : `${isDark ? 'bg-[#11131a] text-gray-400 border-gray-800 hover:text-white' : 'bg-white text-gray-700 border-gray-200 hover:text-gray-950'} border`
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Subcategory Dropdown ("Select Category") */}
                        <div className="block md:hidden">
                            <select
                                value={selectedCategory}
                                className={`w-full ${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} p-3 rounded-xl border text-xs font-bold`}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="" disabled>Select Category</option>
                                {currentCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Age Verification for Rooms */}
                    {sectionTab === 'rooms' && !isVerified ? (
                        <div className={`${isDark ? 'bg-[#11131a] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-xl'} p-8 rounded-2xl border text-center max-w-md mx-auto my-12 backdrop-blur-md transition-colors duration-300`}>
                            <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2"><FaUserLock className="text-emerald-500" /> {t.ageVerificationRequired || 'Age Verification Required'}</h3>
                            <p className="text-sm mb-6 text-gray-400">{t.roomVerificationMsg || 'Please enter your NIC number to verify your age before viewing rooms.'}</p>
                            <form onSubmit={handleNICVerification}>
                                <input
                                    type="text"
                                    placeholder={t.enterNicNumber || 'Enter NIC Number'}
                                    value={nicNumber}
                                    onChange={(e) => setNicNumber(e.target.value)}
                                    className={`w-full ${isDark ? 'bg-[#161922] border-gray-800 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} p-3 mb-3 rounded-xl border text-sm focus:outline-none focus:border-emerald-500`}
                                />
                                {nicError && <p className="text-xs text-rose-500 mb-3">{nicError}</p>}
                                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold transition-colors cursor-pointer text-sm">{t.verify || 'Verify Age'}</button>
                            </form>
                        </div>
                    ) : (
                        <div className={selectedName === 'All Districts' && !mobileDistrict ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6" : "flex flex-col gap-4 mt-6"}>
                            {itemsList.length === 0 ? (
                                <p className={`text-gray-400 text-xs col-span-full text-center py-10 ${isDark ? 'bg-[#11131a] border-gray-800' : 'bg-white border-gray-200'} rounded-2xl border transition-colors`}>No {sectionTab} found matching your criteria.</p>
                            ) : (
                                itemsList.map((item, index) => (
                                    <motion.div
                                        key={item._id || index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`${isDark ? 'bg-[#11131a] border-gray-800 hover:border-gray-700 text-white' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'} rounded-2xl overflow-hidden border flex ${selectedName === 'All Districts' && !mobileDistrict ? 'flex-col' : 'flex-col sm:flex-row'} justify-between shadow-xl transition-all group`}
                                    >
                                        {selectedName === 'All Districts' && !mobileDistrict && (
                                            <div className="relative overflow-hidden h-44 w-full cursor-pointer shrink-0" onClick={() => navigate(`/hotels/${item._id || item.id}`)}>
                                                <img src={item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                                    {item.subCategory || 'Standard'}
                                  </span>
                                            </div>
                                        )}

                                        <div className={`p-4 flex-1 flex ${selectedName === 'All Districts' && !mobileDistrict ? 'flex-col justify-between' : 'flex-col sm:flex-row justify-between items-start sm:items-center gap-4'}`}>
                                            <div className={selectedName === 'All Districts' && !mobileDistrict ? '' : 'flex-1'}>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                              <FaMapMarkerAlt size={9} /> {item.location} {item.district ? `(${item.district})` : ''}
                                {!(selectedName === 'All Districts' && !mobileDistrict) && (
                                    <span className="ml-2 bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block uppercase">
                                    {item.subCategory || 'Standard'}
                                  </span>
                                )}
                            </span>

                                                <div className={`flex ${selectedName === 'All Districts' && !mobileDistrict ? 'justify-between items-start mt-1.5 gap-2' : 'items-center mt-1.5 gap-3'}`}>
                                                    <h3 className={`${selectedName === 'All Districts' && !mobileDistrict ? 'text-base' : 'text-lg'} font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'} line-clamp-1 cursor-pointer hover:text-emerald-400 transition-colors`} onClick={() => navigate(`/hotels/${item._id || item.id}`)}>{item.name}</h3>
                                                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 border border-yellow-500/20">
                                                        <FaStar size={10} /> {item.rating || "4.5"}
                                                    </div>
                                                </div>

                                                {selectedName === 'All Districts' && !mobileDistrict && (
                                                    <div className="mt-2.5 space-y-1.5">
                                                        <p className={`text-xs flex items-center gap-1.5 p-2 rounded-lg border ${isDark ? 'bg-[#161922] border-gray-800/40 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                                                            <FaBed className="text-gray-400 text-[11px] shrink-0" />
                                                            <span>Capacity:</span>
                                                            <span className="text-emerald-500 font-medium">{item.capacity || '2'} Guests</span>
                                                        </p>
                                                        <div className="flex justify-between items-center pt-1">
                                                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{sectionTab}</span>
                                                            <p className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>LKR {item.pricePerNight ? Number(item.pricePerNight).toLocaleString() : (item.price ? Number(item.price).toLocaleString() : '0')}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`flex justify-between items-center ${selectedName === 'All Districts' && !mobileDistrict ? 'mt-4 pt-3 border-t' : 'w-full sm:w-auto gap-2 pt-3 sm:pt-0 sm:border-l sm:border-t-0 pl-0 sm:pl-4 sm:ml-4'} ${isDark ? 'border-gray-800/80' : 'border-gray-200'}`}>
                                                {item.contact ? (
                                                    <a
                                                        href={`tel:${item.contact}`}
                                                        className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-600 hover:text-white transition-all"
                                                    >
                                                        <FaPhoneAlt size={10} /> {t.call || 'Call'}
                                                    </a>
                                                ) : (
                                                    <button disabled className={`border px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-not-allowed ${isDark ? 'bg-gray-800/50 text-gray-600 border-gray-700/50' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                                        <FaPhoneAlt size={10} /> {t.call || 'Call'}
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => navigate(`/hotels/${item._id || item.id}`)}
                                                    className="text-xs font-bold text-emerald-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl transition-all"
                                                >
                                                    <FaInfoCircle size={12} /> {t.viewDetails || 'View Details'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Mobile View එකේදී අවසාන හෝටලයට යටින් පෙන්වන Add Button එක */}
                    <div className="mobile-add-hotel-container">
                        <button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all cursor-pointer shadow-lg text-xs">
                            <FaPlusCircle /> {t.add || 'Add'} {sectionTab === 'hotels' ? (t.hotels || 'Hotels') : (t.rooms || 'Rooms')}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HotelsAndRooms;