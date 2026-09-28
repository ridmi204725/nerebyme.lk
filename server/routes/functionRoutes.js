import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getVenues, createVenue } from '../controllers/functionController.js';

const router = express.Router();

// 🔓 Public endpoint to fetch premium venues & ticketed events
router.get('/', getVenues);

// 🔒 Authenticated users can submit new venues or events
router.post('/', verifyToken, createVenue);

export default router;