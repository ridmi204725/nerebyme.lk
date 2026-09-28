// 🔑 වෙනම Offer model එක වෙනුවට පොදු Item model එක import කරගන්න
import Item from '../models/Item.js';

// @desc    Get all offers (Public & Admin support)
// @route   GET /api/offers
// @access  Public
export const getOffers = async (req, res, next) => {
    try {
        const { subCategory, district, isApproved } = req.query;

        // 1. මූලිකවම category එක 'offer' හෝ 'offers' වන ඒවා තෝරා ගැනීමට සකසයි
        let query = { category: { $in: ['offer', 'offers'] } };

        // 2. Admin Approval filter එක පාලනය කිරීම
        if (isApproved === 'true') {
            query.isApproved = true;
        } else if (isApproved === 'false') {
            query.isApproved = false;
        } else if (isApproved === 'all') {
            // Admin dashboard එක සඳහා Approved + Pending සියල්ලම ලබා දෙයි
        } else {
            // සාමාන්‍ය පරිශීලකයන්ට (Public View) පෙන්වන්නේ Approve කරන ලද ඒවා පමණි
            query.isApproved = true;
        }

        // 3. Sub Category Filter (e.g., 'Seasonal', 'Bank Offers')
        if (subCategory && subCategory !== 'All' && subCategory !== 'සියල්ල') {
            query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') };
        }

        // 4. District Filter
        if (district && district !== 'All Districts' && district !== 'සියලුම දිස්ත්‍රික්ක') {
            query.district = district;
        }

        // අලුත්ම දත්ත මුලට එන සේ Sort කර ලබා ගැනීම (-1)
        const offers = await Item.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: offers.length,
            data: offers || []
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private (Admin Only)
export const createOffer = async (req, res, next) => {
    try {
        const { name, location, district, subCategory, price, image, contact, isApproved } = req.body;

        // Required fields තිබේදැයි පරික්ෂා කිරීම
        if (!name || !location || !district || !subCategory || !contact) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, location, district, subCategory, and contact."
            });
        }

        // 🛡️ Request එක එවන්නේ Admin කෙනෙක්දැයි Backend එකෙන් තහවුරු කරගැනීම
        const isAdmin = req.user && req.user.role === 'admin';

        const newOffer = await Item.create({
            name,
            title: name,
            location,
            district,
            category: 'offer',
            subCategory,
            price: price || '0',
            contact,
            rating: "5.0",
            searchCount: 0,
            // Admin කෙනෙක් නම් body එකෙන් එවන අගය හෝ true අගය ගනී, නැතහොත් false වේ
            isApproved: isAdmin ? (isApproved !== undefined ? isApproved : true) : false,
            image: image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500',
            createdBy: req.user ? req.user.id : null // ස්ථානය ඇතුළත් කළ පුද්ගලයා සටහන් කරගැනීමට
        });

        return res.status(201).json({
            success: true,
            message: isAdmin ? "Offer created successfully" : "Submitted successfully! Pending Admin approval.",
            data: newOffer
        });
    } catch (err) {
        next(err);
    }
};