import Item from '../models/Item.js';

// @desc    Create new item (Supports both User & Admin submissions)
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
      functionType, // 🌟 Frontend එකෙන් එන functionType
      bookingUrl,   // 🌟 Frontend එකෙන් එන bookingUrl
      ...extraFields
    } = req.body;

    if (!name || !location || !district || !category || !contact) {
      return res.status(400).json({ success: false, message: "Required fields missing (Name, Location, District, Category, or Contact)" });
    }

    const isAdmin = req.user && (req.user.role === 'admin' || req.user.userRole === 'admin');
    const finalApprovalStatus = isAdmin ? (isApproved !== undefined ? isApproved : true) : false;

    let processedFacilities = facilities;
    if ((category === 'movie-theaters' || category === 'movie-theater') && facilities) {
      if (typeof facilities === 'string') {
        processedFacilities = facilities.split(',').map(f => f.trim()).filter(Boolean);
      }
    }

    const finalTicketPrice = ticketPrice || price || '0';
    const cleanPrice = finalTicketPrice.toString().replace(/[^0-9]/g, '');

    const newItem = await Item.create({
      name,
      title: name,
      location,
      district,
      category,
      subCategory: subCategory || 'Standard',
      price: cleanPrice,
      ticketPrice: cleanPrice,
      contact,
      image: image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500',
      isApproved: finalApprovalStatus,
      createdBy: req.user ? (req.user.id || req.user._id) : null,
      facilities: processedFacilities,
      functionType: functionType || (category === 'functions' ? 'venue_booking' : undefined), // 🌟 DB එකට ලියවීම
      bookingUrl: bookingUrl || '', // 🌟 DB එකට ලියවීම
      ...extraFields
    });

    return res.status(201).json({
      success: true,
      message: isAdmin ? "Item created successfully" : "Submitted successfully! Pending Admin approval.",
      data: newItem
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all items for admin listing
export const getItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      if (category === 'movie-theaters' || category === 'movie-theater') {
        query.category = { $in: ['movie-theaters', 'movie-theater'] };
      } else {
        query.category = category;
      }
    }

    if (search && search.trim() !== '') {
      query.name = { $regex: search, $options: 'i' };
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item details or approve status
// @route   PUT /api/admin/items/:id
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.userRole === 'admin');
    let updateData = { ...req.body };

    if (!isAdmin && updateData.isApproved !== undefined) {
      delete updateData.isApproved;
    }

    if (updateData.facilities) {
      if (typeof updateData.facilities === 'string') {
        updateData.facilities = updateData.facilities.split(',').map(f => f.trim()).filter(Boolean);
      }
    }

    if (updateData.ticketPrice || updateData.price) {
      const rawPrice = updateData.ticketPrice || updateData.price;
      const cleanPrice = rawPrice.toString().replace(/[^0-9]/g, '');
      updateData.price = cleanPrice;
      updateData.ticketPrice = cleanPrice;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({ success: true, message: "Item updated successfully", data: updatedItem });
  } catch (error) {
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
    return res.status(500).json({ success: false, message: error.message });
  }
};