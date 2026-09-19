import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryMenu from '../components/CategoryMenu';
import {
  FaMapMarkerAlt, FaPlusCircle, FaTimes, FaPhoneAlt, FaRoute, FaInfoCircle, FaCalendarAlt, FaTicketAlt, FaBuilding
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

const VENUE_CATEGORIES = [
  "All", "Weddings", "Corporate Events", "Birthdays", "Parties",
  "Conference Halls", "Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"
];

const TRANSLATIONS = {
  English: {
    heading: "Premium Event Venues",
    subtitle: "Find and book the perfect venue or get tickets for upcoming events.",
    sidebarTitle: "Locations",
    allDistricts: "All Districts",
    searchLocationPlh: "Search district or city...",
    searchVenuePlh: "Search venues or events...",
    categories: [
      "All", "Weddings", "Corporate Events", "Birthdays", "Parties",
      "Conference Halls", "Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"
    ],
    noVenues: "No venues or events found.",
    addVenueBtn: "ADD ITEM",
    myPoints: "MY POINTS",
    bookNow: "Book Venue",
    getTickets: "Get Tickets",
    noContact: "No Contact"
  },
  Sinhala: {
    heading: "විශේෂ උත්සව ශාලාවන් සහ ප්‍රසංග",
    subtitle: "සුදුසුම උත්සව ශාලාවක් සොයා ගන්න හෝ පැවැත්වෙන ප්‍රසංග සඳහා ටිකට්පත් වෙන්කරවා ගන්න.",
    sidebarTitle: "ස්ථාන",
    allDistricts: "සියලු දිස්ත්‍රික්ක",
    searchLocationPlh: "දිස්ත්‍රික්කය හෝ නගරය සොයන්න...",
    searchVenuePlh: "ස්ථාන හෝ ප්‍රසංග සොයන්න...",
    categories: [
      "සියල්ල", "විවාහ උත්සව", "ආයතනික උත්සව", "උපන්දින", "සාද",
      "සම්මන්ත්‍රණ ශාලා", "සංගීත ප්‍රසංග", "සංගීත සංදර්ශන", "වේදිකා නාට්‍ය", "උත්සව", "ප්‍රදර්ශන"
    ],
    noVenues: "කිසිවක් හමු නොවීය.",
    addVenueBtn: "නව ස්ථානයක් එක් කරන්න",
    myPoints: "මගේ ලකුණු",
    bookNow: "ශාලාව වෙන්කරන්න",
    getTickets: "ටිකට්පත් ලබාගන්න",
    noContact: "දුරකථන අංක නොමැත"
  }
};

const Functions = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedName, setSelectedName] = useState('All Districts');
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [venueSearch, setVenueSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [venues, setVenues] = useState([]);
  const [points, setPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('venue_booking');

  const [formData, setFormData] = useState({
    name: '', location: '', district: '', category: '', contact: '', price: '', image: '',
    address: '', capacity: '', functionType: 'venue_booking', bookingUrl: ''
  });

  const [modalCities, setModalCities] = useState([]);
  const { language } = useOutletContext();
  const text = TRANSLATIONS[language] || TRANSLATIONS.English;

  const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const userSpecificPointsKey = `userPoints_${userEmail}`;
    const savedPoints = localStorage.getItem(userSpecificPointsKey);
    setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
  }, []);

  const fetchVenuesData = useCallback(async () => {
    try {
      const currentSubCategory = VENUE_CATEGORIES[activeCategory];
      const params = {
        category: 'functions'
      };

      if (currentSubCategory !== 'All') params.subCategory = currentSubCategory;
      if (venueSearch.trim() !== '') params.search = venueSearch;
      if (selectedType === 'district' && selectedName !== 'All Districts') params.district = selectedName;
      if (selectedType === 'city') params.city = selectedName;

      const response = await axios.get(`${API_BASE_URL}/api/functions`, { params });

      if (response.data && response.data.data) {
        const allItems = response.data.data;

        // 🌟 ඉතා වැදගත්: Venue booking සහ Event tickets එකිනෙකට පටලැවී නොපෙන්වීම සඳහා දැඩිව ෆිල්ටර් කිරීම
        const ticketSubCategories = ["Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"];
        const filteredByTab = allItems.filter(item => {
          if (activeTab === 'venue_booking') {
            return item.functionType === 'venue_booking' || (!item.functionType && !ticketSubCategories.includes(item.subCategory));
          } else {
            return item.functionType === 'event_tickets' || (!item.functionType && ticketSubCategories.includes(item.subCategory));
          }
        });

        setVenues(filteredByTab);
      } else {
        setVenues([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setVenues([]);
    }
  }, [activeCategory, activeTab, venueSearch, selectedType, selectedName, API_BASE_URL]);

  useEffect(() => {
    fetchVenuesData();
  }, [fetchVenuesData]);

  const handleModalDistrictChange = (selectedDistrict) => {
    setFormData({ ...formData, district: selectedDistrict, location: '' });
    const matched = SRI_LANKA_LOCATIONS.find(l => l.district === selectedDistrict);
    setModalCities(matched ? matched.cities : []);
  };

  const filteredLocations = SRI_LANKA_LOCATIONS.map(loc => {
    const matchesDistrict = loc.district.toLowerCase().includes(locationSearch.toLowerCase());
    const filteredCities = loc.cities.filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()));
    return (matchesDistrict || filteredCities.length > 0) ? { ...loc, filteredCities } : null;
  }).filter(Boolean);

  const getDisplayCategory = (subCat) => {
    if (!subCat) return 'General';
    if (language === 'Sinhala') {
      const idx = VENUE_CATEGORIES.indexOf(subCat);
      if (idx !== -1 && TRANSLATIONS.Sinhala.categories[idx]) {
        return TRANSLATIONS.Sinhala.categories[idx];
      }
    }
    return subCat;
  };

  return (
    <div className="min-h-screen text-white pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto font-poppins">
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.form initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  name: formData.name,
                  title: formData.name,
                  location: formData.location,
                  district: formData.district,
                  category: 'functions',
                  subCategory: formData.category,
                  contact: formData.contact,
                  price: formData.price || '0',
                  image: formData.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500',
                  address: formData.address,
                  capacity: Number(formData.capacity) || 0,
                  priceType: 'hall_rent',
                  functionType: formData.functionType,
                  bookingUrl: formData.bookingUrl,
                  isApproved: false
                };

                try {
                  const token = localStorage.getItem('token');
                  await axios.post(`${API_BASE_URL}/api/functions`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });

                  const userEmail = localStorage.getItem('userEmail') || 'guest';
                  const userSpecificPointsKey = `userPoints_${userEmail}`;
                  const newPoints = points + 10;
                  setPoints(newPoints);
                  localStorage.setItem(userSpecificPointsKey, newPoints.toString());

                  alert("Submission Successful! Awaiting admin approval.");
                  setIsModalOpen(false);
                  setFormData({ name: '', location: '', district: '', category: '', contact: '', price: '', image: '', address: '', capacity: '', functionType: 'venue_booking', bookingUrl: '' });
                  fetchVenuesData();
                } catch (error) {
                  console.error(error);
                  alert(error.response?.data?.message || "Submission Failed.");
                }
              }}
              className="bg-[#11131a] p-8 rounded-3xl border border-gray-800 w-full max-w-sm space-y-3"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-orange-500">➕ Add {formData.functionType === 'venue_booking' ? 'Venue' : 'Event'}</h2>
                <FaTimes className="cursor-pointer text-gray-400" onClick={() => setIsModalOpen(false)} />
              </div>

              <div className="flex gap-2 mb-2">
                <button type="button" onClick={() => setFormData({...formData, functionType: 'venue_booking'})} className={`flex-1 py-2 text-xs rounded-xl font-bold border transition-all ${formData.functionType === 'venue_booking' ? 'bg-[#FF6B35] text-white border-transparent' : 'bg-slate-800/40 border-slate-700 text-slate-400'}`}>Bookable Venue</button>
                <button type="button" onClick={() => setFormData({...formData, functionType: 'event_tickets'})} className={`flex-1 py-2 text-xs rounded-xl font-bold border transition-all ${formData.functionType === 'event_tickets' ? 'bg-[#FF6B35] text-white border-transparent' : 'bg-slate-800/40 border-slate-700 text-slate-400'}`}>Ticketed Event</button>
              </div>

              <input required placeholder={formData.functionType === 'venue_booking' ? "Venue Name" : "Event / Concert Name"} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />

              <div className="grid grid-cols-2 gap-2">
                <select required className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-xs text-gray-300" value={formData.district} onChange={e => handleModalDistrictChange(e.target.value)}>
                  <option value="">District</option>
                  {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district}>{l.district}</option>)}
                </select>
                <select required disabled={modalCities.length === 0} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-xs text-gray-300 disabled:opacity-40" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
                  <option value="">City</option>
                  {modalCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <select required className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm text-gray-300" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Select Event Category</option>
                {VENUE_CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <input required placeholder="Full Address / Venue Location" className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm text-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <input required type="number" placeholder="Max Capacity (Pax)" className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm text-white" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
              <input required placeholder="Contact Number" className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm text-white" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
              <input placeholder={formData.functionType === 'venue_booking' ? "Estimated Rental (Rs.)" : "Ticket Price (Rs.)"} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm text-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />

              {formData.functionType === 'event_tickets' && (
                <input placeholder="Ticket Booking URL (Optional)" className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm text-white" value={formData.bookingUrl} onChange={e => setFormData({...formData, bookingUrl: e.target.value})} />
              )}

              <input placeholder="Image URL" className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm text-white" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />

              <button type="submit" className="w-full bg-[#FF6B35] py-3 rounded-xl font-bold">Submit & Earn 10 Points</button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <CategoryMenu activeTab="functions" />

      <div className="flex border-b border-gray-800 max-w-md mx-auto mt-8">
        <button
          onClick={() => { setActiveTab('venue_booking'); setActiveCategory(0); }}
          className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'venue_booking' ? 'border-[#FF6B35] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <FaBuilding /> Book a Venue
        </button>
        <button
          onClick={() => { setActiveTab('event_tickets'); setActiveCategory(0); }}
          className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'event_tickets' ? 'border-[#FF6B35] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <FaTicketAlt /> Event Tickets
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="bg-[#11131a]/80 backdrop-blur-md p-4 rounded-2xl border border-gray-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">{text.myPoints}</span>
            <span className="text-lg font-black text-amber-400">{points}</span>
          </div>

          <div className="bg-[#11131a]/80 backdrop-blur-md pt-10 pb-5 px-5 rounded-2xl border border-gray-800/60">
            <h2 className="text-xl font-bold mb-4">{text.sidebarTitle}</h2>
            <input type="text" placeholder={text.searchLocationPlh} value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="w-full bg-[#161922] text-xs p-2.5 rounded-xl border border-gray-800 text-white" />
            <div className="space-y-1 max-h-[350px] overflow-y-auto no-scrollbar mt-4">
              <button onClick={() => { setSelectedType('all'); setSelectedName('All Districts'); }} className="w-full text-left px-4 py-2 text-sm text-gray-400">{text.allDistricts}</button>
              {filteredLocations.map(loc => (
                <div key={loc.district}>
                  <div className="px-4 py-2 text-sm text-gray-300 cursor-pointer hover:bg-[#161922]" onClick={() => { setSelectedType('district'); setSelectedName(loc.district); setExpandedDistrict(expandedDistrict === loc.district ? null : loc.district); }}>{loc.district}</div>
                  {expandedDistrict === loc.district && loc.filteredCities.map(c => <button key={c} onClick={() => { setSelectedType('city'); setSelectedName(c); }} className="block pl-8 py-1 text-xs text-gray-500 w-full text-left hover:text-white transition-colors">{c}</button>)}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full bg-[#FF5722] py-3 rounded-2xl font-bold text-xs flex justify-center items-center gap-2 uppercase tracking-wide transition-all hover:bg-orange-600">
            <FaPlusCircle /> {activeTab === 'venue_booking' ? 'Add Venue' : 'Add Event'}
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600">
            {activeTab === 'venue_booking' ? text.heading : 'Live Events & Concerts'}
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            {activeTab === 'venue_booking' ? text.subtitle : 'Find the best upcoming live events and reserve your seats now!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6 mb-8">
            <input type="text" placeholder={text.searchVenuePlh} value={venueSearch} onChange={(e) => setVenueSearch(e.target.value)} className="w-full sm:w-72 bg-[#11131a] p-2 rounded-xl border border-gray-800 text-sm text-white" />
            <div className="flex flex-wrap gap-2">
              {text.categories.map((cat, index) => (
                <button key={cat} onClick={() => setActiveCategory(index)} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${activeCategory === index ? 'bg-[#FF6B35]' : 'bg-[#11131a] border border-gray-800'}`}>{cat}</button>
              ))}
            </div>
          </div>

          {selectedName !== 'All Districts' ? (
            <div className="flex flex-col gap-4">
              {venues.length === 0 ? (
                <p className="text-gray-400 text-sm">{text.noVenues}</p>
              ) : (
                venues.map((pkg, index) => (
                  <motion.div
                    key={pkg._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#11131a] border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-700 transition-all"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">{pkg.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-orange-500" /> {pkg.location}, {pkg.district}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Capacity: <span className="text-indigo-400 font-semibold">{pkg.capacity} Pax</span></p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pkg.name + ' ' + pkg.location + ' ' + pkg.district)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        title="Navigation"
                      >
                        <FaRoute size={18} />
                      </a>

                      {pkg.contact ? (
                        <a
                          href={`tel:${pkg.contact}`}
                          className="p-3 bg-green-600/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                          title="Call Now"
                        >
                          <FaPhoneAlt size={16} />
                        </a>
                      ) : (
                        <button disabled className="p-3 bg-gray-800 text-gray-600 rounded-xl cursor-not-allowed">
                          <FaPhoneAlt size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => alert(`About ${pkg.name}: Located in ${pkg.location}. Full Address: ${pkg.address || 'N/A'} | Type: ${getDisplayCategory(pkg.subCategory)} | Capacity: ${pkg.capacity || 0} Pax`)}
                        className="p-3 bg-amber-600/10 text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                        title="About Us"
                      >
                        <FaInfoCircle size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.length === 0 ? (
                <p className="text-gray-400 text-sm col-span-full text-center py-10">{text.noVenues}</p>
              ) : (
                venues.map((pkg, index) => (
                  <motion.div key={pkg._id || index} className="bg-[#11131a] rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between hover:border-gray-700 transition-all">
                    <img src={pkg.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500'} alt={pkg.name} className="w-full h-44 object-cover" />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#FF6B35] uppercase">{pkg.location} ({pkg.district})</span>
                        <h3 className="text-base font-bold text-gray-100 mt-0.5">{pkg.name}</h3>
                        <p className="text-xs text-gray-400 mt-1">Type: {getDisplayCategory(pkg.subCategory)}</p>
                        <p className="text-xs text-gray-400">Capacity: {pkg.capacity} Pax</p>
                        <p className="text-sm font-semibold text-emerald-400 mt-1">LKR {pkg.price ? Number(pkg.price).toLocaleString() : '0'}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800">
                        {pkg.contact ? (
                          <a href={`tel:${pkg.contact}`} className="text-xs font-bold text-amber-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer flex items-center gap-1">
                            <FaPhoneAlt size={11} /> {pkg.contact}
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><FaPhoneAlt size={11} /> {text.noContact}</span>
                        )}

                        {activeTab === 'venue_booking' ? (
                          <button onClick={() => alert(`Contacting Venue: ${pkg.name}. Please call ${pkg.contact}`)} className="bg-[#FF5722]/20 text-[#FF5722] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#FF5722] hover:text-white transition-all">
                            <FaCalendarAlt /> {text.bookNow}
                          </button>
                        ) : (
                          pkg.bookingUrl ? (
                            <a href={pkg.bookingUrl} target="_blank" rel="noopener noreferrer" className="bg-emerald-600/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-600 hover:text-white transition-all">
                              <FaTicketAlt /> {text.getTickets}
                            </a>
                          ) : (
                            <button onClick={() => alert(`Call ${pkg.contact} to purchase tickets manually for ${pkg.name}`)} className="bg-emerald-600/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-600 hover:text-white transition-all">
                              <FaTicketAlt /> Book via Call
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Functions;