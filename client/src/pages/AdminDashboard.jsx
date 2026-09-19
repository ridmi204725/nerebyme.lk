import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { API_BASE_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaPlusCircle, FaTimes, FaEdit, FaTrash, FaCheck, FaCheckCircle, FaClock,
    FaSearch, FaSignOutAlt, FaUtensils, FaTree, FaCar, FaFilm, FaLandmark,
    FaTicketAlt, FaTag, FaExclamationTriangle, FaFilter, FaChevronLeft,
    FaChevronRight, FaCheckDouble, FaShieldAlt, FaInfoCircle, FaChartBar,
    FaArrowRight, FaCalendarAlt, FaDatabase, FaUserShield, FaHotel, FaBed, FaWifi, FaSwimmingPool
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
    { district: "Monaragala", cities: ["Badalkumbura", "Bibile", "Buttala", "Kataragama", "Madulla", "Medagama", "Monaragala", "Okampitiya", "Sevanagala", "Siyambalanduwa", "Tanamalwila", "Wellaway"] },
    { district: "Mullaitivu", cities: ["Mallavi", "Maritimepattu", "Mullaitivu", "Oddusuddan", "Puthukudiyiruppu", "Thunukkai", "Welioya"] },
    { district: "Nuwara Eliya", cities: ["Agarapatana", "Ambagamuwa", "Ginigathena", "Hanguranketha", "Hatton", "Kotmale", "Lindula", "Maskeliya", "Nanu Oya", "Nuwara Eliya", "Pundaluoya", "Ragala", "Ramboda", "Talawakele", "Walapane"] },
    { district: "Polonnaruwa", cities: ["Bakamuna", "Dimbulagala", "Giritale", "Hingurakgoda", "Kaduruwela", "Lankapura", "Medirigiriya", "Minneriya", "Polonnaruwa", "Thamankaduwa", "Welikanda"] },
    { district: "Puttalam", cities: ["Anamaduwa", "Arachchikattuwa", "Chilaw", "Dankotuwa", "Kalpitiya", "Karwagaswewa", "Kumarakattuwa", "Madampe", "Mahawewa", "Marawila", "Mundel", "Nattandiya", "Nawagattegama", "Pallama", "Puttalam", "Vanathavilluwa", "Wennappuwa"] },
    { district: "Ratnapura", cities: ["Ayagama", "Balangoda", "Eheliyagoda", "Embilipitiya", "Godakawela", "Imbulpe", "Kahawatta", "Kalawana", "Kiriella", "Kuruwita", "Nivitigala", "Opanayaka", "Pelmadulla", "Rakwana", "Ratnapura", "Weligepola"] },
    { district: "Trincomalee", cities: ["Gomarankadawala", "Kantale", "Kinniya", "Kuchchaveli", "Mutur", "Padavi Sri Pura", "Seruwila", "Thampalakamam", "Trincomalee", "Verugal"] },
    { district: "Vavuniya", cities: ["Cheddikulam", "Nedunkeni", "Vavuniya", "Vengalacheddikulam"] }
];

