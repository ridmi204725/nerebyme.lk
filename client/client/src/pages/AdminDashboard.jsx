import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChartBar, FaUtensils, FaTree, FaPlane, FaFilm, FaBuilding, FaTicketAlt, FaTag,
  FaCheckCircle, FaClock, FaLayerGroup, FaPlusCircle, FaTimes, FaEdit, FaTrash, FaCheck,
  FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaSync,
  FaInfoCircle, FaShieldAlt, FaExternalLinkAlt, FaUserShield, FaArrowRight, FaCalendarAlt,
  FaSignOutAlt
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
  'food-hub': ["Sri Lankan", "Indian", "Chinese", "Fast Food"],
  'dayout': ["Nature & Adventure", "Relax & Chill", "Culture & History", "Fun & Family"],
  'travel': ["Adventure", "Beaches", "Hiking", "Historical"],
  'movie-theater': ["Standard", "3D", "IMAX", "4DX"],
  'functions-venue': ["Weddings", "Corporate Events", "Birthdays", "Parties", "Conference Halls"],
  'functions-tickets': ["Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"],
  'offers': ["Seasonal", "Bank Offers", "Flash Sales"]
};

const MODULE_META = {
  'food-hub': {
    name: 'Food Hub',
    icon: FaUtensils,
    gradient: 'from-orange-500 to-amber-500',
    accentColor: '#f97316',
    borderHover: 'hover:border-orange-500/60',
    glowShadow: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.2)]'
  },
  'dayout': {
    name: 'Dayout Packages',
    icon: FaTree,
    gradient: 'from-emerald-500 to-teal-500',
    accentColor: '#10b981',
    borderHover: 'hover:border-emerald-500/60',
    glowShadow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]'
  },
  'travel': {
    name: 'Travel & Tours',
    icon: FaPlane,
    gradient: 'from-sky-500 to-blue-500',
    accentColor: '#0284c7',
    borderHover: 'hover:border-sky-500/60',
    glowShadow: 'hover:shadow-[0_0_25px_rgba(2,132,199,0.2)]'
  },
  'movie-theater': {
    name: 'Movie Theaters',
    icon: FaFilm,
    gradient: 'from-cyan-500 to-teal-400',
    accentColor: '#06b6d4',
    borderHover: 'hover:border-cyan-500/60',
    glowShadow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]'
  },
  'functions-venue': {
    name: 'Venue Bookings',
    icon: FaBuilding,
    gradient: 'from-indigo-500 to-purple-500',
    accentColor: '#6366f1',
    borderHover: 'hover:border-indigo-500/60',
    glowShadow: 'hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]'
  },
  'functions-tickets': {
    name: 'Event Tickets',
    icon: FaTicketAlt,
    gradient: 'from-purple-500 to-pink-500',
    accentColor: '#a855f7',
    borderHover: 'hover:border-purple-500/60',
    glowShadow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]'
  },
  'offers': {
    name: 'Promotional Offers',
    icon: FaTag,
    gradient: 'from-pink-500 to-rose-500',
    accentColor: '#ec4899',
    borderHover: 'hover:border-pink-500/60',
    glowShadow: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]'
  }
};

