import Item from '../models/Item.js';
import User from '../models/User.js';

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
    const { name, location, district, category, subCategory, contact, image, description, menu, mapUrl, aboutUs, facilities } = req.body;

    if (!name || !location || !district || !category || !contact) {
      return res.status(400).json({ success: false, message: "Please provide required fields: name, location, district, category, contact" });
    }

    const newItem = await Item.create({
      name: name.trim(),
      title: name.trim(),
      location,
      district,
      category,
      subCategory: subCategory || 'Standard',
      contact: contact.trim(),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500',
      mapUrl: mapUrl || '',
      aboutUs: aboutUs || '',
      facilities: facilities || [],
      menu: menu || [],
      isApproved: false,
      status: 'pending',
      createdBy: userId
    });

    // Award 1 point
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { points: 1 } }, { new: true });

    return res.status(201).json({
      success: true,
      message: "Listing submitted successfully! Pending admin approval.",
      points: updatedUser ? updatedUser.points : 0,
      data: newItem
    });
  } catch (error) {
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
    updateData.isApproved = false;
    updateData.status = 'pending';

    const updatedItem = await Item.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    return res.status(200).json({ success: true, message: "Listing updated and submitted for admin review.", data: updatedItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
