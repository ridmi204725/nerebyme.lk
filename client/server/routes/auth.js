import express from 'express';
import { register, login, forgotPassword, resetPassword, googleLogin, getMe } from '../controllers/authController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js'; // 🌟

const router = express.Router();

// 🔓 Public Routes (ඕනෑම කෙනෙකුට පිවිසිය හැක)
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// 🔒 Protected Route (ලොග් වී ඇති පරිශීලකයාගේ Role එක Frontend එකෙන් Verify කර ගැනීමට)
router.get('/me', verifyToken, getMe);

export default router;