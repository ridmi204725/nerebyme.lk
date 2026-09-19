import express from 'express';
const router = express.Router();


import { createItem, getItems, updateItem, deleteItem } from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

router.post('/items', verifyToken, createItem);
router.get('/items', getItems);
router.put('/items/:id', verifyToken, verifyAdmin, updateItem);
router.delete('/items/:id', verifyToken, verifyAdmin, deleteItem);


export default router;