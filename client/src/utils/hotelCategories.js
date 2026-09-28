export const HOTEL_CATEGORY_TREE = {
    Indoor: {
        Budget: [
            'City Hostels / Backpackers',
            'Guest Houses & Budget Hotels',
            'Homestays'
        ],
        Luxury: [
            '5-Star Business & City Hotels',
            'Boutique Hotels',
            'Serviced Apartments'
        ]
    },
    Outdoor: {
        Budget: [
            'Eco-Lodges / Tree Houses',
            'Camping Sites & Glamping',
            'Estate Bungalows'
        ],
        Luxury: [
            'Wild Safari Lodges',
            'Hill Country Luxury Resorts',
            'Beach Resorts & Villas'
        ]
    }
};

export const HOTEL_TYPES = Object.keys(HOTEL_CATEGORY_TREE);
export const HOTEL_TIERS = ['Budget', 'Luxury'];

export const getHotelCategories = (hotelType, hotelTier) => {
    if (!hotelType || !hotelTier) return [];
    return HOTEL_CATEGORY_TREE[hotelType]?.[hotelTier] || [];
};

// Supports older records such as "Indoor Luxury" / "Outdoor Budget".
export const getLegacyHotelMeta = (subCategory = '') => {
    const value = String(subCategory).trim().toLowerCase();
    const hotelType = value.startsWith('indoor') ? 'Indoor' : value.startsWith('outdoor') ? 'Outdoor' : '';
    const hotelTier = value.includes('luxury') ? 'Luxury' : value.includes('budget') ? 'Budget' : '';
    return { hotelType, hotelTier };
};
