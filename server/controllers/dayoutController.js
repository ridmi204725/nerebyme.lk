import Item from '../models/Item.js';

export const getDayoutPackages = async (req, res) => {
  try {
    const { search, district, city, subCategory, isApproved } = req.query;

    // 1. Initially set to filter items where the category is strictly 'dayout'
    let query = { category: 'dayout' };

    // 2. Control the Admin Approval filter
    if (isApproved === 'true') {
      query.isApproved = true;
    } else if (isApproved === 'false') {
      query.isApproved = false;
    } else if (isApproved === 'all') {
      // Do not apply filter for the Admin dashboard (returns both Approved + Pending)
    } else {
      // Default fallback: return only approved items to the public
      query.isApproved = true;
    }

    // 3. Sub Category Filter (e.g., 'Pool Access', 'Adventure')
    if (subCategory && subCategory !== 'All' && subCategory !== 'සියල්ල' && subCategory !== 'அனைத்தும்') {
      // Exact case-insensitive match for the subCategory
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
    }

    // 4. District Filter
    if (district && district !== 'All Districts' && district !== 'සියලු දිස්ත්‍රික්ක' && district !== 'සියලුම දිස්ත්‍රික්ක') {
      query.district = district;
    }

    // 5. City Filter (Maps to 'location' field in Schema)
    if (city) {
      query.location = city;
    }

    // 6. Search query filter & Search Count Incrementor
    if (search && search.trim() !== '') {
      query.name = { $regex: search, $options: 'i' };

      // Increment searchCount in the background without blocking the performance/response line
      Item.updateMany(
        { category: 'dayout', name: { $regex: search, $options: 'i' } },
        { $inc: { searchCount: 1 } }
      ).catch(err => console.error("Error updating dayout search count:", err));
    }

    // 7. Fetch data and sort by highest popularity (searchCount) followed by the newest items
    const dayoutPackages = await Item.find(query).sort({ searchCount: -1, createdAt: -1 });

    // Send the successful envelope response
    return res.status(200).json({
      success: true,
      data: dayoutPackages || []
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};