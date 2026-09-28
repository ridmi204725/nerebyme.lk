// 🔑 වෙනම Travel model එක වෙනුවට පොදු Item model එක import කරගන්න
import Item from '../models/Item.js';

// @desc    Get all travel destinations
// @route   GET /api/travel
// @access  Public
export const getTravelDestinations = async (req, res, next) => {
    try {
        const { subCategory, district, city, search, isApproved } = req.query;

        // 1. මූලිකවම category එක 'travel' වන ඒවා පමණක් තෝරා ගැනීමට සකසයි
        let query = { category: 'travel' };

        // 2. Admin Approval filter එක පාලනය කිරීම
        if (isApproved === 'true') {
            query.isApproved = true;
        } else if (isApproved === 'false') {
            query.isApproved = false;
        } else if (isApproved === 'all') {
            // Admin dashboard එක සඳහා filter එකක් නොදමයි (Approved + Pending සියල්ලම එයි)
        } else {
            // සාමාන්‍ය පරිශීලකයන්ට (Public View) පෙන්වන්නේ Approve කරන ලද ඒවා පමණි
            query.isApproved = true;
        }

        // 3. Sub Category Filter (Case-Insensitive)
        if (subCategory && subCategory !== 'All' && subCategory !== 'සියල්ල') {
            query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
        }

        // 4. District Filter (Frontend එකෙන් එන සිංහල/ඉංග්‍රීසි "සියල්ල" පරීක්ෂාව සමඟ)
        if (district && district !== 'All Districts' && district !== 'සියලුම දිස්ත්‍රික්ක' && district !== 'සියලු දිස්ත්‍රික්ක') {
            query.district = district;
        }

        // 5. City/Location Filter (Frontend එකෙන් එන city අගය map කිරීම)
        if (city) {
            query.location = city;
        }

        // 6. Search Query Filter (Name හෝ Location අනුව)
        if (search && search.trim() !== '') {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];

            // සෙවුම් වාර ගණන (searchCount) පසුබිමෙන් වැඩි කිරීම
            Item.updateMany(
                { category: 'travel', name: { $regex: search, $options: 'i' } },
                { $inc: { searchCount: 1 } }
            ).catch(err => console.error("Error updating travel search count:", err));
        }

        // අලුත්ම දත්ත මුලට එන සේ Sort කර ලබා ගැනීම
        const destinations = await Item.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: destinations.length,
            data: destinations || []
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new travel destination
// @route   POST /api/travel
// @access  Private (User/Admin both)
export const createTravelDestination = async (req, res, next) => {
    try {
        const { name, location, district, category, subCategory, contact, image } = req.body;

        // 1. Required fields තිබේදැයි Backend එකෙන් double-check කිරීම
        if (!name || !location || !district || !subCategory || !contact) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, location, district, subCategory, and contact."
            });
        }

        // 🛡️ Request එක එවන්නේ Admin කෙනෙක්දැයි බැලීම
        const isAdmin = req.user && req.user.role === 'admin';

        // 2. අලුත් Item එකක් ලෙස නිර්මාණය කිරීම
        const newDestination = await Item.create({
            name,
            title: name,
            location,
            district,
            category: category || 'travel',
            subCategory,
            contact,
            price: '0',
            rating: "5.0",
            searchCount: 0,
            // Admin කෙනෙක් දැමුවහොත් auto-approve වන අතර, User කෙනෙක් දැමුවහොත් false වේ.
            isApproved: isAdmin ? true : false,
            image: image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500',
            createdBy: req.user ? req.user.id : null // Token එකෙන් ලැබෙන User ID එක සටහන් කරගැනීමට
        });

        res.status(201).json({
            success: true,
            message: isAdmin ? "Travel spot created successfully!" : "Travel spot submitted successfully! Awaiting admin approval.",
            data: newDestination
        });
    } catch (err) {
        console.error("Error creating travel destination:", err.message);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};