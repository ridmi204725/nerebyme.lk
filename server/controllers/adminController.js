import Item from '../models/Item.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {
  isValidHotelCategory,
  normalizeLegacyHotelCategory,
  HOTEL_CATEGORIES
} from '../constants/hotelCategories.js';
// @desc    Create new item
export const createItem = async (req, res) => {
  try {
    const {
      name,
      location,
      district,
      category,
      subCategory,
      hotelType,
      hotelTier,
      price,
      ticketPrice,
      image,
      contact,
      isApproved,
      facilities,
      functionType,
      bookingUrl,
      mapUrl,
      aboutUs,
      movieType,
      menu,
      roomTypes,
      amenities,
      ...extraFields
    } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Name/Title must be at least 3 characters long." });
    }

    if (!location || !district || !category || !contact) {
      return res.status(400).json({ success: false, message: "Required fields missing (Location, District, Category, or Contact)" });
    }

    let finalHotelType = hotelType || '';
    let finalHotelTier = hotelTier || '';
    if (category === 'hotels' && (!finalHotelType || !finalHotelTier)) {
      const legacy = normalizeLegacyHotelCategory(subCategory);
      finalHotelType = finalHotelType || legacy.hotelType;
      finalHotelTier = finalHotelTier || legacy.hotelTier;
    }

    if (category === 'hotels' && (!isValidHotelCategory(finalHotelType, finalHotelTier, subCategory))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel category. Select Indoor/Outdoor, Budget/Luxury and a valid hotel category.'
      });
    }

    const isAdmin = req.user && (req.user.role === 'admin' || req.user.userRole === 'admin');
    const finalApprovalStatus = isAdmin ? (isApproved !== undefined ? isApproved : true) : false;
    const finalStatus = finalApprovalStatus ? 'approved' : 'pending';

    let processedFacilities = facilities;
    if (facilities && typeof facilities === 'string') {
      processedFacilities = facilities.split(',').map(f => f.trim()).filter(Boolean);
    }

    let processedRoomTypes = roomTypes;
    if (roomTypes && typeof roomTypes === 'string') {
      processedRoomTypes = roomTypes.split(',').map(r => r.trim()).filter(Boolean);
    }

    const finalPriceVal = price || ticketPrice || '0';
    const cleanPrice = finalPriceVal.toString().replace(/[^0-9]/g, '');

    const newItem = await Item.create({
      name: name.trim(),
      title: name.trim(),
      location,
      district,
      category,
      subCategory: subCategory || 'Standard',
      hotelType: category === 'hotels' ? finalHotelType : '',
      hotelTier: category === 'hotels' ? finalHotelTier : '',
      price: cleanPrice,
      ticketPrice: cleanPrice,
      contact: contact.trim(),
      image: image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500',
      isApproved: finalApprovalStatus,
      status: finalStatus,
      createdBy: req.user ? (req.user.id || req.user._id) : null,
      facilities: processedFacilities || [],
      roomTypes: processedRoomTypes || [],
      amenities: amenities || {},
      bookingUrl: bookingUrl || '',
      mapUrl: mapUrl || '',
      aboutUs: aboutUs || '',
      movieType: movieType || 'public',
      menu: menu || [],
      ...extraFields
    });

    let userPoints = 0;
    if (req.user && (req.user.id || req.user._id)) {
      const userId = req.user.id || req.user._id;
      const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { points: 1 } }, { new: true });
      if (updatedUser) {
        userPoints = updatedUser.points;
      }
    }

    return res.status(201).json({
      success: true,
      message: isAdmin ? "Item created successfully" : "Submitted successfully! Pending Admin approval.",
      points: userPoints,
      data: newItem
    });
  } catch (error) {
    console.error("Create Item Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all items for admin listing
export const getItems = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = {};

    if (category && category !== 'All') {
      if (category === 'movie-theaters' || category === 'movie-theater') {
        query.category = { $in: ['movie-theaters', 'movie-theater'] };
      } else {
        query.category = category;
      }
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      query.name = { $regex: search,$options: 'i' };
    }

    const items = await Item.find(query).populate('createdBy', 'fullName email phone role').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Get Items Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single item by ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Item ID format" });
    }

    // Public detail pages must never expose pending/rejected submissions.
    // Admins can still inspect every record when a valid admin token is supplied.
    let isAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'secret_key');
        isAdmin = decoded?.role === 'admin' || decoded?.userRole === 'admin';
      } catch (_) {}
    }

    const item = await Item.findOne(isAdmin ? { _id: id } : { _id: id, isApproved: true });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: isAdmin ? "Item not found" : "This listing is not available yet."
      });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Get Item By ID Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item details or approve/reject status
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Item ID format" });
    }

    const updateData = { ...req.body };

    if (updateData.category === 'hotels') {
      const legacy = normalizeLegacyHotelCategory(updateData.subCategory);
      updateData.hotelType = updateData.hotelType || legacy.hotelType;
      updateData.hotelTier = updateData.hotelTier || legacy.hotelTier;
      if (!isValidHotelCategory(updateData.hotelType, updateData.hotelTier, updateData.subCategory)) {
        return res.status(400).json({ success: false, message: 'Invalid hotel type, tier or category.' });
      }
    }

    // ආරක්ෂාව සඳහා _id වෙනස්වීම වැළැක්වීම
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (updateData.status) {
      updateData.isApproved = updateData.status === 'approved';
    } else if (updateData.isApproved !== undefined) {
      updateData.status = updateData.isApproved ? 'approved' : 'pending';
    }

    const updatedItem = await Item.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: false } // runValidators false කිරීම මඟින් schema validation error වීම වළකයි
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({ success: true, message: "Item updated successfully", data: updatedItem });
  } catch (error) {
    console.error("Update Item Error Details:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review to an item
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Item ID format" });
    }

    const { name, rating, comment, date } = req.body;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (!item.reviews) {
      item.reviews = [];
    }

    const numericRating = Number(rating) || 5;
    const newReview = {
      name: name || 'Guest',
      rating: numericRating,
      comment: comment || '',
      review: comment || '',
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userId: req.user?.id || req.user?._id || null,
      userEmail: req.user?.email || '',
      userName: req.user?.fullName || name || 'Guest'
    };

    item.reviews.unshift(newReview);

    const totalRating = item.reviews.reduce((acc, rev) => acc + (rev.rating || 5), 0);
    item.rating = Number((totalRating / item.reviews.length).toFixed(1));
    item.reviewsCount = item.reviews.length;

    await item.save();

    return res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: item.reviews
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin review management
export const getAllReviews = async (req, res) => {
  try {
    const items = await Item.find({ 'reviews.0': { $exists: true } })
      .select('name category reviews createdBy')
      .populate('createdBy', 'fullName email');
    const reviews = [];
    for (const item of items) {
      for (const review of (item.reviews || [])) {
        reviews.push({
          itemId: item._id,
          itemName: item.name,
          category: item.category,
          review
        });
      }
    }
    reviews.sort((a, b) => String(b.review.date || '').localeCompare(String(a.review.date || '')));
    return res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid item/review ID.' });
    }
    const { name, comment, rating, date } = req.body;
    const item = await Item.findOne({ _id: id, 'reviews._id': reviewId });
    if (!item) return res.status(404).json({ success: false, message: 'Review not found.' });
    const review = item.reviews.id(reviewId);
    if (name !== undefined) review.name = String(name).trim();
    if (comment !== undefined) {
      review.comment = String(comment);
      review.review = String(comment);
    }
    if (rating !== undefined) review.rating = Math.min(5, Math.max(1, Number(rating) || 5));
    if (date !== undefined) review.date = date;
    await item.save();
    item.rating = item.reviews.length ? Number((item.reviews.reduce((a, r) => a + (Number(r.rating) || 5), 0) / item.reviews.length).toFixed(1)) : 5;
    item.reviewsCount = item.reviews.length;
    await item.save();
    return res.json({ success: true, message: 'Review updated successfully.', data: review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid item/review ID.' });
    }
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    const review = item.reviews.id(reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    review.deleteOne();
    item.reviewsCount = item.reviews.length;
    item.rating = item.reviews.length ? Number((item.reviews.reduce((a, r) => a + (Number(r.rating) || 5), 0) / item.reviews.length).toFixed(1)) : 5;
    await item.save();
    return res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Item ID format" });
    }

    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete Item Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk approve items
export const bulkApproveItems = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No item IDs provided" });
    }

    await Item.updateMany({ _id: { $in: ids } }, {$set: { isApproved: true, status: 'approved' } });
    return res.status(200).json({ success: true, message: `Successfully approved ${ids.length} items` });
  } catch (error) {
    console.error("Bulk Approve Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk delete items
export const bulkDeleteItems = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No item IDs provided" });
    }

    await Item.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: `Successfully deleted ${ids.length} items` });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role or points
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const { role, points } = req.body;
    let updateData = {};
    if (role !== undefined) updateData.role = role;
    if (points !== undefined) updateData.points = points;

    const user = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending seller requests
