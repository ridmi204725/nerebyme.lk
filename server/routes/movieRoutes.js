import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getTheaters, createTheater } from '../controllers/movieController.js'; // 👈 ඔයාගේ movieController.js එක ඇතුළත Item model එකෙන් දත්ත ගන්නා නව controller functions

const router = express.Router();

// 🌐 Route definitions
router.get('/', getTheaters);
router.post('/', verifyToken, createTheater);

// 📤 Router එක export කිරීම (ES Module)
export default router;