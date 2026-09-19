import mongoose from 'mongoose'; // ✅ ES Modules import

const itemSchema = new mongoose.Schema({
  // 🔘 Core Required Fields
  name: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  district: { type: String, required: true },
  category: {
    type: String,
    required: true,
    // 🌟 'travel', 'offer', 'offers' කියන categories මෙතනට අලුතින් එකතු කළා!
    enum: [
      'functions',
      'movie-theater',
      'movie-theaters',
      'food-hub',
      'dayout',
      'travel',
      'offer',
      'offers'
    ]
  },
  subCategory: { type: String, default: '' },
  contact: { type: String, required: true },
  address: { type: String, default: '' },
  description: { type: String, default: '' },

  // 🏛️ 1. Event Halls (Functions) Specific Fields
  capacity: { type: Number, default: 0 },
  priceType: { type: String, enum: ['per_plate', 'hall_rent', 'n/a'], default: 'hall_rent' },
  price: { type: String, default: '0' },
  functionType: { type: String, enum: ['venue_booking', 'event_tickets'], default: 'venue_booking' },

  // 🎬 2. Movie Theaters Specific Fields
  currentlyScreening: { type: String, default: '' }, // 👈 'nowShowing' වෙනුවට අලුත් එක
  ticketPrice: { type: String, default: '0' },
  screenType: { type: String, default: '2D/3D' },
  seatCapacity: { type: String, default: '' },       // 👈 Seat Capacity (උදා: "150 Seats")
  facilities: { type: [String], default: [] },       // 👈 Facilities (AC, Sound, etc.)
  bookingUrl: { type: String, default: '' },         // 👈 Online Book කිරීමට කෙලින්ම යන URL එක
  reviewsCount: { type: Number, default: 0 },         // 👈 Reviews ගණන

  // 🍔 3. Food Hub / Restaurants Specific Fields
  cuisineType: { type: String, default: '' },
  avgCostPerTwo: { type: String, default: '0' },
  deliveryAvailable: { type: Boolean, default: false },

  // 🏊 4. Dayout / Hotels Specific Fields
  dayoutPackagePrice: { type: String, default: '0' },
  activities: { type: [String], default: [] },

  // 🛠️ Amenities Checkboxes
  amenities: {
    hasAC: { type: Boolean, default: false },
    hasParking: { type: Boolean, default: false },
    hasSoundSystem: { type: Boolean, default: false },
    hasPowerBackup: { type: Boolean, default: false },
    allowsExternalCatering: { type: Boolean, default: true },
    allowsAlcohol: { type: Boolean, default: false },
    hasWifi: { type: Boolean, default: false },
    hasPool: { type: Boolean, default: false }
  },

  // 📸 Image Management
  images: { type: [String], default: [] },
  image: { type: String, default: '' },

  // 🛡️ Approval & Ownership Status
  isApproved: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  searchCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 } // Rating අගය Number එකක් ලෙස
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;