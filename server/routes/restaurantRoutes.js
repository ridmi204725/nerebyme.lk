import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
import Item from '../models/Item.js'; //

const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all items with search, district, city, category, and subCategory filters
// 🔓 Public / Admin
router.get('/', async (req, res) => {
  try {
    const { search, district, city, category, subCategory, isApproved } = req.query;


    let query = { category: category || 'food-hub' };

    // 1. Sub Category Filter (Sri Lankan, Indian )
    if (subCategory && subCategory !== 'All' && subCategory !== 'සියල්ල' && subCategory !== 'அனைத்தும்') {
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
    }

    // 2. Admin Approved Filter
    if (isApproved === 'true') {
      query.isApproved = true;
    } else if (isApproved === 'false') {
      query.isApproved = false;
    } else if (isApproved === 'all') {

    } else {
      // Default Public View: Approved ඒවා පමණි
      query.isApproved = true;
    }

    // 3. දිස්ත්‍රික්කය අනුව සෙවීම
    if (district && district !== 'All Districts' && district !== 'සියලුම දිස්ත්‍රික්ක' && district !== 'සියලු දිස්ත්‍රික්ක') {
      query.district = district;
    }

    // 4. නගරය අනුව සෙවීම (Maps to 'location')
    if (city && city !== 'All Cities') {
      query.location = city;
    }

    // 5. Text Search සහ Search Count Update කිරීම
    if (search && search.trim() !== '') {
      query.name = { $regex: search, $options: 'i' };

      let searchUpdateQuery = { name: { $regex: search, $options: 'i' }, category: query.category };

      Item.updateMany(searchUpdateQuery, { $inc: { searchCount: 1 } })
        .catch(err => console.error("Error updating restaurant search count:", err));
    }

    // Popularity (searchCount) අනුව Sort කර දත්ත ලබාගැනීම
    const restaurants = await Item.find(query).sort({ searchCount: -1 });

    res.status(200).json({ success: true, data: restaurants || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching restaurants", error: error.message });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get a single restaurant profile by ID
// 🔓 Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Item.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant records not found" });
    }

    // Background searchCount increment
    Item.findByIdAndUpdate(req.params.id, { $inc: { searchCount: 1 } })
      .catch(err => console.error("Error incrementing single view count:", err));

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error retrieving restaurant profile", error: error.message });
  }
});

// @route   POST /api/restaurants
// @desc    Create/Add a new restaurant profile record
// 🔒 Private (Authenticated Users Can Add)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, location, district, category, subCategory, contact, price, image, isApproved } = req.body;

    if (!name || !location || !district) {
      return res.status(400).json({ success: false, message: "Required profile configuration elements missing" });
    }

    const cleanPrice = price ? price.toString().replace(/[^0-9]/g, '') : "0";

    // User කෙනෙක්ද Admin කෙනෙක්ද කියා බැලීම
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.userRole === 'admin');

    const newRestaurant = new Item({
      name,
      title: name,
      location,
      district,
      category: category || 'food-hub',
      subCategory: subCategory || 'General',
      contact,
      price: cleanPrice,
      rating: "5.0",
      searchCount: 0,
      // Admin කෙනෙක් දැම්මොත් කෙලින්ම approve වේ, සාමාන්‍ය පරිශීලකයෙක් දැම්මොත් false වේ
      isApproved: isAdmin ? (isApproved !== undefined ? isApproved : true) : false,
      image: image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500",
      createdBy: req.user ? (req.user.id || req.user._id) : null
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json({ success: true, message: "Restaurant profile registered successfully", data: savedRestaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server transaction processing failure", error: error.message });
  }
});

// @route   DELETE /api/restaurants/:id
// @desc    Delete a restaurant by ID
// 🔒 Private (Admins Only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedRestaurant = await Item.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, message: "Restaurant deleted successfully by Admin" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during deletion", error: error.message });
  }
});

export default router;