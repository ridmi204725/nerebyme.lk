import express from 'express';
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    googleLogin,
    facebookLogin,
    getMe,
    requestSeller,
    updateProfile
} from '../controllers/authController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔓 Public Routes (ඕනෑම කෙනෙකුට පිවිසිය හැක)
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/facebook-login', facebookLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// 🔒 Protected Route (ලොග් වී ඇති පරිශීලකයාගේ Role එක Frontend එකෙන් Verify කර ගැනීමට)
router.get('/me', verifyToken, getMe);
router.put('/request-seller', verifyToken, requestSeller);
router.put('/update-profile', verifyToken, updateProfile);

export default router;