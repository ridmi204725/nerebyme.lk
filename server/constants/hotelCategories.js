// server/constants/hotelCategories.js

export const HOTEL_TYPES = {
    INDOOR: 'Indoor',
    OUTDOOR: 'Outdoor'
};

export const HOTEL_TIERS = {
    BUDGET: 'Budget',
    LUXURY: 'Luxury'
};

export const HOTEL_CATEGORIES = {
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


/*
|--------------------------------------------------------------------------
| Check whether a hotel category is valid
|--------------------------------------------------------------------------
*/

export const isValidHotelCategory = (hotelType, hotelTier, subCategory) => {
    if (!hotelType || !hotelTier || !subCategory) {
        return false;
    }

    if (!HOTEL_CATEGORIES[hotelType]) {
        return false;
    }

    if (!HOTEL_CATEGORIES[hotelType][hotelTier]) {
        return false;
    }

    return HOTEL_CATEGORIES[hotelType][hotelTier].includes(subCategory);
};


/*
|--------------------------------------------------------------------------
| Convert old / legacy hotel category data
|--------------------------------------------------------------------------
*/

export const normalizeLegacyHotelCategory = (item = {}) => {
    let hotelType = item.hotelType || '';
    let hotelTier = item.hotelTier || '';
    let subCategory = item.subCategory || '';

    const oldCategory = String(subCategory).trim().toLowerCase();

    /*
     * Old Indoor categories
     */

    if (!hotelType) {
        if (
            oldCategory.includes('hostel') ||
            oldCategory.includes('backpacker') ||
            oldCategory.includes('guest house') ||
            oldCategory.includes('budget hotel') ||
            oldCategory.includes('homestay')
        ) {
            hotelType = HOTEL_TYPES.INDOOR;
            hotelTier = HOTEL_TIERS.BUDGET;
        }

        if (
            oldCategory.includes('5-star') ||
            oldCategory.includes('business') ||
            oldCategory.includes('city hotel') ||
            oldCategory.includes('boutique') ||
            oldCategory.includes('serviced apartment')
        ) {
            hotelType = HOTEL_TYPES.INDOOR;
            hotelTier = HOTEL_TIERS.LUXURY;
        }
    }

    /*
     * Old Outdoor categories
     */

    if (!hotelType) {
        if (
            oldCategory.includes('eco-lodge') ||
            oldCategory.includes('tree house') ||
            oldCategory.includes('camping') ||
            oldCategory.includes('glamping') ||
            oldCategory.includes('estate bungalow')
        ) {
            hotelType = HOTEL_TYPES.OUTDOOR;
            hotelTier = HOTEL_TIERS.BUDGET;
        }

        if (
            oldCategory.includes('safari') ||
            oldCategory.includes('hill country') ||
            oldCategory.includes('beach resort') ||
            oldCategory.includes('villa')
        ) {
            hotelType = HOTEL_TYPES.OUTDOOR;
            hotelTier = HOTEL_TIERS.LUXURY;
        }
    }

    /*
     * If old data already has Indoor / Outdoor + Budget / Luxury
     */

    if (
        hotelType &&
        hotelTier &&
        HOTEL_CATEGORIES[hotelType]?.[hotelTier]
    ) {
        const matchedCategory =
            HOTEL_CATEGORIES[hotelType][hotelTier].find(
                category =>
                    category.toLowerCase() === oldCategory
            );

        if (matchedCategory) {
            subCategory = matchedCategory;
        }
    }

    return {
        ...item,
        hotelType,
        hotelTier,
        subCategory
    };
};


/*
|--------------------------------------------------------------------------
| Get all hotel sub categories
|--------------------------------------------------------------------------
*/

export const getHotelSubCategories = (hotelType, hotelTier) => {
    return HOTEL_CATEGORIES[hotelType]?.[hotelTier] || [];
};


/*
|--------------------------------------------------------------------------
| Get complete hotel category structure
|--------------------------------------------------------------------------
*/

export const getHotelCategories = () => {
    return HOTEL_CATEGORIES;
};