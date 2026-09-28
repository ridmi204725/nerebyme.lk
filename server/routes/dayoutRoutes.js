import express from 'express';
// 🔑 Import the verifyToken middleware (make sure to provide the correct path where the middleware is located in your project)
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
import Item from '../models/Item.js';

const router = express.Router();

// @route   GET /api/dayouts
// @desc    Get all dayout packages with search, district, city, category, and subCategory filters
// 🔓 Public / Admin
router.get('/', async (req, res) => {
  try {
    const { search, district, city, subCategory, isApproved } = req.query;
    let query = {};

    // 1. Filter items where the category is strictly 'dayout'
    query.category = 'dayout';

    // 2. Sub Category Filter (e.g., 'Pool Access', 'Adventure')
    if (subCategory && subCategory !== 'All' && subCategory !== 'සියල්ල' && subCategory !== 'அனைத்தும்') {
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
    }

    // 3. District Filter
    if (district && district !== 'All Districts' && district !== 'සියලුම දිස්ත්‍රික්ක' && district !== 'සියලු දිස්ත්‍රික්ක') {
      query.district = district;
    }

    // 4. City (Location) Filter
    if (city) {
      query.location = city;
    }

    // 5. Admin Approval Filter
    if (isApproved === 'true') {
      query.isApproved = true;
    } else if (isApproved === 'false') {
      query.isApproved = false;
    } else if (isApproved === 'all') {
      // Disables filtering for the Admin Dashboard to show all Approved and Pending items
    } else {
      // Default: show only approved items on public user pages
      query.isApproved = true;
    }

    // 6. Search Filter & Search Count Incrementor
    if (search && search.trim() !== '') {
      query.name = { $regex: search, $options: 'i' };

      let searchUpdateQuery = { name: { $regex: search, $options: 'i' }, category: 'dayout' };
      Item.updateMany(searchUpdateQuery, { $inc: { searchCount: 1 } })
        .catch(err => console.error("Error updating dayout search count:", err));
    }

    // Sort items by highest search counts (popularity) first
    const dayouts = await Item.find(query).sort({ searchCount: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: dayouts || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching dayout packages", error: error.message });
  }
});

// @route   GET /api/dayouts/:id
// @desc    Get a single dayout package profile by ID
// 🔓 Public
router.get('/:id', async (req, res) => {
  try {
    const dayout = await Item.findOne({ _id: req.params.id, category: 'dayout' });

    if (!dayout) {
      return res.status(404).json({ success: false, message: "Dayout package records not found" });
    }

    res.status(200).json({ success: true, data: dayout });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error retrieving dayout package", error: error.message });
  }
});

// @route   POST /api/dayouts
// @desc    Create/Add a new dayout package
// 🔒 Private (Authenticated Users Only)
// 🛡️ FIX: Secured using verifyToken middleware
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, location, district, subCategory, price, image } = req.body;

    if (!name || !location || !district) {
      return res.status(400).json({ success: false, message: "Required package configuration elements missing" });
    }

    const cleanPrice = price ? price.toString().replace(/[^0-9]/g, '') : '0';

    const newDayout = new Item({
      name,
      title: name,
      location,
      district,
      category: 'dayout',
      subCategory: subCategory || 'General',
      price: cleanPrice,
      rating: "5.0",
      searchCount: 0,
      isApproved: false, // Set to false initially (until Admin approves it)
      image: image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
      createdBy: req.user ? req.user.id : null // ✅ FIX: Records the ID of the user who added the package
    });

    const savedDayout = await newDayout.save();
    res.status(201).json({ success: true, message: "Dayout package registered successfully. Awaiting Admin approval!", data: savedDayout });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server transaction processing failure", error: error.message });
  }
});

export default router;