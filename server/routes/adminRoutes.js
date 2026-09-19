import express from 'express';
const router = express.Router();

import {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
    bulkApproveItems,
    bulkDeleteItems,
    getUsers,
    updateUser,
    getPendingSellers,
    approveSeller
} from '../controllers/adminController.js';

import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

router.post('/items', verifyToken, createItem);
router.get('/items', getItems);

// ස්ථාවර (static) රවුට්ස් සහ bulk රවුට්ස්, dynamic ID (:id) රවුට් එකට ඉහළින් තැබීම වැදගත් වේ
router.put('/items/bulk-approve', verifyToken, verifyAdmin, bulkApproveItems);
router.post('/items/bulk-delete', verifyToken, verifyAdmin, bulkDeleteItems);

// ── තනි අයිතමයක් ලබාගැනීමේ Route එක ──
// (මෙයට Token අවශ්‍ය නම් verifyToken එකතු කරන්න, නැතහොත් පොදුවේ හැමෝටම පෙනෙන්නට තබන්න)
router.get('/items/:id', getItemById);

router.put('/items/:id', verifyToken, verifyAdmin, updateItem);
router.delete('/items/:id', verifyToken, verifyAdmin, deleteItem);

// User & Points Management
router.get('/users', verifyToken, verifyAdmin, getUsers);
router.get('/pending-sellers', verifyToken, verifyAdmin, getPendingSellers);
router.put('/approve-seller/:id', verifyToken, verifyAdmin, approveSeller);
router.put('/users/:id', verifyToken, verifyAdmin, updateUser);

export default router;