import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  // Core Required Fields
  name: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  district: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'functions',
      'movie-theater',
      'movie-theaters',
      'food-hub',
      'hotels',
      'rooms',
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

  // Event Halls (Functions) Specific Fields
  functionType: { type: String, enum: ['venue_booking', 'event_tickets'], default: 'venue_booking' },
  capacity: { type: Number, default: 0 },
  priceType: { type: String, enum: ['per_plate', 'hall_rent', 'n/a'], default: 'hall_rent' },
  price: { type: String, default: '0' },

  // Movie Theaters Specific Fields
  movieType: { type: String, enum: ['public', 'private'], default: 'public' },
  currentlyScreening: { type: String, default: '' },
  ticketPrice: { type: String, default: '0' },
  screenType: { type: String, default: '2D/3D' },
  seatCapacity: { type: String, default: '' },
  facilities: { type: [String], default: [] },
  bookingUrl: { type: String, default: '' },
  reviewsCount: { type: Number, default: 0 },

  // Location Details & Custom Info
  mapUrl: { type: String, default: '' },
  aboutUs: { type: String, default: '' },
  menu: [{
    name: { type: String, default: '' },
    price: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: '' }
  }],

  // Food Hub / Restaurants Specific Fields
  cuisineType: { type: String, default: '' },
  priceCategory: { type: String, default: '$$' },
  avgCostPerTwo: { type: String, default: '0' },
  deliveryAvailable: { type: Boolean, default: false },

  // Dayout / Hotels Specific Fields
  dayoutPackagePrice: { type: String, default: '0' },
  activities: { type: [String], default: [] },

  // Amenities Checkboxes
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

  // Image Management
  images: { type: [String], default: [] },
  image: { type: String, default: '' },

  // Approval & Ownership Status
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isApproved: { type: Boolean, default: false },
  pointsAwarded: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  searchCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;