const SUB_CATEGORIES = {
    'food-hub': [
        "Sri Lankan", "Indian", "Chinese", "Fast Food", "Short Eats",
        "Pizza & Burgers", "Kottu & Rice", "Beverages", "Desserts", "Seafood", "Healthy"
    ],
    'hotels': ["Luxury", "Budget", "Mid-Range", "Resort", "Boutique", "Villa"],
    'rooms': ["Standard Room", "Deluxe Room", "Family Suite", "Luxury Villa", "Budget Room"],
    'dayout': ["Nature & Adventure", "Relax & Chill", "Culture & History", "Fun & Family"],
    'travel': [
        "Adventure", "Beaches", "Hiking", "Historical",
        "Cultural & Heritage", "Wildlife & Safaris", "Tea Country & Hills",
        "Wellness & Ayurveda", "City & Nightlife"
    ],
    'movie-theater': ["Standard", "3D", "IMAX", "4DX"],
    'functions-venue': ["Weddings", "Corporate Events", "Birthdays", "Parties", "Conference Halls"],
    'functions-tickets': ["Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"],
    'offers': ["Seasonal", "Bank Offers", "Flash Sales"]
};

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [allAdminItems, setAllAdminItems] = useState([]);
    const [items, setItems] = useState([]);
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Custom Toast Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3500);
    };

    const [formData, setFormData] = useState({
        name: '', location: '', district: '', subCategory: '', contact: '', image: '', isApproved: true,
        address: '', capacity: '', price: '', ticketPrice: '', seatCapacity: '150', facilities: '', rating: '4.5',
        bookingUrl: '', roomTypes: '', checkInTime: '14:00', checkOutTime: '11:00'
    });

    const [formErrors, setFormErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [availableCities, setAvailableCities] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemToDelete, setItemToDelete] = useState(null);
    const itemsPerPage = 8;

    const categories = [
        { id: 'overview', label: 'Overview', icon: <FaChartBar className="text-teal-400 shrink-0" /> },
        { id: 'food-hub', label: 'Food Hub', icon: <FaUtensils className="text-orange-400 shrink-0" /> },
        { id: 'hotels', label: 'Hotels', icon: <FaHotel className="text-indigo-400 shrink-0" /> },
        { id: 'rooms', label: 'Rooms', icon: <FaBed className="text-pink-400 shrink-0" /> },
        { id: 'dayout', label: 'Dayout', icon: <FaTree className="text-emerald-400 shrink-0" /> },
        { id: 'travel', label: 'Travel', icon: <FaCar className="text-blue-400 shrink-0" /> },
        { id: 'movie-theater', label: 'Movie Theater', icon: <FaFilm className="text-cyan-400 shrink-0" /> },
        { id: 'functions-venue', label: 'Venue Booking', icon: <FaLandmark className="text-teal-400 shrink-0" /> },
        { id: 'functions-tickets', label: 'Event Tickets', icon: <FaTicketAlt className="text-purple-400 shrink-0" /> },
        { id: 'offers', label: 'Offers', icon: <FaTag className="text-rose-400 shrink-0" /> },
        { id: 'pending-sellers', label: 'Pending Sellers', icon: <FaUserShield className="text-amber-400 shrink-0" /> }
    ];

    const modulesList = [
        { id: 'food-hub', name: 'Food Hub', icon: '🍔', reactIcon: <FaUtensils className="text-orange-400 text-xl" />, borderColor: 'border-orange-500/30 hover:border-orange-500/70', glowColor: 'hover:shadow-orange-500/10', textColor: 'text-orange-400' },
        { id: 'hotels', name: 'Hotels', icon: '🏨', reactIcon: <FaHotel className="text-indigo-400 text-xl" />, borderColor: 'border-indigo-500/30 hover:border-indigo-500/70', glowColor: 'hover:shadow-indigo-500/10', textColor: 'text-indigo-400' },
        { id: 'rooms', name: 'Rooms', icon: '🛏️', reactIcon: <FaBed className="text-pink-400 text-xl" />, borderColor: 'border-pink-500/30 hover:border-pink-500/70', glowColor: 'hover:shadow-pink-500/10', textColor: 'text-pink-400' },
        { id: 'dayout', name: 'Dayout', icon: '🏞️', reactIcon: <FaTree className="text-emerald-400 text-xl" />, borderColor: 'border-emerald-500/30 hover:border-emerald-500/70', glowColor: 'hover:shadow-emerald-500/10', textColor: 'text-emerald-400' },
        { id: 'travel', name: 'Travel', icon: '✈️', reactIcon: <FaCar className="text-blue-400 text-xl" />, borderColor: 'border-blue-500/30 hover:border-blue-500/70', glowColor: 'hover:shadow-blue-500/10', textColor: 'text-blue-400' },
        { id: 'movie-theater', name: 'Movie Theater', icon: '🎬', reactIcon: <FaFilm className="text-cyan-400 text-xl" />, borderColor: 'border-cyan-500/30 hover:border-cyan-500/70', glowColor: 'hover:shadow-cyan-500/10', textColor: 'text-cyan-400' },
        { id: 'functions-venue', name: 'Venue Booking', icon: '🏛️', reactIcon: <FaLandmark className="text-teal-400 text-xl" />, borderColor: 'border-teal-500/30 hover:border-teal-500/70', glowColor: 'hover:shadow-teal-500/10', textColor: 'text-teal-400' },
        { id: 'functions-tickets', name: 'Event Tickets', icon: '🎫', reactIcon: <FaTicketAlt className="text-purple-400 text-xl" />, borderColor: 'border-purple-500/30 hover:border-purple-500/70', glowColor: 'hover:shadow-purple-500/10', textColor: 'text-purple-400' },
        { id: 'offers', name: 'Offers', icon: '🏷️', reactIcon: <FaTag className="text-rose-400 text-xl" />, borderColor: 'border-rose-500/30 hover:border-rose-500/70', glowColor: 'hover:shadow-rose-500/10', textColor: 'text-rose-400' }
    ];

    const handleSignOut = () => {
        if (window.confirm("Are you sure you want to sign out of Admin Control Panel?")) {
            if (logout) logout();
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const clearForm = useCallback(() => {
        setFormData({
            name: '', location: '', district: '', subCategory: '', contact: '', image: '', isApproved: true,
            address: '', capacity: '', price: '', ticketPrice: '', seatCapacity: '150', facilities: '', rating: '4.5',
            bookingUrl: '', roomTypes: '', checkInTime: '14:00', checkOutTime: '11:00'
        });
        setFormErrors({});
        setAvailableCities([]);
        setEditingId(null);
    }, []);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const responseAll = await fetch(`${API_BASE_URL}/api/admin/items?category=All&isApproved=all`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const resAllData = await responseAll.json();
            if (resAllData.success && Array.isArray(resAllData.data)) {
                setAllAdminItems(resAllData.data);
            } else {
                setAllAdminItems([]);
            }

            if (activeTab === 'pending-sellers') {
                const res = await fetch(`${API_BASE_URL}/api/admin/pending-sellers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const pendingData = await res.json();
                if (pendingData.success) {
                    setPendingSellers(pendingData.data || []);
                }
            } else if (activeTab !== 'overview') {
                let apiCategory = activeTab;
                if (activeTab === 'functions-venue' || activeTab === 'functions-tickets') {
                    apiCategory = 'functions';
                }

                const response = await fetch(`${API_BASE_URL}/api/admin/items?category=${apiCategory}&isApproved=all`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });

                const resData = await response.json();
                if (resData.success && Array.isArray(resData.data)) {
                    const ticketSubCats = ["Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"];
                    if (activeTab === 'functions-venue') {
                        setItems(resData.data.filter(item => item.functionType === 'venue_booking' || (!item.functionType && !ticketSubCats.includes(item.subCategory))));
                    } else if (activeTab === 'functions-tickets') {
                        setItems(resData.data.filter(item => item.functionType === 'event_tickets' || (!item.functionType && ticketSubCats.includes(item.subCategory))));
                    } else {
                        setItems(resData.data);
                    }
                } else {
                    setItems([]);
                }
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setItems([]);
            setAllAdminItems([]);
        }
        setLoading(false);
        setSelectedIds([]);
        setCurrentPage(1);
    }, [activeTab, API_BASE_URL]);

    const handleApproveSeller = async (userId, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/approve-seller/${userId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`Seller request ${status}!`, 'success');
                fetchItems();
            } else {
                showToast(data.message || "Failed to update seller request.", 'error');
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to update seller request.", 'error');
        }
    };

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const moduleStats = useMemo(() => {
        const ticketSubCats = ["Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"];
        const getCounts = (catId) => {
            let matched = [];
            if (catId === 'functions-venue') {
                matched = allAdminItems.filter(i => i.category === 'functions' && (i.functionType === 'venue_booking' || (!i.functionType && !ticketSubCats.includes(i.subCategory))));
            } else if (catId === 'functions-tickets') {
                matched = allAdminItems.filter(i => i.category === 'functions' && (i.functionType === 'event_tickets' || (!i.functionType && ticketSubCats.includes(i.subCategory))));
            } else if (catId === 'movie-theater') {
                matched = allAdminItems.filter(i => i.category === 'movie-theater' || i.category === 'movie-theaters');
            } else if (catId === 'offers') {
                matched = allAdminItems.filter(i => i.category === 'offers' || i.category === 'offer');
            } else {
                matched = allAdminItems.filter(i => i.category === catId);
            }
            return { total: matched.length, approved: matched.filter(i => i.isApproved).length, pending: matched.length - matched.filter(i => i.isApproved).length };
        };
        return modulesList.map(mod => ({ ...mod, ...getCounts(mod.id) }));
    }, [allAdminItems]);

    const overallStats = useMemo(() => {
        const total = allAdminItems.length;
        const approved = allAdminItems.filter(i => i.isApproved).length;
        return { total, approved, pending: total - approved };
    }, [allAdminItems]);

    const todayFormatted = useMemo(() => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, []);

    const handleDistrictChange = (selectedDistrict) => {
        setFormData(prev => ({ ...prev, district: selectedDistrict, location: '' }));
        if (formErrors.district || formErrors.location) {
            setFormErrors(prev => ({ ...prev, district: '', location: '' }));
        }
        const matched = SRI_LANKA_LOCATIONS.find(l => l.district.toLowerCase() === selectedDistrict.toLowerCase());
        setAvailableCities(matched ? matched.cities : []);
    };

    const validateForm = () => {
        const errors = {};
        const trimmedName = formData.name.trim();

        if (!trimmedName || trimmedName.length < 3) {
            errors.name = "Name / Title must be at least 3 characters.";
        }
        if (!formData.subCategory) errors.subCategory = "Please select a Sub Category.";
        if (!formData.district) errors.district = "Please select a District.";
        if (!formData.location) errors.location = "Please select a City / Town.";

        if (!formData.contact.trim()) {
            errors.contact = "Contact number is required.";
        } else {
            const cleanPhone = formData.contact.replace(/[\s\-\(\)]/g, '');
            // Flexible regex to support both 10-digit numbers and international format (+94)
            if (!/^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|[2-9])|7(0|1|2|4|5|6|7|8)\d)\d{6}$/.test(cleanPhone) && !/^\d{9,12}$/.test(cleanPhone)) {
                errors.contact = "Enter a valid Sri Lankan phone number.";
            }
        }

        if (activeTab === 'hotels') {
            const numPrice = Number(formData.price.toString().replace(/[^0-9]/g, ''));
            if (!formData.price || isNaN(numPrice) || numPrice <= 0) {
                errors.price = "Valid average price per night is required.";
            }
            const numCapacity = Number(formData.capacity);
            if (!formData.capacity || isNaN(numCapacity) || numCapacity <= 0) {
                errors.capacity = "Total rooms count must be greater than 0.";
            }
            if (!formData.address || formData.address.trim().length < 5) {
                errors.address = "Please provide a valid full hotel address.";
            }
        } else if (activeTab === 'rooms') {
            const numPrice = Number(formData.price.toString().replace(/[^0-9]/g, ''));
            if (!formData.price || isNaN(numPrice) || numPrice <= 0) {
                errors.price = "Valid room price per night is required.";
            }
            const numCapacity = Number(formData.capacity);
            if (!formData.capacity || isNaN(numCapacity) || numCapacity <= 0) {
                errors.capacity = "Guest capacity must be specified.";
            }
        } else {
            const numPrice = Number(formData.price.toString().replace(/[^0-9]/g, ''));
            if (!formData.price || isNaN(numPrice) || numPrice <= 0) {
                errors.price = "Price / Estimate must be valid.";
            }
        }

        if (formData.image.trim() !== '') {
            try {
                const url = new URL(formData.image);
                const pattern = /\.(jpeg|jpg|gif|png|webp|svg)(?:\?.*)?$/i;
                const isImageLink = pattern.test(url.pathname) || formData.image.includes('images.unsplash.com');
                if (!isImageLink) {
                    // Valid URL format check passed
                }
            } catch (_) {
                errors.image = "Please enter a valid URL format.";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const url = editingId ? `${API_BASE_URL}/api/admin/items/${editingId}` : `${API_BASE_URL}/api/admin/items`;
        const method = editingId ? 'PUT' : 'POST';

        let submissionCategory = activeTab;
        if (activeTab === 'functions-venue' || activeTab === 'functions-tickets') {
            submissionCategory = 'functions';
        }

        let itemPayload = {
            name: formData.name.trim(),
            title: formData.name.trim(),
            location: formData.location,
            district: formData.district,
            subCategory: formData.subCategory,
            contact: formData.contact.trim(),
            image: formData.image || '',
            category: submissionCategory,
            isApproved: editingId ? Boolean(formData.isApproved) : true
        };

        if (activeTab === 'hotels') {
            itemPayload.address = formData.address;
            itemPayload.capacity = Number(formData.capacity) || 0;
            itemPayload.price = formData.price || '0';
            itemPayload.rating = formData.rating || '4.5';
            itemPayload.facilities = formData.facilities;
            itemPayload.roomTypes = formData.roomTypes;
            itemPayload.checkInTime = formData.checkInTime;
            itemPayload.checkOutTime = formData.checkOutTime;
        } else if (activeTab === 'rooms') {
            itemPayload.address = formData.address;
            itemPayload.capacity = Number(formData.capacity) || 2;
            itemPayload.price = formData.price || '0';
            itemPayload.rating = formData.rating || '4.5';
            itemPayload.facilities = formData.facilities;
            itemPayload.checkInTime = formData.checkInTime;
            itemPayload.checkOutTime = formData.checkOutTime;
        } else if (activeTab === 'functions-venue') {
            itemPayload.address = formData.address;
            itemPayload.capacity = Number(formData.capacity) || 0;
            itemPayload.price = formData.price || '0';
            itemPayload.functionType = 'venue_booking';
        } else if (activeTab === 'functions-tickets') {
            itemPayload.address = formData.address;
            itemPayload.capacity = Number(formData.capacity) || 0;
            itemPayload.price = formData.price || '0';
            itemPayload.ticketPrice = formData.price || '0';
            itemPayload.functionType = 'event_tickets';
            itemPayload.bookingUrl = formData.bookingUrl || '';
        } else if (activeTab === 'movie-theater') {
            itemPayload.ticketPrice = formData.ticketPrice || '0';
            itemPayload.price = formData.ticketPrice || '0';
            itemPayload.seatCapacity = formData.seatCapacity || '150';
            itemPayload.rating = formData.rating || '4.5';
            itemPayload.facilities = formData.facilities;
        } else {
            itemPayload.price = formData.price || '0';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(itemPayload)
            });

            const resData = await response.json();
            if (response.ok || resData.success) {
                showToast(resData.message || "Operation successful!", 'success');
                clearForm();
                fetchItems();
            } else {
                showToast(resData.message || "Error: Failed to process request", 'error');
            }
        } catch (err) {
            showToast("Transaction failed", 'error');
            console.error(err);
        }
    };

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ isApproved: true })
            });
            const resData = await response.json();
            if (resData.success) {
                showToast("Item approved successfully!", 'success');
                fetchItems();
            } else {
                showToast(resData.message || "Failed to approve item.", 'error');
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to approve item.", 'error');
        }
    };

    const executeDelete = async () => {
        if (!itemToDelete) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/items/${itemToDelete._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const resData = await response.json();
            if (resData.success) {
                showToast("Item deleted successfully!", 'success');
                setItemToDelete(null);
                fetchItems();
            } else {
                showToast(resData.message || "Failed to delete item.", 'error');
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to delete item.", 'error');
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item._id);
        setFormErrors({});

        if (item.district) {
            const matched = SRI_LANKA_LOCATIONS.find(l => l.district.trim().toLowerCase() === item.district.trim().toLowerCase());
            setAvailableCities(matched ? matched.cities : []);
        } else {
            setAvailableCities([]);
        }

        const rawFacilities = Array.isArray(item.facilities) ? item.facilities.join(', ') : item.facilities || '';
        const rawRoomTypes = Array.isArray(item.roomTypes) ? item.roomTypes.join(', ') : item.roomTypes || '';

        if (item.category === 'functions') {
            const ticketSubCats = ["Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"];
            if (item.functionType === 'event_tickets' || (!item.functionType && ticketSubCats.includes(item.subCategory))) {
                setActiveTab('functions-tickets');
            } else {
                setActiveTab('functions-venue');
            }
        } else {
            setActiveTab(item.category);
        }

        setFormData({
            name: item.name || '',
            location: item.location || '',
            district: item.district || '',
            subCategory: item.subCategory || '',
            contact: item.contact || '',
            image: item.image || '',
            isApproved: item.isApproved !== undefined ? item.isApproved : true,
            address: item.address || '',
            capacity: item.capacity || '',
            price: item.price || '',
            ticketPrice: item.ticketPrice || item.price || '',
            seatCapacity: item.seatCapacity || '150',
            facilities: rawFacilities,
            rating: item.rating || '4.5',
            bookingUrl: item.bookingUrl || '',
            roomTypes: rawRoomTypes,
            checkInTime: item.checkInTime || '14:00',
            checkOutTime: item.checkOutTime || '11:00'
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(paginatedItems.map(i => i._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/items/bulk-approve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ ids: selectedIds })
            });
            const data = await response.json();
            if (data.success) {
                showToast(data.message || "Selected items approved!", 'success');
                setSelectedIds([]);
                fetchItems();
            } else {
                showToast(data.message || "Failed to approve selected items.", 'error');
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to approve selected items.", 'error');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected items?`)) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/items/bulk-delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ ids: selectedIds })
            });
            const data = await response.json();
            if (data.success) {
                showToast(data.message || "Selected items deleted!", 'success');
                setSelectedIds([]);
                fetchItems();
            } else {
                showToast(data.message || "Failed to delete selected items.", 'error');
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to delete selected items.", 'error');
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            if (statusFilter === 'approved' && !item.isApproved) return false;
            if (statusFilter === 'pending' && item.isApproved) return false;

            if (searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase();
                return item.name?.toLowerCase().includes(q) ||
                    item.location?.toLowerCase().includes(q) ||
                    item.district?.toLowerCase().includes(q) ||
                    item.subCategory?.toLowerCase().includes(q);
            }
            return true;
        });
    }, [items, statusFilter, searchQuery]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    return (
        <div className="p-4 md:p-8 w-full font-poppins min-h-screen bg-slate-950 text-slate-100 relative">
            {/* Custom Toast Notification Element */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold ${
                        toast.type === 'error'
                            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                            : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                    }`}>
                        {toast.type === 'error' ? <FaExclamationTriangle className="text-rose-400 text-base" /> : <FaCheckCircle className="text-emerald-400 text-base" />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[#1a2332] border border-[#2a3548] p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-xl">
                        <FaShieldAlt className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Admin Control Panel</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Manage system listings, hotels, rooms approvals, and records</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                        <FaSignOutAlt className="text-base" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-[#1a2332] border border-[#2a3548] p-3 rounded-2xl shadow-lg">
                <div className="flex flex-wrap gap-2 overflow-x-auto">
                    {categories.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); clearForm(); setSearchQuery(''); }}
                            className={`px-4 py-2.5 rounded-xl font-bold transition-all text-xs md:text-sm flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-extrabold'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/edit-place')}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                    <FaEdit className="text-base" />
                    <span>Edit Place Details</span>
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a2332] border border-[#2a3548] p-6 rounded-2xl shadow-lg">
                        <div>
                            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5">
                                <FaChartBar className="text-teal-400" />
                                <span>Dashboard Overview</span>
                            </h2>
                            <p className="text-xs text-[#94a3b8] mt-1 font-medium">Quick summary of all platform activity</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-teal-300 font-semibold">
                            <FaCalendarAlt className="text-teal-400" />
                            <span>{todayFormatted}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#1a2332] border border-[#2a3548] border-l-4 border-l-teal-400 p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-teal-500/15 text-teal-400 rounded-xl"><FaDatabase className="text-xl" /></div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">{overallStats.total}</h3>
                            <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Total Records</p>
                        </div>
                        <div className="bg-[#1a2332] border border-[#2a3548] border-l-4 border-l-emerald-500 p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-xl"><FaCheckCircle className="text-xl" /></div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">{overallStats.approved}</h3>
                            <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Approved Records</p>
                        </div>
                        <div className="bg-[#1a2332] border border-[#2a3548] border-l-4 border-l-amber-500 p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl"><FaClock className="text-xl" /></div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">{overallStats.pending}</h3>
                            <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Pending Records</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-extrabold text-white">Platform Modules Breakdown</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {moduleStats.map(mod => (
                                <div key={mod.id} className={`bg-[#1a2332] border ${mod.borderColor} p-5 rounded-2xl shadow-lg transition-all flex flex-col justify-between group`}>
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-2xl">{mod.icon}</div>
                                            <span className={`text-2xl font-extrabold text-white group-hover:${mod.textColor}`}>{mod.total}</span>
                                        </div>
                                        <h4 className="text-base font-bold text-white mb-2">{mod.name}</h4>
                                        <div className="flex items-center gap-2 text-xs mb-6">
                                            <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-400">App: {mod.approved}</span>
                                            <span className="px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-400">Pen: {mod.pending}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setActiveTab(mod.id); clearForm(); setSearchQuery(''); }}
                                        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>View All</span>
                                        <FaArrowRight className="text-xs" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'pending-sellers' && (
                <div className="bg-[#161922] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl mt-6">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#11131a]/50">
                        <h3 className="text-lg font-bold text-white flex items-center gap-3">
                            <FaUserShield className="text-amber-500" /> Pending Seller Requests
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-[#0d0f15] text-gray-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">Name & Email</th>
                                <th className="px-6 py-4">Business Name</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                            {pendingSellers.map((seller) => (
                                <tr key={seller._id} className="hover:bg-gray-800/20">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-200">{seller.fullName}</div>
                                        <div className="text-xs text-gray-500">{seller.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{seller.businessName || 'N/A'}</td>
                                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                                        <button onClick={() => handleApproveSeller(seller._id, 'approved')} className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white">Approve</button>
                                        <button onClick={() => handleApproveSeller(seller._id, 'rejected')} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white">Reject</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'pending-sellers' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-200">
                    <div className="lg:col-span-1 bg-[#1a2332] border border-[#2a3548] p-6 rounded-2xl shadow-xl h-fit">
                        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-teal-300 flex items-center gap-2">
                                {editingId ? <FaEdit className="text-amber-400" /> : <FaPlusCircle className="text-teal-400" />}
                                <span>{editingId ? 'Update Record' : 'Add New Record'}</span>
                            </h2>
                            {editingId && (
                                <button onClick={clearForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                                    <FaTimes /> Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3.5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">📝 Basic Details</p>
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">NAME / TITLE <span className="text-rose-400">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Cinnamon Grand"
                                        value={formData.name}
                                        onChange={e => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: '' }); }}
                                        className={`w-full bg-slate-950 border ${formErrors.name ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                                    />
                                    {formErrors.name && <p className="text-[11px] text-rose-400 mt-1">{formErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">SUB CATEGORY <span className="text-rose-400">*</span></label>
                                    <select
                                        value={formData.subCategory}
                                        onChange={e => { setFormData({ ...formData, subCategory: e.target.value }); if (formErrors.subCategory) setFormErrors({ ...formErrors, subCategory: '' }); }}
                                        className={`w-full bg-slate-950 border ${formErrors.subCategory ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white cursor-pointer`}
                                    >
                                        <option value="">Select Sub Category</option>
                                        {(SUB_CATEGORIES[activeTab] || []).map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3.5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">📍 Location Information</p>
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">DISTRICT <span className="text-rose-400">*</span></label>
                                    <select
                                        value={formData.district}
                                        onChange={e => handleDistrictChange(e.target.value)}
                                        className={`w-full bg-slate-950 border ${formErrors.district ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white cursor-pointer`}
                                    >
                                        <option value="">Select District</option>
                                        {SRI_LANKA_LOCATIONS.map(l => (
                                            <option key={l.district} value={l.district}>{l.district}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">CITY / TOWN <span className="text-rose-400">*</span></label>
                                    <select
                                        disabled={availableCities.length === 0}
                                        value={formData.location}
                                        onChange={e => { setFormData({ ...formData, location: e.target.value }); if (formErrors.location) setFormErrors({ ...formErrors, location: '' }); }}
                                        className={`w-full bg-slate-950 border ${formErrors.location ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white disabled:opacity-40 cursor-pointer`}
                                    >
                                        <option value="">Select City</option>
                                        {availableCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {activeTab === 'hotels' && (
                                <div className="p-4 bg-indigo-950/20 rounded-xl border border-indigo-500/30 space-y-3.5">
                                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5"><FaHotel /> Hotel Specific Details</p>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block mb-1">HOTEL FULL ADDRESS <span className="text-rose-400">*</span></label>
                                        <input type="text" placeholder="e.g. 77 Galle Road, Colombo 03" value={formData.address} onChange={e => { setFormData({ ...formData, address: e.target.value }); if (formErrors.address) setFormErrors({ ...formErrors, address: '' }); }} className={`w-full bg-slate-950 border ${formErrors.address ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`} />
                                        {formErrors.address && <p className="text-[11px] text-rose-400 mt-1">{formErrors.address}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">TOTAL ROOMS <span className="text-rose-400">*</span></label>
                                            <input type="number" placeholder="45" value={formData.capacity} onChange={e => { setFormData({ ...formData, capacity: e.target.value }); if (formErrors.capacity) setFormErrors({ ...formErrors, capacity: '' }); }} className={`w-full bg-slate-950 border ${formErrors.capacity ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">AVG PRICE/NIGHT (LKR) <span className="text-rose-400">*</span></label>
                                            <input type="text" placeholder="18500" value={formData.price} onChange={e => { setFormData({ ...formData, price: e.target.value }); if (formErrors.price) setFormErrors({ ...formErrors, price: '' }); }} className={`w-full bg-slate-950 border ${formErrors.price ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`} />
                                        </div>
                                    </div>
                                    {formErrors.capacity && <p className="text-[11px] text-rose-400">{formErrors.capacity}</p>}
                                    {formErrors.price && <p className="text-[11px] text-rose-400">{formErrors.price}</p>}

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">RATING (0 - 5.0)</label>
                                            <input type="number" step="0.1" max="5" min="0" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">ROOM TYPES</label>
                                            <input type="text" placeholder="Deluxe, Suite, Standard" value={formData.roomTypes} onChange={e => setFormData({ ...formData, roomTypes: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">CHECK-IN TIME</label>
                                            <input type="text" placeholder="14:00" value={formData.checkInTime} onChange={e => setFormData({ ...formData, checkInTime: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">CHECK-OUT TIME</label>
                                            <input type="text" placeholder="11:00" value={formData.checkOutTime} onChange={e => setFormData({ ...formData, checkOutTime: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block mb-1">FACILITIES (Comma separated)</label>
                                        <input type="text" placeholder="WiFi, Swimming Pool, Spa, AC, Parking" value={formData.facilities} onChange={e => setFormData({ ...formData, facilities: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'rooms' && (
                                <div className="p-4 bg-pink-950/20 rounded-xl border border-pink-500/30 space-y-3.5">
                                    <p className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5"><FaBed /> Room Specific Details</p>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block mb-1">ROOM ADDRESS / HOTEL NAME</label>
                                        <input type="text" placeholder="e.g. Deluxe Room at Grand Hotel" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">GUEST CAPACITY <span className="text-rose-400">*</span></label>
                                            <input type="number" placeholder="2" value={formData.capacity} onChange={e => { setFormData({ ...formData, capacity: e.target.value }); if (formErrors.capacity) setFormErrors({ ...formErrors, capacity: '' }); }} className={`w-full bg-slate-950 border ${formErrors.capacity ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">PRICE / NIGHT (LKR) <span className="text-rose-400">*</span></label>
                                            <input type="text" placeholder="8500" value={formData.price} onChange={e => { setFormData({ ...formData, price: e.target.value }); if (formErrors.price) setFormErrors({ ...formErrors, price: '' }); }} className={`w-full bg-slate-950 border ${formErrors.price ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`} />
                                        </div>
                                    </div>
                                    {formErrors.capacity && <p className="text-[11px] text-rose-400">{formErrors.capacity}</p>}
                                    {formErrors.price && <p className="text-[11px] text-rose-400">{formErrors.price}</p>}

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">RATING (0 - 5.0)</label>
                                            <input type="number" step="0.1" max="5" min="0" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-300 block mb-1">CHECK-IN TIME</label>
                                            <input type="text" placeholder="14:00" value={formData.checkInTime} onChange={e => setFormData({ ...formData, checkInTime: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block mb-1">ROOM AMENITIES / FACILITIES</label>
                                        <input type="text" placeholder="AC, Hot Water, Free WiFi, TV, Balcony" value={formData.facilities} onChange={e => setFormData({ ...formData, facilities: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none" />
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'hotels' && activeTab !== 'rooms' && activeTab !== 'functions-venue' && activeTab !== 'functions-tickets' && activeTab !== 'movie-theater' && (
                                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">PRICE / ESTIMATE (LKR) <span className="text-rose-400">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2500"
                                        value={formData.price}
                                        onChange={e => { setFormData({ ...formData, price: e.target.value }); if (formErrors.price) setFormErrors({ ...formErrors, price: '' }); }}
                                        className={`w-full bg-slate-950 border ${formErrors.price ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                                    />
                                    {formErrors.price && <p className="text-[11px] text-rose-400">{formErrors.price}</p>}
                                </div>
                            )}

                            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3.5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">📞 Contact & Media</p>
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">CONTACT NUMBER <span className="text-rose-400">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="0777331483"
                                        value={formData.contact}
                                        onChange={e => { setFormData({ ...formData, contact: e.target.value }); if (formErrors.contact) setFormErrors({ ...formErrors, contact: '' }); }}
                                        className={`w-full bg-slate-950 border ${formErrors.contact ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                                    />
                                    {formErrors.contact && <p className="text-[11px] text-rose-400 mt-1">{formErrors.contact}</p>}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-semibold text-slate-300 block">IMAGE URL</label>
                                        {formErrors.image && <span className="text-[11px] text-rose-400">{formErrors.image}</span>}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        value={formData.image}
                                        onChange={e => { setFormData({ ...formData, image: e.target.value }); if (formErrors.image) setFormErrors({ ...formErrors, image: '' }); }}
                                        className={`w-full bg-slate-950 border ${formErrors.image ? 'border-rose-500' : 'border-slate-700'} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                                    />

                                    {formData.image.trim() !== '' && (
                                        <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-12 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100'; }}
                                            />
                                            <div className="overflow-hidden">
                                                <p className="text-[11px] font-semibold text-slate-300 truncate">Image Preview</p>
                                                <p className="text-[10px] text-slate-500 truncate">{formData.image}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer"
                            >
                                {editingId ? 'Update Record' : 'Save Record'}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-3 bg-[#1a2332] border border-[#2a3548] p-6 rounded-2xl shadow-xl">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                            <div>
                                <h2 className="text-xl font-extrabold text-teal-300 capitalize flex items-center gap-2">
                                    <span>{categories.find(c => c.id === activeTab)?.label} Records</span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">{filteredItems.length} items</span>
                                </h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative min-w-[200px] flex-grow sm:flex-grow-0">
                                    <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
                                    <input
                                        type="text"
                                        placeholder="Search records..."
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                        className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 cursor-pointer"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="approved">Approved Only</option>
                                        <option value="pending">Pending Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {selectedIds.length > 0 && (
                            <div className="mb-4 p-3 bg-teal-950/40 border border-teal-500/40 rounded-xl flex items-center justify-between gap-3 text-xs">
                                <span className="font-semibold text-teal-300 flex items-center gap-2"><FaCheckDouble /> {selectedIds.length} item(s) selected</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleBulkApprove} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold">Approve Selected</button>
                                    <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold">Delete Selected</button>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="p-12 text-center text-slate-400 animate-pulse font-medium">Loading records...</div>
                        ) : paginatedItems.length === 0 ? (
                            <div className="p-12 text-center bg-slate-950/50 rounded-xl border border-slate-800/80 my-4">
                                <FaInfoCircle className="mx-auto text-3xl text-slate-600 mb-2" />
                                <p className="text-slate-300 font-semibold">No records found matching your filters.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-slate-800">
                                <table className="w-full text-left text-xs text-slate-200">
                                    <thead className="bg-slate-950 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="p-3 w-8 text-center"><input type="checkbox" onChange={handleSelectAll} checked={paginatedItems.length > 0 && paginatedItems.every(i => selectedIds.includes(i._id))} /></th>
                                        <th className="p-3">Item Details</th>
                                        <th className="p-3">Sub Category</th>
                                        <th className="p-3">Location</th>

                                        {activeTab === 'hotels' && (
                                            <>
                                                <th className="p-3">Rooms Count</th>
                                                <th className="p-3">Room Types</th>
                                                <th className="p-3">Price / Night</th>
                                                <th className="p-3">Rating</th>
                                            </>
                                        )}

                                        {activeTab === 'rooms' && (
                                            <>
                                                <th className="p-3">Capacity</th>
                                                <th className="p-3">Price / Night</th>
                                                <th className="p-3">Rating</th>
                                            </>
                                        )}

                                        {activeTab !== 'hotels' && activeTab !== 'rooms' && <th className="p-3">Price / Estimate</th>}

                                        <th className="p-3">Contact</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/80">
                                    {paginatedItems.map(item => {
                                        const isSelected = selectedIds.includes(item._id);
                                        const formattedPrice = item.price && item.price !== '0' ? `Rs. ${Number(item.price).toLocaleString()}` : 'Rs. 0';

                                        return (
                                            <tr key={item._id} className={`transition-colors odd:bg-slate-900/60 even:bg-slate-800/30 hover:bg-teal-950/20 ${isSelected ? 'bg-teal-950/40' : ''}`}>
                                                <td className="p-3 text-center"><input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(item._id)} /></td>
                                                <td className="p-3 flex items-center gap-3">
                                                    <img src={item.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100'} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-700" />
                                                    <div>
                                                        <p className="font-bold text-white max-w-[160px] truncate">{item.name}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase">{item.category}</p>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20">{item.subCategory || 'Standard'}</span>
                                                </td>
                                                <td className="p-3 font-medium max-w-[130px] truncate text-slate-300">{item.location}, {item.district}</td>

                                                {activeTab === 'hotels' && (
                                                    <>
                                                        <td className="p-3 text-amber-400 font-semibold">{item.capacity || 0} Rooms</td>
                                                        <td className="p-3 text-slate-300 max-w-[120px] truncate">{Array.isArray(item.roomTypes) ? item.roomTypes.join(', ') : (item.roomTypes || 'N/A')}</td>
                                                        <td className="p-3 text-emerald-400 font-semibold">{formattedPrice}</td>
                                                        <td className="p-3 text-yellow-400 font-bold">{item.rating || '4.5'} ⭐</td>
                                                    </>
                                                )}

                                                {activeTab === 'rooms' && (
                                                    <>
                                                        <td className="p-3 text-pink-400 font-semibold">{item.capacity || 2} Guests</td>
                                                        <td className="p-3 text-emerald-400 font-semibold">{formattedPrice}</td>
                                                        <td className="p-3 text-yellow-400 font-bold">{item.rating || '4.5'} ⭐</td>
                                                    </>
                                                )}

                                                {activeTab !== 'hotels' && activeTab !== 'rooms' && <td className="p-3 text-emerald-400 font-semibold">{formattedPrice}</td>}

                                                <td className="p-3 text-slate-300 font-mono text-[11px]">{item.contact}</td>
                                                <td className="p-3">
                                                    {item.isApproved ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><FaCheckCircle size={11} /> Approved</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30"><FaClock size={11} /> Pending</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className="flex justify-center items-center gap-1.5">
                                                        {!item.isApproved && (
                                                            <button onClick={() => handleApprove(item._id)} className="p-2 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 rounded-lg"><FaCheck size={11} /></button>
                                                        )}
                                                        <button onClick={() => handleEditClick(item)} className="p-2 bg-blue-600/30 hover:bg-blue-600 text-blue-300 rounded-lg"><FaEdit size={11} /></button>
                                                        <button onClick={() => setItemToDelete(item)} className="p-2 bg-rose-600/30 hover:bg-rose-600 text-rose-300 rounded-lg"><FaTrash size={11} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-800 text-xs">
                                <span className="text-slate-400">Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong></span>
                                <div className="flex items-center gap-2">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-3 py-1.5 bg-slate-800 disabled:opacity-40 text-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"><FaChevronLeft size={10} /> Prev</button>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-3 py-1.5 bg-slate-800 disabled:opacity-40 text-slate-200 rounded-lg flex items-center gap-1 cursor-pointer">Next <FaChevronRight size={10} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {itemToDelete && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center gap-3 text-rose-400 mb-3">
                            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20"><FaExclamationTriangle size={20} /></div>
                            <h3 className="text-lg font-bold text-white">Delete Record</h3>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-6">Are you sure you want to permanently delete <strong className="text-rose-300">"{itemToDelete.name}"</strong>?</p>
                        <div className="flex justify-end items-center gap-3">
                            <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl cursor-pointer">Cancel</button>
                            <button onClick={executeDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;