import express from 'express';
import { getOffers, createOffer } from '../controllers/offerController.js';
// 🔑 ආරක්ෂක middleware දෙක import කරගන්න (ඔබේ ව්‍යාපෘතියේ නිවැරදි path එක ලබා දෙන්න)
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getOffers) // 🔓 Public: ඕනෑම කෙනෙකුට Offers බලාගත හැක
    .post(verifyToken, verifyAdmin, createOffer); // 🔒 Protected: Admin කෙනෙකුට පමණක් Offers සෑදිය හැක

export default router;