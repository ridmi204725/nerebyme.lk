import express from 'express';
import { addReview } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// User-facing endpoint for authenticated comments/reviews.
router.post('/items/:id/reviews', verifyToken, addReview);

export default router;
