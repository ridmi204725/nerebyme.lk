import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  // Core Required Fields
  name: { type: String, required: true },
  title: { type: String, default: '' },
  location: { type: String, required: true },
  district: { type: String, required: true },
  category: {
    type: String,
    required: true
  },
  subCategory: { type: String, default: '' },

  // Hotel classification: Indoor/Outdoor -> Budget/Luxury -> specific hotel category
  hotelType: { type: String, enum: ['', 'Indoor', 'Outdoor'], default: '' },
  hotelTier: { type: String, enum: ['', 'Budget', 'Luxury'], default: '' },
  contact: { type: String, required: true },
  address: { type: String, default: '' },
  description: { type: String, default: '' },

  // Event Halls (Functions) Specific Fields
  functionType: { type: String, default: 'venue_booking' },
  capacity: { type: Number, default: 0 },
  priceType: { type: String, default: 'hall_rent' },
  price: { type: String, default: '0' },

  // Movie Theaters Specific Fields
  movieType: { type: String, default: 'public' },
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
  menu: { type: mongoose.Schema.Types.Mixed, default: [] },
  // Admin-only promotional/package images shown on public detail pages after approval
  packageImages: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],

  // Reviews Management
  reviews: [{
    name: { type: String, default: '' },
    comment: { type: String, default: '' },
    review: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    date: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    userEmail: { type: String, default: '' },
    userName: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],

  // Food Hub / Restaurants Specific Fields
  cuisineType: { type: String, default: '' },
  priceCategory: { type: String, default: '$$' },
  avgCostPerTwo: { type: String, default: '0' },
  deliveryAvailable: { type: Boolean, default: false },

  // Dayout / Hotels Specific Fields
  dayoutPackagePrice: { type: String, default: '0' },
  activities: { type: [String], default: [] },
  roomTypes: { type: [String], default: [] },
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '11:00' },

  // Amenities Checkboxes / Flexible Object
  amenities: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Image Management
  images: { type: [String], default: [] },
  image: { type: String, default: '' },

  // Approval & Ownership Status
  status: { type: String, default: 'pending' },
  isApproved: { type: Boolean, default: false },
  pointsAwarded: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  searchCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 }
}, { timestamps: true, strict: false }); // strict: false මඟින් schema එකේ නැති අලුත් fields ආවත් සර්වර් එක crash වීම සම්පූර්ණයෙන්ම වළක්වයි.

const Item = mongoose.model('Item', itemSchema);
export default Item;