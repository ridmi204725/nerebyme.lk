import Item from '../models/Item.js';
import User from '../models/User.js';

// @desc    Create new item (Supports both User & Admin submissions with Hotel & Room specific features)
// @route   POST /api/admin/items
export const createItem = async (req, res) => {
  try {
    const {
      name,
      location,
      district,
      category,
      subCategory,
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
      checkInTime,
      checkOutTime,
      amenities,
      ...extraFields
    } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Name/Title must be at least 3 characters long." });
    }

    if (!location || !district || !category || !contact) {
      return res.status(400).json({ success: false, message: "Required fields missing (Location, District, Category, or Contact)" });
    }

    const phoneClean = contact.replace(/[\s\-\(\)]/g, '');
    if (!/^(?:\+94|0)?7[0-9]{8}$\vert{}^(?:\+94\vert{}0)?[1-9][0-9]{8}$/.test(phoneClean)) {
      return res.status(400).json({ success: false, message: "Invalid Contact Number format." });
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

    let processedMenu = [];
    if (menu) {
      if (typeof menu === 'string') {
        if (menu.startsWith('http://') || menu.startsWith('https://')) {
          processedMenu = [];
        } else {
          processedMenu = menu.split(/[\n,]/).map(itemStr => {
            const parts = itemStr.split(/[-:]/);
            return {
              name: parts[0] ? parts[0].trim() : itemStr.trim(),
              price: parts[1] ? parts[1].trim() : '',
              description: '',
              category: ''
            };
          }).filter(m => m.name);
        }
      } else if (Array.isArray(menu)) {
        processedMenu = menu;
      }
    }

    let processedAmenities = {};
    if (amenities && typeof amenities === 'object' && !Array.isArray(amenities)) {
      processedAmenities = amenities;
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
      price: cleanPrice,
      ticketPrice: cleanPrice,
      contact: contact.trim(),
      image: image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500',
      isApproved: finalApprovalStatus,
      status: finalStatus,
      createdBy: req.user ? (req.user.id || req.user._id) : null,
      facilities: processedFacilities || [],
      roomTypes: processedRoomTypes || [],
      amenities: processedAmenities,
      checkInTime: checkInTime || '14:00',
      checkOutTime: checkOutTime || '11:00',
      functionType: functionType || (category === 'functions' ? (["Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"].includes(subCategory) ? 'event_tickets' : 'venue_booking') : undefined),
      bookingUrl: bookingUrl || '',
      mapUrl: mapUrl || '',
      aboutUs: aboutUs || '',
      movieType: movieType || 'public',
      menu: processedMenu,
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
      message: isAdmin ? "Item created successfully" : "Submitted successfully! Pending Admin approval. You earned 1 reward point!",
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

    const items = await Item.find(query).sort({ createdAt: -1 });

    const ticketSubCats = ["Concerts", "Musical Shows", "Stage Plays", "Festivals", "Exhibitions"];
    const formattedData = items.map(item => {
      const doc = item.toObject ? item.toObject() : { ...item };
      if (doc.category === 'functions' && !doc.functionType) {
        doc.functionType = ticketSubCats.includes(doc.subCategory) ? 'event_tickets' : 'venue_booking';
      }
      return doc;
    });

    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    console.error("Get Items Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single item by ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
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
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.userRole === 'admin');
    let updateData = { ...req.body };

    if (!isAdmin && updateData.isApproved !== undefined) {
      delete updateData.isApproved;
    }

    if (updateData.status) {
      updateData.isApproved = updateData.status === 'approved';
    } else if (updateData.isApproved !== undefined) {
      updateData.status = updateData.isApproved ? 'approved' : 'pending';
    }

    if (updateData.facilities && typeof updateData.facilities === 'string') {
      updateData.facilities = updateData.facilities.split(',').map(f => f.trim()).filter(Boolean);
    }

    if (updateData.roomTypes && typeof updateData.roomTypes === 'string') {
      updateData.roomTypes = updateData.roomTypes.split(',').map(r => r.trim()).filter(Boolean);
    }

    let updateQuery = { $set: updateData };

    // මෙනු දත්තය ලින්ක් එකක් (URL) හෝ වැරදි ස්ට්‍රින්ග් එකක් ලෙස පැමිණියහොත් Mongoose දෝෂය වළක්වාලීමට එය සම්පූර්ණයෙන්ම ඉවත් කිරීම
    if (updateData.menu !== undefined) {
      if (typeof updateData.menu === 'string') {
        if (updateData.menu.startsWith('http://') || updateData.menu.startsWith('https://') || updateData.menu.trim() === '') {
          delete updateData.menu;
          delete updateQuery.$set.menu;
          updateQuery.$unset = { ...(updateQuery.$unset || {}), menu: "" };
        } else {
          updateData.menu = updateData.menu.split(/[\n,]/).map(itemStr => {
            const parts = itemStr.split(/[-:]/);
            return {
              name: parts[0] ? parts[0].trim() : itemStr.trim(),
              price: parts[1] ? parts[1].trim() : '',
              description: '',
              category: ''
            };
          }).filter(m => m.name);
          updateQuery.$set.menu = updateData.menu;
        }
      } else if (!Array.isArray(updateData.menu)) {
        delete updateData.menu;
        delete updateQuery.$set.menu;
        updateQuery.$unset = { ...(updateQuery.$unset || {}), menu: "" };
      }
    }

    if (updateData.amenities && (typeof updateData.amenities !== 'object' || Array.isArray(updateData.amenities))) {
      delete updateData.amenities;
      delete updateQuery.$set.amenities;
    }

    if (updateData.ticketPrice || updateData.price) {
      const rawPrice = updateData.ticketPrice || updateData.price;
      const cleanPrice = rawPrice.toString().replace(/[^0-9]/g, '');
      updateData.price = cleanPrice;
      updateData.ticketPrice = cleanPrice;
      updateQuery.$set.price = cleanPrice;
      updateQuery.$set.ticketPrice = cleanPrice;
    }

    delete updateQuery.$set._id;
    delete updateQuery.$set.createdAt;
    delete updateQuery.$set.updatedAt;

    const updatedItem = await Item.findByIdAndUpdate(
        id,
        updateQuery,
        { new: true, runValidators: true }
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

// @desc    Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.userRole === 'admin');

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
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

    const isAdmin = req.user && (req.user.role === 'admin' || req.user.userRole === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
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