import Item from '../models/Item.js';
import User from '../models/User.js';
import {
  isValidHotelCategory,
  normalizeLegacyHotelCategory
} from '../constants/hotelCategories.js';
// @desc    Get items created by logged-in seller
// @route   GET /api/seller/items
export const getSellerItems = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const items = await Item.find({ createdBy: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new item by seller
// @route   POST /api/seller/items
export const createSellerItem = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const payload = { ...req.body };

    if (!payload.name || !payload.location || !payload.district || !payload.category || !payload.contact) {
      return res.status(400).json({ success: false, message: "Please provide name, location, district, category and contact." });
    }

    if (payload.category === 'hotels') {
      const legacy = normalizeLegacyHotelCategory(payload.subCategory);
      payload.hotelType = payload.hotelType || legacy.hotelType;
      payload.hotelTier = payload.hotelTier || legacy.hotelTier;

      if (!isValidHotelCategory(payload.hotelType, payload.hotelTier, payload.subCategory)) {
        return res.status(400).json({ success: false, message: 'Please select a valid hotel type, tier and category.' });
      }
    }

    // Never trust a client-supplied approval flag.
    delete payload.isApproved;
    delete payload.status;
    delete payload.createdBy;
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    const newItem = await Item.create({
      ...payload,
      name: payload.name.trim(),
      title: payload.title || payload.name.trim(),
      contact: String(payload.contact).trim(),
      isApproved: false,
      status: 'pending',
      createdBy: userId
    });

    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { points: 1 } }, { new: true });

    return res.status(201).json({
      success: true,
      message: "Submitted successfully. Your listing is waiting for Admin approval.",
      points: updatedUser ? updatedUser.points : 0,
      data: newItem
    });
  } catch (error) {
    console.error('Seller create item error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update seller item
// @route   PUT /api/seller/items/:id
export const updateSellerItem = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const item = await Item.findOne({ _id: id, createdBy: userId });
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found or unauthorized" });
    }

    let updateData = { ...req.body };

    if (item.category === 'hotels') {
      const legacy = normalizeLegacyHotelCategory(updateData.subCategory);
      updateData.hotelType = updateData.hotelType || legacy.hotelType;
      updateData.hotelTier = updateData.hotelTier || legacy.hotelTier;
      if (!isValidHotelCategory(updateData.hotelType, updateData.hotelTier, updateData.subCategory)) {
        return res.status(400).json({ success: false, message: 'Please select a valid hotel type, tier and category.' });
      }
    }

    updateData.isApproved = false;
    updateData.status = 'pending';

    const updatedItem = await Item.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    return res.status(200).json({ success: true, message: "Listing updated and submitted for admin review.", data: updatedItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
