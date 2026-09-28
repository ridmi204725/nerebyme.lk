import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getTravelDestinations, createTravelDestination } from '../controllers/travelController.js'; // 👈 Travel controller එක නිවැරදිව import කරගන්න

const router = express.Router();

// 🌐 Route definitions
router.get('/', getTravelDestinations); // Public access (සියලුම දෙනාට බලාගත හැක)
router.post('/', verifyToken, createTravelDestination); // Private access (Token එකක් අවශ්‍ය වේ)

// 📤 Router එක export කිරීම (ES Module)
export default router;