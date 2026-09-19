import Item from '../models/Item.js';

// @desc    Get all functions (venues/events) with advanced filters
// @route   GET /api/functions
export const getVenues = async (req, res) => {
  try {
    const { search, district, city, subCategory, maxCapacity, hasAC, isApproved, functionType } = req.query;
    let query = { category: 'functions' };

    // 🌟 ඉතා වැදගත්: frontend එකෙන් එන functionType එක නිවැරදිව query එකට ඇතුළත් කිරීම
    if (functionType) {
      query.functionType = functionType;
    }

    if (subCategory && subCategory !== 'All' && subCategory !== 'සියල්ල' && subCategory.trim() !== '') {
      let targetSubCategory = subCategory;
      if (subCategory === 'විවාහ උත්සව') targetSubCategory = 'Weddings';
      if (subCategory === 'ආයතනික උත්සව') targetSubCategory = 'Corporate Events';
      if (subCategory === 'උපන්දින') targetSubCategory = 'Birthdays';
      if (subCategory === 'සාද') targetSubCategory = 'Parties';
      if (subCategory === 'සම්මන්ත්‍රණ ශාලා') targetSubCategory = 'Conference Halls';
      if (subCategory === 'සංගීත ප්‍රසංග') targetSubCategory = 'Concerts';
      if (subCategory === 'සංගීත සංදර්ශන') targetSubCategory = 'Musical Shows';
      if (subCategory === 'වේදිකා නාට්‍ය') targetSubCategory = 'Stage Plays';
      if (subCategory === 'උත්සව') targetSubCategory = 'Festivals';
      if (subCategory === 'ප්‍රදර්ශන') targetSubCategory = 'Exhibitions';

      query.subCategory = { $regex: new RegExp(`^${targetSubCategory}$`, 'i') };
    }

    if (district && district !== 'All Districts' && district !== 'සියලු දිස්ත්‍රික්ක' && district !== 'සියලුම දිස්ත්‍රික්ක') {
      query.district = district;
    }

    if (city) {
      query.location = city;
    }

    if (maxCapacity) {
      query.capacity = { $gte: parseInt(maxCapacity, 10) };
    }

    if (hasAC === 'true' || hasAC === true) {
      query['amenities.hasAC'] = true;
    }

    if (isApproved === 'false' || isApproved === false) {
      query.isApproved = false;
    } else if (isApproved === 'all') {
      // Admin filter
    } else {
      query.isApproved = true;
    }

    if (search && search.trim() !== '') {
      query.name = { $regex: search, $options: 'i' };

      Item.updateMany(
        { category: 'functions', name: { $regex: search, $options: 'i' } },
        { $inc: { searchCount: 1 } }
      ).catch(err => console.error("Error updating functions search count:", err));
    }

    const venues = await Item.find(query).sort({ searchCount: -1, createdAt: -1 });
    return res.status(200).json({ success: true, count: venues.length, data: venues || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error fetching venues", error: error.message });
  }
};

// @desc    Create/Add a new venue or event
// @route   POST /api/functions
export const createVenue = async (req, res) => {
  try {
    const {
      name, location, district, category, subCategory, contact, price, priceType, image, address, capacity, amenities, images, functionType, bookingUrl
    } = req.body;

    if (!name || !location || !district || !contact) {
      return res.status(400).json({
        success: false,
        message: "Required fields (Name, Location, District, Contact) missing"
      });
    }

    const cleanPrice = price ? price.toString().replace(/[^0-9]/g, '') : '0';
    const cleanImages = Array.isArray(images) ? images.filter(url => url.trim() !== '') : [];

    const newVenue = new Item({
      name,
      title: name,
      location,
      district,
      category: 'functions',
      subCategory: subCategory || category || 'General',
      price: cleanPrice,
      priceType: priceType || 'hall_rent',
      contact,
      address: address || '',
      capacity: parseInt(capacity, 10) || 0,
      // 🌟 යූසර් කෙනෙක් ඇඩ් කරන විට එවනු ලබන functionType එක (venue_booking හෝ event_tickets) නිවැරදිව සේව් වීම
      functionType: functionType || 'venue_booking',
      bookingUrl: bookingUrl || '',
      amenities: {
        hasAC: amenities?.hasAC || false,
        hasParking: amenities?.hasParking || false,
        hasSoundSystem: amenities?.hasSoundSystem || false,
        hasPowerBackup: amenities?.hasPowerBackup || false,
        allowsExternalCatering: amenities?.allowsExternalCatering !== false,
        allowsAlcohol: amenities?.allowsAlcohol || false
      },
      images: cleanImages,
      image: image || cleanImages[0] || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500",
      isApproved: false,
      createdBy: req.user ? (req.user.id || req.user._id) : null
    });

    const savedVenue = await newVenue.save();
    return res.status(201).json({
      success: true,
      message: "Venue added successfully! Pending admin approval.",
      data: savedVenue
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error creating venue", error: error.message });
  }
};