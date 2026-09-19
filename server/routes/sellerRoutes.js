import express from 'express';
const router = express.Router();
import { getSellerItems, createSellerItem, updateSellerItem } from '../controllers/sellerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.get('/items', verifyToken, getSellerItems);
router.post('/items', verifyToken, createSellerItem);
router.put('/items/:id', verifyToken, updateSellerItem);

export default router;
