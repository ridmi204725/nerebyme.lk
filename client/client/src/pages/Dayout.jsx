import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryMenu from '../components/CategoryMenu';
import {
  FaMapMarkerAlt, FaPlusCircle, FaTimes, FaPhoneAlt, FaRoute, FaInfoCircle
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

const DATABASE_CATEGORIES = ["All", "Nature & Adventure", "Relax & Chill", "Culture & History", "Fun & Family"];

const TRANSLATIONS = {
  English: {
    heading: "Perfect Dayout Spots",
    subtitle: "Find the best day-relaxation and adventure packages near you.",
    sidebarTitle: "Locations",
    allDistricts: "All Districts",
    searchLocationPlh: "Search district or city...",
    searchPackagePlh: "Search dayout packages...",
    perPerson: "/ person",
    categories: ["All", "Nature & Adventure", "Relax & Chill", "Culture & History", "Fun & Family"]
  },
  Sinhala: {
    heading: "පරිපූර්ණ දින චාරිකා ස්ථාන",
    subtitle: "ඔබට සමීපව ඇති හොඳම දිනක විවේකය සහ වික්‍රමාන්විත පැකේජ සොයා ගන්න.",
    sidebarTitle: "ස්ථාන",
    allDistricts: "සියලු දිස්ත්‍රික්ක",
    searchLocationPlh: "දිස්ත්‍රික්කය හෝ නගරය සොයන්න...",
    searchPackagePlh: "දින චාරිකා පැකේජ සොයන්න...",
    perPerson: "/ පුද්ගලයෙකුට",
    categories: ["සියල්ල", "ස්වභාවධර්මය සහ වික්‍රමාන්විත", "විවේකය සහ නිදහස", "සංස්කෘතිය සහ ඉතිහාසය", "විනෝදය සහ පවුල"]
  },
  Tamil: {
    heading: "சிறந்த ஒருநாள் சுற்றுலா இடங்கள்",
    subtitle: "உங்களுக்கு அருகிலுள்ள சிறந்த ஓய்வு மற்றும் சாகசப் பொதிகளைக் கண்டறியுங்கள்.",
    sidebarTitle: "இடங்கள்",
    allDistricts: "அனைத்து மாவட்டங்கள்",
    searchLocationPlh: "மாவட்டம் அல்லது நகரம் தேடு...",
    searchPackagePlh: "சுற்றுலாப் பொதிகளைத் தேடு...",
    perPerson: "/ நபருக்கு",
    categories: ["அனைத்தும்", "இயற்கை மற்றும் சாகசம்", "ஓய்வு மற்றும் தளர்வு", "கலாச்சாரம் மற்றும் வரலாறு", "வேடிக்கை மற்றும் குடும்பம்"]
  }
};

const Dayout = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedName, setSelectedName] = useState('All Districts');
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [packageSearch, setPackageSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [packages, setPackages] = useState([]);
  const [points, setPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', location: '', district: '', category: '', contact: '', image: '' });
  const [modalCities, setModalCities] = useState([]);

  const { language } = useOutletContext();
  const text = TRANSLATIONS[language] || TRANSLATIONS.English;

  // 🌟 ස්වයංක්‍රීයව Current Host එක හඳුනාගෙන API URL එක සකස් කිරීම
  const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  // පිටුව මුලින්ම Load වෙද්දී ලොග් වී ඉන්න යූසර්ට අදාළ Email එකෙන් Points කියවීම
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const userSpecificPointsKey = `userPoints_${userEmail}`;
    const savedPoints = localStorage.getItem(userSpecificPointsKey);
    setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
  }, []);

  const fetchDayoutsData = async () => {
    try {
      const currentSubCategory = DATABASE_CATEGORIES[activeCategory];

      const params = { category: 'dayout' };

      if (currentSubCategory !== 'All') params.subCategory = currentSubCategory;
      if (packageSearch.trim() !== '') params.search = packageSearch;
      if (selectedType === 'district' && selectedName !== 'All Districts') params.district = selectedName;
      if (selectedType === 'city') params.city = selectedName;

      const response = await axios.get(`${API_BASE_URL}/api/dayouts`, { params });

      if (response.data && response.data.data) {
        setPackages(response.data.data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error("Error loading dayouts:", error);
      setPackages([]);
    }
  };

  useEffect(() => { fetchDayoutsData(); }, [selectedType, selectedName, activeCategory, packageSearch]);

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

  return (
    <div className="min-h-screen text-white pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.form initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  name: formData.name,
                  location: formData.location,
                  district: formData.district,
                  category: 'dayout',
                  subCategory: formData.category,
                  contact: formData.contact,
                  price: '0',
                  image: formData.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500',
                  isApproved: false
                };

                try {
                  const token = localStorage.getItem('token');
                  await axios.post(`${API_BASE_URL}/api/admin/items`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });

                  const userEmail = localStorage.getItem('userEmail') || 'guest';
                  const userSpecificPointsKey = `userPoints_${userEmail}`;

                  const newPoints = points + 10;
                  setPoints(newPoints);
                  localStorage.setItem(userSpecificPointsKey, newPoints.toString());

                  alert("Submission Successful! Awaiting admin approval.");
                  setIsModalOpen(false);
                  setFormData({ name: '', location: '', district: '', category: '', contact: '', image: '' });
                  fetchDayoutsData();
                } catch (error) {
                  console.error(error);
                  alert(error.response?.data?.message || "Submission Failed.");
                }
              }}
              className="bg-[#11131a] p-8 rounded-3xl border border-gray-800 w-full max-w-sm space-y-3"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-orange-500">➕ Add New Dayout Place</h2>
                <FaTimes className="cursor-pointer text-gray-400" onClick={() => setIsModalOpen(false)} />
              </div>

              <input required placeholder="Place Name" className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />

              <div className="grid grid-cols-2 gap-2">
                <select required className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-xs" value={formData.district} onChange={e => handleModalDistrictChange(e.target.value)}>
                  <option value="">District</option>
                  {SRI_LANKA_LOCATIONS.map(l => <option key={l.district} value={l.district}>{l.district}</option>)}
                </select>
                <select required disabled={modalCities.length === 0} className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-xs disabled:opacity-40" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
                  <option value="">City</option>
                  {modalCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <select required className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Select Category</option>
                {DATABASE_CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <input required placeholder="Contact Number" className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
              <input placeholder="Image URL (Optional)" className="w-full bg-[#161922] p-3 rounded-xl border border-gray-700 text-sm" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />

              <button type="submit" className="w-full bg-[#FF6B35] py-3 rounded-xl font-bold">Submit & Earn 10 Points</button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <CategoryMenu activeTab="dayout" />

      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="bg-[#11131a]/80 backdrop-blur-md p-4 rounded-2xl border border-gray-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">MY POINTS</span>
            <span className="text-lg font-black text-amber-400">{points}</span>
          </div>

          <div className="bg-[#11131a]/80 backdrop-blur-md pt-10 pb-5 px-5 rounded-2xl border border-gray-800/60">
            <h2 className="text-xl font-bold mb-4">{text.sidebarTitle}</h2>
            <input type="text" placeholder={text.searchLocationPlh} value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="w-full bg-[#161922] text-xs p-2.5 rounded-xl border border-gray-800" />
            <div className="space-y-1 max-h-[350px] overflow-y-auto no-scrollbar mt-4">
              <button onClick={() => { setSelectedType('all'); setSelectedName('All Districts'); }} className="w-full text-left px-4 py-2 text-sm text-gray-400">{text.allDistricts}</button>
              {filteredLocations.map(loc => (
                <div key={loc.district}>
                  <div className="px-4 py-2 text-sm text-gray-300 cursor-pointer hover:bg-[#161922]" onClick={() => { setSelectedType('district'); setSelectedName(loc.district); setExpandedDistrict(expandedDistrict === loc.district ? null : loc.district); }}>{loc.district}</div>
                  {expandedDistrict === loc.district && loc.filteredCities.map(c => <button key={c} onClick={() => { setSelectedType('city'); setSelectedName(c); }} className="block pl-8 py-1 text-xs text-gray-500">{c}</button>)}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 py-3 rounded-2xl font-bold text-xs flex justify-center items-center gap-2"><FaPlusCircle /> ADD PLACES</button>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600">{text.heading}</h1>
          <p className="text-neutral-400 text-sm mt-1">{text.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6 mb-8">
            <input type="text" placeholder={text.searchPackagePlh} value={packageSearch} onChange={(e) => setPackageSearch(e.target.value)} className="w-full sm:w-72 bg-[#11131a] p-2 rounded-xl border border-gray-800 text-sm" />
            <div className="flex flex-wrap gap-2">
              {text.categories.map((cat, index) => (
                <button key={cat} onClick={() => setActiveCategory(index)} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${activeCategory === index ? 'bg-[#FF6B35]' : 'bg-[#11131a] border border-gray-800'}`}>{cat}</button>
              ))}
            </div>
          </div>

          {selectedName !== 'All Districts' ? (
            <div className="flex flex-col gap-4">
              {packages.length === 0 ? (
                <p className="text-gray-400 text-sm">No places found for this category and location.</p>
              ) : (
                packages.map((pkg, index) => (
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
                        onClick={() => alert(`About ${pkg.name}: Located in ${pkg.location}. Category: ${pkg.subCategory || 'Dayout Place'}`)}
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
              {packages.length === 0 ? (
                <p className="text-gray-400 text-sm col-span-full text-center py-10">No places found for this category.</p>
              ) : (
                packages.map((pkg, index) => (
                  <motion.div key={pkg._id || index} className="bg-[#11131a] rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between">
                    <img src={pkg.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500'} alt={pkg.name} className="w-full h-44 object-cover" />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#FF6B35] uppercase">{pkg.location} ({pkg.district})</span>
                        <h3 className="text-base font-bold text-gray-100 mt-0.5">{pkg.name}</h3>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800">
                        {pkg.contact ? (
                          <a href={`tel:${pkg.contact}`} className="text-sm font-bold text-amber-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer flex items-center gap-1">
                            <FaPhoneAlt size={12} /> {pkg.contact}
                          </a>
                        ) : (
                          <span className="text-sm font-bold text-gray-500 flex items-center gap-1"><FaPhoneAlt size={12} /> No Contact</span>
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

export default Dayout;