const ITEMS_PER_PAGE = 10;
const INVALID_NAMES = ['abc', 'qr', 'hello', 'earp', 'test', 'xyz', 'temp'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', location: '', district: '', subCategory: '', contact: '', image: '', isApproved: true,
    address: '', capacity: '', price: '', ticketPrice: '', seatCapacity: '150', facilities: '', rating: '4.5',
    bookingUrl: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [availableCities, setAvailableCities] = useState([]);

  // Table Tools (Search, Filter, Pagination, Selection)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // Delete Guard Modal State
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const categories = [
    { id: 'overview', label: 'Dashboard Overview', icon: FaChartBar },
    { id: 'food-hub', label: 'Food Hub', icon: FaUtensils },
    { id: 'dayout', label: 'Dayout', icon: FaTree },
    { id: 'travel', label: 'Travel', icon: FaPlane },
    { id: 'movie-theater', label: 'Movie Theater', icon: FaFilm },
    { id: 'functions-venue', label: 'Venue Booking', icon: FaBuilding },
    { id: 'functions-tickets', label: 'Event Tickets', icon: FaTicketAlt },
    { id: 'offers', label: 'Offers', icon: FaTag }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const clearForm = useCallback(() => {
    setFormData({
      name: '', location: '', district: '', subCategory: '', contact: '', image: '', isApproved: true,
      address: '', capacity: '', price: '', ticketPrice: '', seatCapacity: '150', facilities: '', rating: '4.5',
      bookingUrl: ''
    });
    setFormErrors({});
    setAvailableCities([]);
    setEditingId(null);
  }, []);

  // Fetch items for Overview stats and Tab list
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all items for overview stats
      const allRes = await fetch(`http://localhost:5001/api/admin/items?category=All&isApproved=all`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const allData = await allRes.json();

      let fetchedList = [];
      if (allData.success && Array.isArray(allData.data)) {
        fetchedList = allData.data;
        setAllItems(fetchedList);
      } else {
        setAllItems([]);
      }

      // Filter items for current active tab
      if (activeTab === 'overview') {
        setItems(fetchedList);
      } else {
        let categoryKey = activeTab;
        if (activeTab === 'functions-venue' || activeTab === 'functions-tickets') {
          categoryKey = 'functions';
        }
        
        const categoryItems = fetchedList.filter(item => item.category === categoryKey);
        const ticketSubCategories = SUB_CATEGORIES['functions-tickets'] || [];

        if (activeTab === 'functions-venue') {
          setItems(categoryItems.filter(item => item.functionType === 'venue_booking' || (!item.functionType && !ticketSubCategories.includes(item.subCategory))));
        } else if (activeTab === 'functions-tickets') {
          setItems(categoryItems.filter(item => item.functionType === 'event_tickets' || (!item.functionType && ticketSubCategories.includes(item.subCategory))));
        } else {
          setItems(categoryItems);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setAllItems([]);
      setItems([]);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    fetchAllData();
    setCurrentPage(1);
    setSelectedIds([]);
  }, [fetchAllData, activeTab]);

  // Compute overview breakdown statistics
  const overviewStats = useMemo(() => {
    const total = allItems.length;
    const approved = allItems.filter(item => item.isApproved).length;
    const pending = allItems.filter(item => !item.isApproved).length;

    // Per module counts
    const moduleCounts = {};
    Object.keys(MODULE_META).forEach(key => {
      let filtered = [];
      if (key === 'functions-venue' || key === 'functions-tickets') {
        const ticketSubCategories = SUB_CATEGORIES['functions-tickets'] || [];
        const funcItems = allItems.filter(item => item.category === 'functions');
        if (key === 'functions-venue') {
          filtered = funcItems.filter(item => item.functionType === 'venue_booking' || (!item.functionType && !ticketSubCategories.includes(item.subCategory)));
        } else {
          filtered = funcItems.filter(item => item.functionType === 'event_tickets' || (!item.functionType && ticketSubCategories.includes(item.subCategory)));
        }
      } else {
        filtered = allItems.filter(item => item.category === key);
      }

      moduleCounts[key] = {
        total: filtered.length,
        approved: filtered.filter(i => i.isApproved).length,
        pending: filtered.filter(i => !i.isApproved).length
      };
    });

    const pendingModulesCount = Object.values(moduleCounts).filter(m => m.pending > 0).length;

    return { total, approved, pending, moduleCounts, pendingModulesCount };
  }, [allItems]);

  // Form Validation Logic
  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();

    if (!trimmedName || trimmedName.length < 3) {
      errors.name = "Name/Title must be at least 3 characters long.";
    } else if (INVALID_NAMES.includes(trimmedName.toLowerCase())) {
      errors.name = `"${trimmedName}" is too generic. Please provide a valid, descriptive name.`;
    }

    if (!formData.district) {
      errors.district = "District is required.";
    }

    if (!formData.location) {
      errors.location = "City/Town is required.";
    }

    if (!formData.subCategory) {
      errors.subCategory = "Sub Category is required.";
    }

    if (!formData.contact) {
      errors.contact = "Contact number is required.";
    } else {
      const cleanContact = formData.contact.replace(/[^0-9+]/g, '');
      if (cleanContact.length < 9 || cleanContact.length > 12) {
        errors.contact = "Enter a valid phone number (e.g., 0771234567).";
      }
    }

    if (activeTab === 'functions-venue' && !formData.address) {
      errors.address = "Venue address is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDistrictChange = (selectedDistrict) => {
    setFormData(prev => ({ ...prev, district: selectedDistrict, location: '' }));
    const matched = SRI_LANKA_LOCATIONS.find(l => l.district.toLowerCase() === selectedDistrict.toLowerCase());
    setAvailableCities(matched ? matched.cities : []);
    if (formErrors.district) setFormErrors(prev => ({ ...prev, district: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = editingId
      ? `http://localhost:5001/api/admin/items/${editingId}`
      : `http://localhost:5001/api/admin/items`;

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
      isApproved: editingId ? formData.isApproved : true
    };

    if (activeTab === 'functions-venue') {
      itemPayload.address = formData.address;
      itemPayload.capacity = Number(formData.capacity) || 0;
      itemPayload.price = formData.price || '0';
      itemPayload.priceType = 'hall_rent';
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
        alert(resData.message || "Operation successful!");
        clearForm();
        fetchAllData();
      } else {
        alert(resData.message || `Error: Failed to process request (${response.status})`);
      }
    } catch (err) {
      alert("Transaction failed");
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isApproved: true })
      });
      const resData = await response.json();
      if (resData.success) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModalItem) return;
    try {
      const response = await fetch(`http://localhost:5001/api/admin/items/${deleteModalItem._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setDeleteModalItem(null);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk Actions
  const handleSelectAll = (e, pageItems) => {
    if (e.target.checked) {
      const pageIds = pageItems.map(i => i._id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = new Set(pageItems.map(i => i._id));
      setSelectedIds(prev => prev.filter(id => !pageIds.has(id)));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map(id => 
        fetch(`http://localhost:5001/api/admin/items/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ isApproved: true })
        })
      ));
      setSelectedIds([]);
      fetchAllData();
    } catch (err) {
      console.error("Bulk Approve Error:", err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected items?`)) return;
    try {
      await Promise.all(selectedIds.map(id =>
        fetch(`http://localhost:5001/api/admin/items/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ));
      setSelectedIds([]);
      fetchAllData();
    } catch (err) {
      console.error("Bulk Delete Error:", err);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);

    if (item.district) {
      const matched = SRI_LANKA_LOCATIONS.find(
        l => l.district.trim().toLowerCase() === item.district.trim().toLowerCase()
      );
      setAvailableCities(matched ? matched.cities : []);
    } else {
      setAvailableCities([]);
    }

    const rawFacilities = Array.isArray(item.facilities)
      ? item.facilities.join(', ')
      : item.facilities || '';

    if (item.category === 'functions') {
      if (item.functionType === 'event_tickets') {
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
      bookingUrl: item.bookingUrl || ''
    });
  };

  // Filtered & Paginated items for current tab table view
  const filteredTableItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        !searchTerm.trim() ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.district && item.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'approved' && item.isApproved) ||
        (statusFilter === 'pending' && !item.isApproved);

      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredTableItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTableItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTableItems, currentPage]);

  const formatPriceDisplay = (val) => {
    if (!val || val === '0' || Number(val) === 0) return 'Free / Contact';
    const num = Number(val);
    return isNaN(num) ? val : `LKR ${num.toLocaleString()}`;
  };

  return (
    <div className="p-4 md:p-8 w-full font-poppins min-h-screen bg-[#0f172a] text-slate-100 transition-colors duration-200">
      
      {/* Dynamic Welcome Header Banner */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#162032] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1.5">
                <FaUserShield size={12} /> Administrator Portal
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <FaCalendarAlt size={12} /> {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, <span className="text-teal-400">Admin</span> 👋
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              {overviewStats.pending > 0 ? (
                <>You have <span className="text-amber-400 font-bold">{overviewStats.pending} items</span> pending review across <span className="text-teal-300 font-bold">{overviewStats.pendingModulesCount} modules</span>. Prompt review helps creators publish quickly.</>
              ) : (
                <>All records are up to date! Platform operates smoothly with <span className="text-emerald-400 font-bold">{overviewStats.approved} approved listings</span>.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={fetchAllData}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all flex items-center gap-2 text-xs font-semibold shadow-md active:scale-95 cursor-pointer"
              title="Refresh all data"
            >
              <FaSync className={loading ? "animate-spin text-teal-400" : "text-teal-400"} /> Refresh
            </button>
            <div className="flex items-center gap-3 bg-slate-800/80 p-2 pr-4 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                AD
              </div>
              <div>
                <p className="text-xs font-bold text-white">System Admin</p>
                <p className="text-[10px] font-semibold text-slate-400">Superuser Mode</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                navigate('/login');
              }}
              className="p-3 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-2xl border border-red-500/30 transition-all flex items-center gap-2 text-xs font-bold shadow-md active:scale-95 cursor-pointer"
              title="Sign Out"
            >
              <FaSignOutAlt size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
        {categories.map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); clearForm(); setSearchTerm(''); setStatusFilter('all'); }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold transition-all text-xs whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <IconComp size={14} className={isActive ? 'text-slate-950' : 'text-teal-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OVERVIEW DASHBOARD CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-teal-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Actions:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {overviewStats.pending > 0 && (
                <button
                  onClick={() => {
                    const firstPendingModule = Object.keys(overviewStats.moduleCounts).find(k => overviewStats.moduleCounts[k].pending > 0);
                    if (firstPendingModule) {
                      setActiveTab(firstPendingModule);
                      setStatusFilter('pending');
                    }
                  }}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FaClock size={12} /> Review Pending ({overviewStats.pending})
                </button>
              )}
              <button
                onClick={() => setActiveTab('food-hub')}
                className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaPlusCircle size={12} /> Add New Listing
              </button>
            </div>
          </div>

          {/* Top Summary Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Total Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
                  <FaLayerGroup size={20} />
                </span>
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                  All 7 Modules
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mb-1">{overviewStats.total}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Records Registered</p>
            </div>

            {/* Approved Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <FaCheckCircle size={20} />
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <FaCheckCircle size={10} /> Active
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-emerald-400 tracking-tight mb-1">{overviewStats.approved}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved & Live Items</p>
            </div>

            {/* Pending Card with subtle pulse glow if pending > 0 */}
            <div className={`p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group border-l-4 border-l-amber-500 ${
              overviewStats.pending > 0 ? 'ring-1 ring-amber-500/30' : ''
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <FaClock size={20} />
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <FaClock size={10} /> Pending Approval
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-amber-400 tracking-tight mb-1">{overviewStats.pending}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Admin Verification</p>
            </div>
          </div>

          {/* Module Grid Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <FaChartBar className="text-teal-400" /> Platform Modules Breakdown
              </h2>
              <p className="text-xs text-slate-400 mt-1">Overview of contents across all 7 platform categories</p>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {Object.entries(MODULE_META).map(([key, config]) => {
              const IconComp = config.icon;
              const stats = overviewStats.moduleCounts[key] || { total: 0, approved: 0, pending: 0 };
              
              return (
                <div
                  key={key}
                  className={`p-6 rounded-2xl bg-slate-900 border border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${config.borderHover} ${config.glowShadow} group hover:-translate-y-1`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} text-slate-950 shadow-md font-bold`}>
                        <IconComp size={18} />
                      </div>
                      <span className="text-xs font-extrabold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                        {stats.total} {stats.total === 1 ? 'Record' : 'Records'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                      {config.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-6 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                        <FaCheckCircle size={10} /> {stats.approved} Approved
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1">
                        <FaClock size={10} /> {stats.pending} Pending
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setActiveTab(key); clearForm(); }}
                    className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-teal-400 group-hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View All</span>
                    <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODULE TAB SPECIFIC MANAGEMENT SECTION */}
      {activeTab !== 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR: Add / Update Item Form */}
          <div className="lg:col-span-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-teal-300 capitalize flex items-center gap-2">
                {editingId ? <><FaEdit /> Update Record</> : <><FaPlusCircle /> Add New Record</>}
              </h2>
              {editingId && (
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                  Editing Mode
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Name / Title Field */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">NAME / TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Palace Hotel & Restaurant"
                  value={formData.name}
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: null }));
                  }}
                  className={`w-full bg-slate-800 border ${formErrors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-400 transition-colors`}
                />
                {formErrors.name && (
                  <p className="text-[11px] font-semibold text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationTriangle size={10} /> {formErrors.name}
                  </p>
                )}
              </div>

              {/* Sub Category Dropdown */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">SUB CATEGORY *</label>
                <select
                  required
                  value={formData.subCategory}
                  onChange={e => {
                    setFormData({ ...formData, subCategory: e.target.value });
                    if (formErrors.subCategory) setFormErrors(prev => ({ ...prev, subCategory: null }));
                  }}
                  className={`w-full bg-slate-800 border ${formErrors.subCategory ? 'border-red-500' : 'border-slate-700'} rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-400 transition-colors`}
                >
                  <option value="">-- Select Sub Category --</option>
                  {(SUB_CATEGORIES[activeTab] || []).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                {formErrors.subCategory && (
                  <p className="text-[11px] font-semibold text-red-400 mt-1">{formErrors.subCategory}</p>
                )}
              </div>

              {/* District & City Sectioning Card */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
                <p className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  📍 Location Details
                </p>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">DISTRICT *</label>
                  <select
                    required
                    value={formData.district}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className={`w-full bg-slate-800 border ${formErrors.district ? 'border-red-500' : 'border-slate-700'} rounded-lg p-2 text-white focus:outline-none focus:border-teal-400`}
                  >
                    <option value="">-- Select District --</option>
                    {SRI_LANKA_LOCATIONS.map(l => (
                      <option key={l.district} value={l.district}>{l.district}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">CITY / TOWN *</label>
                  <select
                    required
                    disabled={availableCities.length === 0}
                    value={formData.location}
                    onChange={e => {
                      setFormData({ ...formData, location: e.target.value });
                      if (formErrors.location) setFormErrors(prev => ({ ...prev, location: null }));
                    }}
                    className={`w-full bg-slate-800 border ${formErrors.location ? 'border-red-500' : 'border-slate-700'} rounded-lg p-2 text-white focus:outline-none focus:border-teal-400 disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <option value="">-- Select City --</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {availableCities.length === 0 && (
                    <p className="text-[10px] text-slate-400 mt-1 italic flex items-center gap-1">
                      <FaInfoCircle size={10} className="text-teal-400" /> Select a District first to enable cities
                    </p>
                  )}
                </div>
              </div>

              {/* Module-Specific Form Fields */}
              {activeTab === 'functions-venue' && (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-indigo-500/20 space-y-3">
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">🏛️ Venue Specific Info</p>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">VENUE ADDRESS *</label>
                    <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">MAX CAPACITY</label>
                      <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">RENTAL (LKR)</label>
                      <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'functions-tickets' && (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-purple-500/20 space-y-3">
                  <p className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">🎫 Event Tickets Info</p>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">EVENT LOCATION / HALL *</label>
                    <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">EXPECTED CROWD</label>
                      <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">TICKET PRICE (LKR)</label>
                      <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">BOOKING LINK / URL</label>
                    <input type="text" placeholder="https://mytickets.lk/..." value={formData.bookingUrl} onChange={e => setFormData({...formData, bookingUrl: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                  </div>
                </div>
              )}

              {activeTab === 'movie-theater' && (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-cyan-500/20 space-y-3">
                  <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Theater Info</p>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">SEATING CAPACITY</label>
                    <input type="text" placeholder="e.g. 150 Seats" value={formData.seatCapacity} onChange={e => setFormData({...formData, seatCapacity: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">TICKET PRICE (LKR)</label>
                      <input type="text" value={formData.ticketPrice} onChange={e => setFormData({...formData, ticketPrice: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">RATING (0 - 5.0)</label>
                      <input type="number" step="0.1" max="5" min="0" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">FACILITIES</label>
                    <input type="text" placeholder="e.g. AC, Parking, Dolby" value={formData.facilities} onChange={e => setFormData({...formData, facilities: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
                  </div>
                </div>
              )}

              {activeTab !== 'functions-venue' && activeTab !== 'functions-tickets' && activeTab !== 'movie-theater' && (
                <div>
                  <label className="font-bold text-slate-300 block mb-1">PRICE / ESTIMATE (LKR)</label>
                  <input type="text" placeholder="e.g. 1500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-400" />
                </div>
              )}

              {/* Contact Number */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">CONTACT NUMBER *</label>
                <input
                  type="text"
                  required
                  placeholder="0771234567"
                  value={formData.contact}
                  onChange={e => {
                    setFormData({ ...formData, contact: e.target.value });
                    if (formErrors.contact) setFormErrors(prev => ({ ...prev, contact: null }));
                  }}
                  className={`w-full bg-slate-800 border ${formErrors.contact ? 'border-red-500' : 'border-slate-700'} rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-400`}
                />
                {formErrors.contact && (
                  <p className="text-[11px] font-semibold text-red-400 mt-1">{formErrors.contact}</p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">IMAGE URL</label>
                <input type="text" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-400" />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-teal-500/20 mt-2 cursor-pointer active:scale-95"
              >
                {editingId ? 'Update Item' : 'Save Item'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors mt-1 font-semibold cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* RIGHT PANEL: Records Search, Filter, Bulk Tools & Table */}
          <div className="lg:col-span-3 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between">
            
            <div>
              {/* Header & Table Search / Filter Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white capitalize tracking-tight flex items-center gap-2">
                    {categories.find(c => c.id === activeTab)?.label} Records
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Showing {filteredTableItems.length} total entries</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-slate-400" size={12} />
                    <input
                      type="text"
                      placeholder="Search title or location..."
                      value={searchTerm}
                      onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400 w-48 md:w-56"
                    />
                    {searchTerm && (
                      <FaTimes className="absolute right-3 top-3 text-slate-400 cursor-pointer hover:text-white" size={12} onClick={() => setSearchTerm('')} />
                    )}
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => { setStatusFilter('approved'); setCurrentPage(1); }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'approved' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'pending' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                      Pending
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Toolbar (Visible when rows selected) */}
              {selectedIds.length > 0 && (
                <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
                  <span className="font-bold text-teal-300">
                    {selectedIds.length} items selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkApprove}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 shadow cursor-pointer"
                    >
                      <FaCheck size={11} /> Approve Selected
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center gap-1 shadow cursor-pointer"
                    >
                      <FaTrash size={11} /> Delete Selected
                    </button>
                  </div>
                </div>
              )}

              {/* Main Records Table */}
              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <FaSync className="animate-spin text-teal-400 mx-auto mb-2" size={24} />
                  <p className="text-sm font-semibold">Loading platform records...</p>
                </div>
              ) : paginatedItems.length === 0 ? (
                <div className="p-12 text-center bg-slate-800/40 rounded-2xl border border-slate-800 my-4">
                  <FaInfoCircle className="text-slate-500 mx-auto mb-3" size={32} />
                  <p className="text-slate-300 font-bold text-base">No records found</p>
                  <p className="text-slate-400 text-xs mt-1">Try resetting search filters or add a new record using the form.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-200 table-auto border-collapse">
                    <thead className="bg-slate-800/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={paginatedItems.every(i => selectedIds.includes(i._id))}
                            onChange={e => handleSelectAll(e, paginatedItems)}
                            className="rounded border-slate-700 text-teal-500 focus:ring-0 cursor-pointer"
                          />
                        </th>
                        <th className="p-3">Item Details</th>
                        <th className="p-3">Sub Category</th>
                        <th className="p-3">Location</th>

                        {activeTab === 'movie-theater' && (
                          <>
                            <th className="p-3">Capacity</th>
                            <th className="p-3">Ticket Price</th>
                            <th className="p-3">Rating</th>
                            <th className="p-3">Facilities</th>
                          </>
                        )}

                        {activeTab === 'functions-venue' && (
                          <>
                            <th className="p-3">Full Address</th>
                            <th className="p-3">Capacity</th>
                            <th className="p-3">Rental Fee</th>
                          </>
                        )}

                        {activeTab === 'functions-tickets' && (
                          <>
                            <th className="p-3">Event Venue</th>
                            <th className="p-3">Crowd Limit</th>
                            <th className="p-3">Ticket Price</th>
                            <th className="p-3">Booking Link</th>
                          </>
                        )}

                        {activeTab !== 'functions-venue' && activeTab !== 'functions-tickets' && activeTab !== 'movie-theater' && (
                          <th className="p-3">Price / Estimate</th>
                        )}

                        <th className="p-3">Contact</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginatedItems.map((item, idx) => (
                        <tr 
                          key={item._id} 
                          className={`transition-colors hover:bg-slate-800/70 ${idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/90'}`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item._id)}
                              onChange={() => handleSelectRow(item._id)}
                              className="rounded border-slate-700 text-teal-500 focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100'}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-700"
                            />
                            <div>
                              <span className="font-bold text-white break-words max-w-[140px] block leading-tight">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-[11px] rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                              {item.subCategory || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300 break-words max-w-[120px]">
                            {item.location}, <span className="text-slate-400 font-semibold">{item.district}</span>
                          </td>

                          {activeTab === 'movie-theater' && (
                            <>
                              <td className="p-3 text-cyan-300 font-semibold">{item.seatCapacity || '150 Seats'}</td>
                              <td className="p-3 text-emerald-400 font-medium">{formatPriceDisplay(item.ticketPrice || item.price)}</td>
                              <td className="p-3 text-yellow-400 font-bold">{item.rating || '4.5'}⭐</td>
                              <td className="p-3 break-words max-w-[140px] text-[11px] text-slate-400">
                                {Array.isArray(item.facilities) ? item.facilities.join(', ') : item.facilities || 'Standard'}
                              </td>
                            </>
                          )}

                          {activeTab === 'functions-venue' && (
                            <>
                              <td className="p-3 break-words max-w-[140px] text-slate-400">{item.address || 'N/A'}</td>
                              <td className="p-3 text-amber-400 font-semibold">{item.capacity || 0} Pax</td>
                              <td className="p-3 text-emerald-400 font-medium">{formatPriceDisplay(item.price)}</td>
                            </>
                          )}

                          {activeTab === 'functions-tickets' && (
                            <>
                              <td className="p-3 break-words max-w-[140px] text-slate-400">{item.address || 'N/A'}</td>
                              <td className="p-3 text-amber-400 font-semibold">{item.capacity || 0} Pax</td>
                              <td className="p-3 text-emerald-400 font-medium">{formatPriceDisplay(item.price)}</td>
                              <td className="p-3 max-w-[120px] truncate">
                                {item.bookingUrl ? (
                                  <a href={item.bookingUrl} target="_blank" rel="noreferrer" className="text-teal-400 underline hover:text-teal-300 inline-flex items-center gap-1 font-bold">
                                    Link <FaExternalLinkAlt size={9} />
                                  </a>
                                ) : (
                                  <span className="text-slate-500">None</span>
                                )}
                              </td>
                            </>
                          )}

                          {activeTab !== 'functions-venue' && activeTab !== 'functions-tickets' && activeTab !== 'movie-theater' && (
                            <td className="p-3 text-emerald-400 font-medium">{formatPriceDisplay(item.price)}</td>
                          )}

                          <td className="p-3 text-slate-300 font-mono text-[11px]">{item.contact}</td>

                          {/* Accessible Status Badges */}
                          <td className="p-3">
                            {item.isApproved ? (
                              <span className="px-2.5 py-1 text-[11px] rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                                <FaCheckCircle size={10} /> Approved
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-[11px] rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
                                <FaClock size={10} /> Pending
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3 text-center">
                            <div className="flex justify-center items-center gap-1.5">
                              {!item.isApproved && (
                                <button
                                  onClick={() => handleApprove(item._id)}
                                  className="p-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-all border border-emerald-500/30 cursor-pointer"
                                  title="Approve Item"
                                >
                                  <FaCheck size={12} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all border border-blue-500/30 cursor-pointer"
                                title="Edit Item"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => setDeleteModalItem(item)}
                                className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/30 cursor-pointer"
                                title="Delete Item"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {filteredTableItems.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <div>
                  Showing <span className="font-bold text-white">{Math.min(filteredTableItems.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="font-bold text-white">{Math.min(filteredTableItems.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="font-bold text-white">{filteredTableItems.length}</span> records
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <FaChevronLeft size={10} />
                  </button>
                  
                  <span className="px-3 py-1 font-bold text-teal-400 bg-slate-800 rounded-lg border border-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Guard Modal for Deleting Record */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <FaExclamationTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Item Confirmation</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              Are you sure you want to permanently remove <span className="font-bold text-white">"{deleteModalItem.name}"</span> from the platform database?
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalItem(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;