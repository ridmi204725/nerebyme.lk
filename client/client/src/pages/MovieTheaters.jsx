import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryMenu from '../components/CategoryMenu';
import {
  FaMapMarkerAlt, FaPlusCircle, FaTimes, FaPhoneAlt, FaRoute, FaInfoCircle,
  FaStar, FaChair, FaWifi, FaParking, FaUtensils, FaVolumeUp
} from 'react-icons/fa';

const SRI_LANKA_LOCATIONS = [
  { d: "Ampara", c: ["Addalaichenai", "Akkaraipattu", "Alayadivembu", "Ampara", "Damana", "Dehiattakandiya", "Irakkamam", "Kalmunai", "Karaitivu", "Lahugala", "Mahaoya", "Navithanveli", "Nintavur", "Oluvil", "Padiyathalawa", "Pottuvil", "Sainthamaruthu", "Sammanthurai", "Uhana"] },
  { d: "Anuradhapura", c: ["Anuradhapura", "Bulnewa", "Eppawala", "Galenbindunuwewa", "Galgamuwa", "Habarana", "Horowpothana", "Ipalogama", "Kahatagasdigiliya", "Kebithigollewa", "Kekirawa", "Mahavilachchiya", "Medawachchiya", "Mihintale", "Nachchaduwa", "Nochiyagama", "Padaviya", "Palagala", "Palugaswewa", "Rajanganaya", "Rambewa", "Talawa", "Tambuttegama", "Thirappane"] },
  { d: "Badulla", c: ["Badulla", "Bandarawela", "Demodara", "Diyatalawa", "Diyathalawa", "Ella", "Haldummulla", "Hali-Ela", "Haputale", "Kandaketiya", "Lunugala", "Mahiyanganaya", "Meegahakiula", "Passara", "Ridhimaliyadda", "Soranathota", "Uva-Paranagama", "Welimada", "Weliyaya"] },
  { d: "Batticaloa", c: ["Araipattai", "Batticaloa", "Chenkalady", "Eravur", "Kaluwanchikudy", "Kattankudy", "Kiran", "Kokkadichcholai", "Oddamavadi", "Pasikudah", "Valachchenai", "Vakarai", "Vavunathivu", "Vellavely"] },
  { d: "Colombo", c: ["Angoda", "Athurugiriya", "Avissawella", "Battaramulla", "Boralesgamuwa", "Colombo 1-15", "Dehiwala-Mount Lavinia", "Egoda Uyana", "Gothatuwa", "Hanwella", "Homagama", "Kaduwela", "Kohuwala", "Kolonnawa", "Kosgama", "Kottawa", "Kotte (Sri Jayawardenepura)", "Madapatha", "Maharagama", "Malabe", "Moratuwa", "Mulleriyawa", "Nawala", "Nugegoda", "Padukka", "Pannipitiya", "Piliyandala", "Rajagiriya", "Ratmalana", "Talawatugoda", "Wellampitiya"] },
  { d: "Galle", c: ["Ahungalla", "Ambalangoda", "Baddegama", "Balapitiya", "Batapola", "Bentota", "Bope-Poddala", "Elpitiya", "Galle", "Habaraduwa", "Hikkaduwa", "Hiniduma", "Imaduwa", "Karandeniya", "Karapitiya", "Koggala", "Nagoda", "Neluwa", "Niawagama", "Thawalama", "Yakkalamulla"] },
  { d: "Gampaha", c: ["Attanagalla", "Biyagama", "Delgoda", "Divulipitiya", "Dompe", "Enderamulla", "Gampaha", "Ganemulla", "Ja-Ela", "Kadawatha", "Kandana", "Katunayake", "Kelaniya", "Kiribathgoda", "Mahara", "Minuwangoda", "Mirigama", "Negombo", "Nittambuwa", "Pamunugama", "Pugoda", "Ragama", "Seeduwa", "Sapugaskanda", "Veyangoda", "Wattala", "Weliweriya"] },
  { d: "Hambantota", c: ["Ambalantota", "Angunakolapelessa", "Beliatta", "Hambantota", "Katuwana", "Lunugamvehera", "Menerigama", "Okewela", "Sooriyawewa", "Tangalle", "Tissamaharama", "Walasmulla", "Weeraketiya"] },
  { d: "Jaffna", c: ["Chankanai", "Chavakachcheri", "Delft", "Jaffna", "Karainagar", "Karaveddy", "Kayts", "Kopay", "Maruthankerney", "Nallur", "Point Pedro", "Sandilipay", "Tellippalai", "Uduvil", "Velanai"] },
  { d: "Kalutara", c: ["Agalawatta", "Aluthgama", "Baduraliya", "Bandaragama", "Beruwala", "Dodangoda", "Horana", "Ingiriya", "Kalutara", "Mathugama", "Millaniya", "Panadura", "Pelawatta", "Wadduwa", "Walallawita"] },
  { d: "Kandy", c: ["Akurana", "Alawatugoda", "Ambatenna", "Digana", "Galagedara", "Gampola", "Gelioya", "Harispattuwa", "Hasalaka", "Kadugannawa", "Kandy", "Katugastota", "Kundasale", "Madulkelle", "Menikhinna", "Minipe", "Nawalapitiya", "Panwila", "Pasbage Korale", "Peradeniya", "Pupuressa", "Teldeniya", "Uda-Dumbara", "Udunuwara", "Wattegama", "Welamboda"] },
  { d: "Kegalle", c: ["Aranayaka", "Bulathkohupitiya", "Dehiowita", "Deraniyagala", "Galigamuwa", "Hemmatagama", "Karawanella", "Kegalle", "Kitulgala", "Mawanella", "Rambukkana", "Ruwanwella", "Warakapola", "Yatiyantota"] },
  { d: "Kilinochchi", c: ["Elephant Pass", "Iranamadu", "Karachchi", "Kilinochchi", "Pallai", "Pooneryn", "Veravil"] },
  { d: "Kurunegala", c: ["Alawwa", "Bingiriya", "Dambadeniya", "Dodangaslanda", "Galewela", "Galgamuwa", "Giriulla", "Ibbagamuwa", "Katupotha", "Kuliyapitiya", "Kurunegala", "Maho", "Mawathagama", "Narammala", "Nikaweratiya", "Paduwasnuwara", "Pannala", "Polgahawela", "Polpithigama", "Ridigama", "Wariyapola", "Weerambugedara"] },
  { d: "Mannar", c: ["Adampan", "Madhu", "Mannar", "Mantai", "Murunkan", "Nanattan", "Pesalai", "Silavatturai"] },
  { d: "Matale", c: ["Dambulla", "Galewela", "Inamaluwa", "Laggala-Pallegama", "Madawala Ulpotha", "Matale", "Nalanda", "Naula", "Palapathwela", "Pallepola", "Rattota", "Sigiriya", "Ukuwela", "Wilgamuwa", "Yatawatta"] },
  { d: "Matara", c: ["Akuressa", "Athuraliya", "Deniyaya", "Devinuwara (Dondra)", "Dikwella", "Hakmana", "Kamburupitiya", "Kekanadurra", "Kirinda", "Kotapola", "Malimbada", "Matara", "Mirissa", "Morawaka", "Pasgoda", "Thihagoda", "Weligama", "Welipitiya"] },
  { d: "Monaragala", c: ["Badalkumbura", "Bibile", "Buttala", "Kataragama", "Madulla", "Medagama", "Monaragala", "Okampitiya", "Sevanagala", "Siyambalanduwa", "Tanamalwila", "Wellawaye"] },
  { d: "Mullaitivu", c: ["Mallavi", "Maritimepattu", "Mullaitivu", "Oddusuddan", "Puthukudiyiruppu", "Thunukkai", "Welioya"] },
  { d: "Nuwara Eliya", c: ["Agarapatana", "Ambagamuwa", "Ginigathena", "Hanguranketha", "Hatton", "Kotmale", "Lindula", "Maskeliya", "Nanu Oya", "Nuwara Eliya", "Pundaluoya", "Ragala", "Ramboda", "Talawakele", "Walapane"] },
  { d: "Polonnaruwa", c: ["Bakamuna", "Dimbulagala", "Giritale", "Hingurakgoda", "Kaduruwela", "Lankapura", "Medirigiriya", "Minneriya", "Polonnaruwa", "Thamankaduwa", "Welikanda"] },
  { d: "Puttalam", c: ["Anamaduwa", "Arachchikattuwa", "Chilaw", "Dankotuwa", "Kalpitiya", "Karwagaswewa", "Kumarakattuwa", "Madampe", "Mahawewa", "Marawila", "Mundel", "Nattandiya", "Nawagattegama", "Pallama", "Puttalam", "Vanathavilluwa", "Wennappuwa"] },
  { d: "Ratnapura", c: ["Ayagama", "Balangoda", "Eheliyagoda", "Embilipitiya", "Godakawela", "Imbulpe", "Kahawatta", "Kalawana", "Kiriella", "Kuruwita", "Nivitigala", "Opanayaka", "Pelmadulla", "Rakwana", "Ratnapura", "Weligepola"] },
  { d: "Trincomalee", c: ["Gomarankadawala", "Kantale", "Kinniya", "Kuchchaveli", "Mutur", "Padavi Sri Pura", "Seruwila", "Thampalakamam", "Trincomalee", "Verugal"] },
  { d: "Vavuniya", c: ["Cheddikulam", "Nedunkeni", "Vavuniya", "Vengalacheddikulam"] }
].reduce((acc, current) => {
  acc.push({ district: current.d, cities: current.c });
  return acc;
}, []);

