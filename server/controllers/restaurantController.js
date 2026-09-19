import Item from '../models/Item.js'; //

export const getRestaurants = async (req, res) => {
  try {
    const { search, district, city, category, subCategory, isApproved } = req.query;
    let query = {};

    // 1. Main Category Filter ('food-hub' හෝ වෙනත් එකක්)
    if (category && category !== 'All') {
      query.category = category;
    }

    // 2. Sub Category Filter (English values: 'Sri Lankan', 'Indian', etc.)
    if (subCategory && subCategory !== 'All' && subCategory !== 'සියල්ල' && subCategory !== 'அனைத்தும்') {
      // Case-insensitive කිරීමට regex භාවිතා කිරීම වඩාත් ආරක්ෂිතයි
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
    }

    // 3. District & City Filters
    if (district && district !== 'All Districts' && district !== 'සියලුම දිස්ත්‍රික්ක' && district !== 'සියලු දිස්ත්‍රික්ක') {
      query.district = district;
    }

    // Frontend එකෙන් 'city' ආවොත් එය Schema එකේ 'location' වලට සිතියම් (Map) කිරීම
    if (city) {
      query.location = city;
    }

    // 4. Admin Approved Filter
    if (isApproved === 'true') {
      query.isApproved = true;
    } else if (isApproved === 'false') {
      query.isApproved = false;
    } else {
      // ✅ සාමාන්‍යයෙන් Frontend එකෙන් කිසිවක් නොඑවුවහොත් (Public view) Approved ඒවා පමණක් පෙන්වයි
      query.isApproved = true;
    }

    // 🎯 ✅ FIX: කලින් තිබූ 'buffalo-' යන අනවශ්‍ය කොටස ඉවත් කර නිවැරදි කරන ලදී.
    // 5. Search Filter & Optimized Search Count
    if (search && search.trim() !== '') {
      query.name = { $regex: search, $options: 'i' };

      // 'await' ඉවත් කර පසුබිමෙන් (Background) run වීමට හැරීම මඟින් Response වේගය වැඩි වේ
      let searchUpdateQuery = { name: { $regex: search, $options: 'i' } };
      if (query.category) searchUpdateQuery.category = query.category;

      Item.updateMany(searchUpdateQuery, { $inc: { searchCount: 1 } })
        .catch(err => console.error("Error updating restaurant search count:", err));
    }

    // දත්ත Sort කර ලබාගැනීම (Search Count එක වැඩිම ඒවා මුලට)
    const restaurants = await Item.find(query).sort({ searchCount: -1 });

    res.status(200).json({
      success: true,
      data: restaurants || []
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};