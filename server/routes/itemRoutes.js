import express from 'express';
import { getItemById } from '../controllers/adminController.js';

const router = express.Router();

// Public detail endpoint. Pending/rejected records remain hidden by getItemById.
router.get('/:id', getItemById);

export default router;