const TRANSLATIONS = {
  English: {
    heading: "Cinematic Experiences",
    sidebarTitle: "Locations",
    allDistricts: "All Districts",
    searchLocationPlh: "Search district or city...",
  },
  Sinhala: {
    heading: "සිනමා අත්දැකීම්",
    sidebarTitle: "ස්ථාන",
    allDistricts: "සියලු දිස්ත්‍රික්ක",
    searchLocationPlh: "දිස්ත්‍රික්කය හෝ නගරය සොයන්න...",
  }
};

const MovieTheaters = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedName, setSelectedName] = useState('All Districts');
  const [theaters, setTheaters] = useState([]);
  const [points, setPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [modalCities, setModalCities] = useState([]);
  const [formData, setFormData] = useState({
    name: '', location: '', district: '', subCategory: 'Standard', contact: '',
    image: '', nowShowing: '', ticketPrice: '', rating: '4.5', reviewsCount: '120',
    seatCapacity: '150', facilities: ''
  });

  const context = useOutletContext() || {};
  const language = context.language || 'English';
  const text = TRANSLATIONS[language] || TRANSLATIONS.English;

  // 🌟 ස්වයංක්‍රීයව Current Host එක හඳුනාගෙන API URL එක සකස් කිරීම
  const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  // පිටුව Load වෙද්දී ලොග් වී ඉන්න යූසර්ගේ Email Key එකෙන් Points කියවීම
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const userSpecificPointsKey = `userPoints_${userEmail}`;
    const savedPoints = localStorage.getItem(userSpecificPointsKey);
    setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
  }, []);

  const fetchTheaters = async () => {
    try {
      const params = {
        category: 'movie-theater',
        isApproved: 'true'
      };

      if (selectedType === 'district' && selectedName !== 'All Districts') params.district = selectedName;
      if (selectedType === 'city') params.city = selectedName;

      const res = await axios.get(`${API_BASE_URL}/api/movie-theaters`, { params });
      setTheaters(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error loading theaters:", err);
      setTheaters([]);
    }
  };

  useEffect(() => { fetchTheaters(); }, [selectedType, selectedName]);

  const handleModalDistrictChange = (d) => {
    setFormData({...formData, district: d, location: ''});
    const matched = SRI_LANKA_LOCATIONS.find(l => l.district === d);
    setModalCities(matched ? matched.cities : []);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🌟 ලොග් වී සිටින යූසර්ගේ Token එක ලබා ගැනීම
      const token = localStorage.getItem('token');

      // 🌟 Header එක හරහා Token එක යැවීම
      await axios.post(`${API_BASE_URL}/api/movie-theaters`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const userEmail = localStorage.getItem('userEmail') || 'guest';
      const userSpecificPointsKey = `userPoints_${userEmail}`;

      const newPoints = points + 10;
      setPoints(newPoints);
      localStorage.setItem(userSpecificPointsKey, newPoints.toString());

      alert("Submission successful! Awaiting admin approval.");
      setIsModalOpen(false);
      setFormData({
        name: '', location: '', district: '', subCategory: 'Standard', contact: '',
        image: '', nowShowing: '', ticketPrice: '', rating: '4.5', reviewsCount: '120',
        seatCapacity: '150', facilities: ''
      });
      fetchTheaters();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submission failed!");
    }
  };

  const filteredLocations = SRI_LANKA_LOCATIONS.map(loc => {
    const matchesDistrict = loc.district.toLowerCase().includes(locationSearch.toLowerCase());
    const filteredCities = loc.cities.filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()));
    return (matchesDistrict || filteredCities.length > 0) ? { ...loc, filteredCities } : null;
  }).filter(Boolean);

  return (
    <div className="min-h-screen text-white pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <CategoryMenu activeTab="movie-theater" />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <form className="bg-[#11131a] p-6 rounded-2xl w-full max-w-lg border border-gray-800" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Theater</h2>
              <FaTimes className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setIsModalOpen(false)} />
            </div>

            {/* Theater Name */}
            <input required placeholder="Theater Name" className="w-full bg-[#161922] p-3 mb-2 rounded-xl border border-gray-800/60 focus:outline-none focus:border-orange-500" onChange={e => setFormData({...formData, name: e.target.value})} />

            {/* District & City */}
            <div className="grid grid-cols-2 gap-2">
              <select required className="bg-[#161922] p-3 mb-2 rounded-xl border border-gray-800/60 focus:outline-none focus:border-orange-500" onChange={e => handleModalDistrictChange(e.target.value)}>
                <option value="">Select District</option>
                {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district}>{l.district}</option>)}
              </select>
              <select required disabled={modalCities.length === 0} className="bg-[#161922] p-3 mb-2 rounded-xl border border-gray-800/60 focus:outline-none focus:border-orange-500 disabled:opacity-40" onChange={e => setFormData({...formData, location: e.target.value})}>
                <option value="">Select City</option>
                {modalCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Theater Type Dropdown */}
            <select required className="w-full bg-[#161922] p-3 mb-2 rounded-xl border border-gray-800/60 focus:outline-none focus:border-orange-500" onChange={e => setFormData({...formData, subCategory: e.target.value})}>
              <option value="">Select Theater Type</option>
              <option value="Standard">Standard</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
              <option value="4DX">4DX</option>
            </select>

            {/* Facilities */}
            <input placeholder="Facilities (AC, Parking, Dolby, Food)" className="w-full bg-[#161922] p-3 mb-2 rounded-xl border border-gray-800/60 focus:outline-none focus:border-orange-500" onChange={e => setFormData({...formData, facilities: e.target.value})} />

            {/* Rating & Ticket Price */}
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Rating (e.g. 4.5)" step="0.1" max="5" min="0" className="bg-[#161922] p-3 mb-2 rounded-xl border border-gray-800/60 focus:outline-none focus:border-orange-500" onChange={e => setFormData({...formData, rating: e.target.value})} />
              <input type="text" placeholder="Ticket Price (LKR)" className="bg-[#161922] p-3 mb-2 rounded-xl border border-gray-800/60 focus:outline-none focus:border-orange-500" onChange={e => setFormData({...formData, ticketPrice: e.target.value})} />
            </div>

            {/* Contact Number */}
            <input required type="tel" placeholder="Contact Number (e.g. 0771234567)" className="w-full bg-[#161922] p-3 mb-2 rounded-xl border border-gray-800/60 focus:outline-none focus:border-orange-500" onChange={e => setFormData({...formData, contact: e.target.value})} />

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 p-3 rounded-xl font-bold mt-2 transition-colors">Submit</button>
          </form>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="bg-[#11131a]/80 p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400">POINTS</span>
            <span className="text-lg font-black text-amber-400">{points}</span>
          </div>

          <div className="bg-[#11131a] p-4 rounded-2xl border border-gray-800">
            <h3 className="font-bold mb-3">{text.sidebarTitle}</h3>
            <input type="text" placeholder={text.searchLocationPlh} value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="w-full bg-[#161922] text-xs p-2.5 rounded-xl border border-gray-800 mb-2" />
            <div className="space-y-1 overflow-y-auto max-h-[350px] scrollbar-thin">
              <button onClick={() => { setSelectedType('all'); setSelectedName('All Districts'); }} className="w-full text-left px-4 py-2 text-sm text-gray-400">{text.allDistricts}</button>
              {filteredLocations.map(loc => (
                <div key={loc.district}>
                  <div className="px-4 py-2 text-sm text-gray-300 cursor-pointer hover:bg-[#161922] rounded-lg transition-colors" onClick={() => { setSelectedType('district'); setSelectedName(loc.district); setExpandedDistrict(expandedDistrict === loc.district ? null : loc.district); }}>
                    {loc.district}
                  </div>
                  {expandedDistrict === loc.district && (
                    <div className="pl-6 pb-2">
                      {loc.filteredCities.map((c) => (
                        <button key={c} onClick={() => { setSelectedType('city'); setSelectedName(c); }} className="block w-full text-left py-1 text-xs text-gray-500 hover:text-orange-400">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 p-3 rounded-xl font-bold flex justify-center items-center gap-2"><FaPlusCircle /> ADD THEATER</button>
        </div>

        {/* Content (Cards Container) */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold">{text.heading}</h1>

          {selectedName !== 'All Districts' ? (
            /* 🌟 List View */
            <div className="flex flex-col gap-4 mt-8">
              {theaters.length === 0 ? (
                <p className="text-gray-400 text-sm">No movie theaters found for this category and location.</p>
              ) : (
                theaters.map((pkg, index) => (
                  <motion.div
                    key={pkg._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#11131a] border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-700 transition-all"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">{pkg.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[#FF5722]" /> {pkg.location}, {pkg.district}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pkg.name + ' ' + pkg.location)}`}
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
                        onClick={() => alert(`About ${pkg.name}: Located in ${pkg.location}. Tech: ${pkg.subCategory || 'Standard'} | Seating Capacity: ${pkg.seatCapacity || '150'} | Facilities: ${Array.isArray(pkg.facilities) ? pkg.facilities.join(', ') : pkg.facilities || 'Standard facilities'}`)}
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
            /* 🌟 Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {theaters.length === 0 ? (
                <p className="text-gray-400 text-sm col-span-full text-center py-10">No movie theaters found.</p>
              ) : (
                theaters.map((pkg, index) => (
                  <motion.div
                    key={pkg._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-[#11131a] rounded-2xl overflow-hidden border border-gray-800/80 flex flex-col justify-between hover:border-gray-700 shadow-xl transition-all group"
                  >
                    <div className="relative overflow-hidden h-44 w-full">
                      <img src={pkg.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500'} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wider flex items-center gap-1">
                          <FaMapMarkerAlt size={9} /> {pkg.location} {pkg.district ? `(${pkg.district})` : ''}
                        </span>

                        <div className="flex justify-between items-start mt-1.5 gap-2">
                          <h3 className="text-base font-bold text-gray-100 line-clamp-1">{pkg.name}</h3>
                          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0">
                            <FaStar size={10} /> {pkg.rating || "4.5"} <span className="text-gray-500 font-normal">({pkg.reviewsCount || "120"})</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 mt-2.5 flex items-center gap-1.5 bg-[#161922] p-2 rounded-lg border border-gray-800/40">
                          <FaChair className="text-gray-500 text-[11px] shrink-0" />
                          <span className="text-gray-400">Capacity:</span>
                          <span className="text-amber-400 font-medium">{pkg.seatCapacity || '150'} Seats</span>
                        </p>

                        <div className="flex gap-3.5 mt-3.5 text-gray-400 text-base">
                          {(Array.isArray(pkg.facilities) ? pkg.facilities.join(', ') : (pkg.facilities || '')).toLowerCase().includes('ac') && <FaWifi title="AC" className="hover:text-white transition-colors" />}
                          {(Array.isArray(pkg.facilities) ? pkg.facilities.join(', ') : (pkg.facilities || '')).toLowerCase().includes('parking') && <FaParking title="Parking" className="hover:text-white transition-colors" />}
                          {(Array.isArray(pkg.facilities) ? pkg.facilities.join(', ') : (pkg.facilities || '')).toLowerCase().includes('dolby') && <FaVolumeUp title="Dolby" className="hover:text-white transition-colors" />}
                          {(Array.isArray(pkg.facilities) ? pkg.facilities.join(', ') : (pkg.facilities || '')).toLowerCase().includes('food') && <FaUtensils title="Food" className="hover:text-white transition-colors" />}
                        </div>

                        <div className="flex justify-between items-center mt-3.5">
                          <p className="text-xs text-gray-500">Tech: <span className="text-purple-400 font-bold uppercase tracking-wide bg-purple-500/10 px-2 py-0.5 rounded-md text-[10px]">{pkg.subCategory || 'Standard'}</span></p>
                          <p className="text-sm font-semibold text-emerald-400">LKR {pkg.ticketPrice ? Number(pkg.ticketPrice).toLocaleString() : '0'}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800/80">
                        {pkg.contact ? (
                          <a href={`tel:${pkg.contact}`} className="text-xs font-bold text-amber-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer flex items-center gap-1">
                            <FaPhoneAlt size={11} /> {pkg.contact}
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><FaPhoneAlt size={11} /> No Contact</span>
                        )}

                        <a
                          href={`tel:${pkg.contact}`}
                          className="bg-[#FF5722]/10 text-[#FF5722] px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#FF5722] hover:text-white transition-all shadow-md"
                        >
                          <FaPhoneAlt size={10} /> Book
                        </a>
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

export default MovieTheaters;