export const getPendingSellers = async (req, res) => {
  try {
    const users = await User.find({ sellerStatus: 'pending' }).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("Get Pending Sellers Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject seller request
export const approveSeller = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const user = await User.findByIdAndUpdate(
        id,
        { $set: { sellerStatus: status, role: status === 'approved' ? 'seller' : 'user' } },
        { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: `Seller request ${status} successfully`, data: user });
  } catch (error) {
    console.error("Approve Seller Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add an admin-managed package/menu/promotional image
export const addPackageImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title = '', description = '', url } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid item ID' });
    if (!url || typeof url !== 'string') return res.status(400).json({ success: false, message: 'Package image is required' });

    const item = await Item.findByIdAndUpdate(
        id,
        { $push: { packageImages: { title, description, url } } },
        { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    return res.status(201).json({ success: true, message: 'Package image added', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePackageImage = async (req, res) => {
  try {
    const { id, packageId } = req.params;
    const { title, description, url } = req.body;
    const item = await Item.findOneAndUpdate(
        { _id: id, 'packageImages._id': packageId },
        { $set: {
            'packageImages.$.title': title ?? '',
            'packageImages.$.description': description ?? '',
            'packageImages.$.url': url
          }},
        { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Package image not found' });
    return res.status(200).json({ success: true, message: 'Package image updated', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePackageImage = async (req, res) => {
  try {
    const { id, packageId } = req.params;
    const item = await Item.findByIdAndUpdate(
        id,
        { $pull: { packageImages: { _id: packageId } } },
        { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    return res.status(200).json({ success: true, message: 'Package image deleted', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
