import Item from '../models/Item.js'; // Item Model එක import කරන්න

// @desc    Get all approved movie theaters
// @route   GET /api/movie-theaters
// @access  Public
export const getTheaters = async (req, res) => {
  try {
    const { search, district, city, subCategory, isApproved } = req.query;

    // 1. Initially set to filter items where category is strictly associated with movie theaters
    let query = { category: { $in: ['movie-theater', 'movie-theaters'] } };

    // 2. Control the Admin Approval filter
    if (isApproved === 'true') {
      query.isApproved = true;
    } else if (isApproved === 'false') {
      query.isApproved = false;
    } else if (isApproved === 'all') {
      // Returns both Approved + Pending for the Admin list
    } else {
      // Default fallback: return only approved items to the public
      query.isApproved = true;
    }

    // 3. Sub Category Filter (e.g., 'IMAX', '3D')
    if (subCategory && subCategory !== 'All' && subCategory !== 'සියල්ල' && subCategory !== 'අனைத்தும்') {
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
    }

    // 4. District Filter
    if (district && district !== 'All Districts' && district !== 'සියලුම දිස්ත්‍රික්ක' && district !== 'සියලු දිස්ත්‍රික්ක') {
      query.district = district;
    }

    // 5. City Filter (Maps to 'location' field in Schema)
    if (city) {
      query.location = city;
    }

    // 6. Search query filter & Search Count Incrementor
    if (search && search.trim() !== '') {
      query.name = { $regex: search, $options: 'i' };

      // Increment searchCount in the background
      Item.updateMany(
        { category: { $in: ['movie-theater', 'movie-theaters'] }, name: { $regex: search, $options: 'i' } },
        { $inc: { searchCount: 1 } }
      ).catch(err => console.error("Error updating theater search count:", err));
    }

    // 7. Fetch data and sort by highest popularity (searchCount) followed by the newest items
    const theaters = await Item.find(query).sort({ searchCount: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: theaters.length,
      data: theaters || []
    });

  } catch (error) {
    console.error("Error in getTheaters:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error: Unable to fetch movie theaters"
    });
  }
};

// @desc    Create new movie theater
// @route   POST /api/movie-theaters
// @access  Private (User/Admin both)
export const createTheater = async (req, res) => { // 👈 මෙන්න මේ function එක නැති නිසයි කලින් error එක ආවේ!
  try {
    const { name, location, district, subCategory, contact, image } = req.body;

    // 1. Required fields පරීක්ෂාව
    if (!name || !location || !district || !subCategory || !contact) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, location, district, subCategory, and contact."
      });
    }

    const isAdmin = req.user && req.user.role === 'admin';

    // 2. පොදු Item එකක් විදිහට DB එකේ සේව් කිරීම
    const newTheater = await Item.create({
      name,
      title: name,
      location,
      district,
      category: 'movie-theater', // Category එක 'movie-theater' ලෙස Auto-set වේ
      subCategory,
      contact,
      price: '0',
      rating: "5.0",
      searchCount: 0,
      isApproved: isAdmin ? true : false, // Admin කෙනෙක් දැම්මොත් auto-approve වේ
      image: image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500', // Default image
      createdBy: req.user ? req.user.id : null
    });

    res.status(201).json({
      success: true,
      message: isAdmin ? "Theater created successfully!" : "Theater submitted successfully! Awaiting admin approval.",
      data: newTheater
    });

  } catch (error) {
    console.error("Error in createTheater:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error creating theater"
    });
  }
};