import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import EmailVerification from '../models/EmailVerification.js';

// @desc    Start email-verified registration
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const { fullName, email, password, phone, birthday } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        if (!fullName || !normalizedEmail || !password || !phone || !birthday) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }
        if (!/^[a-zA-Z\s]{3,}$/.test(fullName)) {
            return res.status(400).json({ success: false, message: 'Full name must be at least 3 characters and contain only letters and spaces' });
        }

        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        if (age < 18) return res.status(400).json({ success: false, message: 'User must be at least 18 years old' });
        if (!/^0\d{9}$/.test(phone)) return res.status(400).json({ success: false, message: 'Contact number must be a valid 10-digit Sri Lankan number' });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ success: false, message: 'Please provide a valid email' });
        if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number, and 1 special character' });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ success: false, message: existingUser.isEmailVerified === false
                ? 'An account already exists but its email is not verified. Please use the verification code or resend it.'
                : 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const otp = String(crypto.randomInt(100000, 1000000));
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

        const now = Date.now();
        const pending = await EmailVerification.findOneAndUpdate(
            { email: normalizedEmail },
            {
                fullName, email: normalizedEmail, phone, birthday,
                passwordHash, otpHash,
                otpExpiresAt: new Date(now + 10 * 60 * 1000),
                attempts: 0, lastSentAt: new Date(now)
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: `"NearbyMe.lk" <${process.env.EMAIL_USER}>`,
            to: normalizedEmail,
            subject: 'Your NearbyMe.lk verification code',
            html: `
              <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px;border-radius:18px;background:#0f172a;color:#fff">
                <h2 style="margin:0 0 8px">Verify your NearbyMe.lk account</h2>
                <p style="color:#cbd5e1">Hello ${fullName}, use this one-time code to finish your registration.</p>
                <div style="font-size:34px;letter-spacing:10px;font-weight:800;text-align:center;padding:22px;margin:22px 0;background:#1e293b;border-radius:14px">${otp}</div>
                <p style="color:#94a3b8">This code expires in 10 minutes. Never share it with anyone.</p>
              </div>`
        });

        return res.status(200).json({
            success: true,
            requiresOtp: true,
            message: `A verification code was sent to ${normalizedEmail.replace(/(^.).*(@.*$)/, '$1••••$2')}`
        });
    } catch (err) {
        next(err);
    }
};

// @desc Verify OTP and create the account
// @route POST /api/auth/verify-otp
export const verifyRegistrationOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!normalizedEmail || !/^\d{6}$/.test(String(otp || ''))) {
            return res.status(400).json({ success: false, message: 'Enter the 6-digit verification code.' });
        }

        const pending = await EmailVerification.findOne({ email: normalizedEmail });
        if (!pending) return res.status(404).json({ success: false, message: 'Verification request not found. Please register again.' });
        if (pending.otpExpiresAt.getTime() < Date.now()) {
            await EmailVerification.deleteOne({ _id: pending._id });
            return res.status(400).json({ success: false, message: 'Verification code expired. Please request a new code.' });
        }
        if (pending.attempts >= 5) {
            return res.status(429).json({ success: false, message: 'Too many incorrect attempts. Please request a new code.' });
        }

        const suppliedHash = crypto.createHash('sha256').update(String(otp)).digest('hex');
        if (suppliedHash !== pending.otpHash) {
            pending.attempts += 1;
            await pending.save();
            return res.status(400).json({ success: false, message: 'Incorrect verification code.' });
        }

        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            await EmailVerification.deleteOne({ _id: pending._id });
            return res.status(409).json({ success: false, message: 'User already exists. Please log in.' });
        }

        const user = await User.create({
            fullName: pending.fullName,
            email: pending.email,
            phone: pending.phone,
            birthday: pending.birthday,
            password: pending.passwordHash,
            isEmailVerified: true
        });

        await EmailVerification.deleteOne({ _id: pending._id });

        return res.status(201).json({
            success: true,
            message: 'Email verified and account created successfully.',
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    } catch (err) {
        next(err);
    }
};

// @desc Resend registration OTP
// @route POST /api/auth/resend-otp
export const resendRegistrationOtp = async (req, res, next) => {
    try {
        const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
        const pending = await EmailVerification.findOne({ email: normalizedEmail });
        if (!pending) return res.status(404).json({ success: false, message: 'No pending verification found.' });

        if (pending.lastSentAt && Date.now() - pending.lastSentAt.getTime() < 45 * 1000) {
            return res.status(429).json({ success: false, message: 'Please wait 45 seconds before requesting another code.' });
        }

        const otp = String(crypto.randomInt(100000, 1000000));
        pending.otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        pending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        pending.attempts = 0;
        pending.lastSentAt = new Date();
        await pending.save();

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await transporter.sendMail({
            from: `"NearbyMe.lk" <${process.env.EMAIL_USER}>`,
            to: normalizedEmail,
            subject: 'Your new NearbyMe.lk verification code',
            html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px"><h2>NearbyMe.lk verification code</h2><p>Your new code is:</p><div style="font-size:34px;letter-spacing:10px;font-weight:800;text-align:center;padding:20px;background:#f1f5f9;border-radius:14px">${otp}</div><p>This code expires in 10 minutes.</p></div>`
        });
        return res.status(200).json({ success: true, message: 'A new verification code has been sent.' });
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Email must be verified before normal password login.
        if (user.isEmailVerified === false) {
            return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        user.lastLoginAt = new Date();
        await user.save();

        // JWT Token එකක් සෑදීම
        const token = jwt.sign(
            { id: user._id, role: user.role || 'user' },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role || 'user'
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 mins

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Holiday.lk Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Holiday.lk Password Reset</h2>
                    <p>Hello ${user.fullName},</p>
                    <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
                    <p>Please click on the following link to complete the process:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    <p>This link will expire in 30 minutes.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 Holiday.lk. All rights reserved.</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({
                success: true,
                message: 'If an account exists, a reset link has been sent.'
            });
        } catch (mailError) {
            console.error('Email send error:', mailError);
            res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (err) {
        next(err);
    }
};

// @desc    Google Login
// @route   POST /api/auth/google-login
export const googleLogin = async (req, res, next) => {
    try {
        const { fullName, email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const randomPassword = crypto.randomBytes(20).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                fullName,
                email,
                password: hashedPassword
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role || 'user' },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Google login successful',
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role || 'user'
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Request to become a seller
// @route   PUT /api/auth/request-seller
export const requestSeller = async (req, res, next) => {
    try {
        const { businessName, businessContact } = req.body;

        const user = await User.findById(req.user._id || req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'seller') {
            return res.status(400).json({ success: false, message: 'User is already a seller' });
        }

        user.sellerStatus = 'pending';
        if (businessName) user.businessName = businessName;
        if (businessContact) user.businessContact = businessContact;

        await user.save();

        res.status(200).json({ success: true, message: 'Seller request submitted successfully', user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
export const updateProfile = async (req, res, next) => {
    try {
        const { fullName, phone, birthday, password } = req.body;

        const user = await User.findById(req.user._id || req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (birthday) user.birthday = birthday;

        if (password) {
            if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
                return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number, and 1 special character' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({ success: true, message: 'Profile updated successfully', user: {
                id: user._id, fullName: user.fullName, email: user.email, role: user.role
            }});
    } catch (error) {
        next(error);
    }
};

// @desc    Facebook Login
// @route   POST /api/auth/facebook-login
export const facebookLogin = async (req, res) => {
    try {
        const { email, name, fullName, userID } = req.body;
        const userName = name || fullName || 'Facebook User';
        const userEmail = email || `${userID || Date.now()}@facebook.com`;

        let user = await User.findOne({ $or: [{ email: userEmail }, { facebookId: userID }] });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const randomPassword = crypto.randomBytes(20).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                fullName: userName,
                email: userEmail,
                password: hashedPassword,
                facebookId: userID || '',
                role: 'user',
                sellerStatus: 'approved'
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: '7d',
        });

        return res.status(200).json({
            success: true,
            message: "Facebook login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Facebook Login Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Apple Login (provider callback payload must be verified by Apple in production)
export const appleLogin = async (req, res) => {
    try {
        const { fullName, email, appleId, identityToken } = req.body;
        const claims = identityToken ? jwt.decode(identityToken) : null;
        const resolvedAppleId = appleId || claims?.sub || '';
        const userEmail = email || claims?.email || (resolvedAppleId ? `${resolvedAppleId}@privaterelay.appleid.com` : '');
        if (!userEmail) return res.status(400).json({ success: false, message: 'Apple identity did not include an email/subject.' });
        let user = await User.findOne({ $or: [{ email: userEmail }, ...(resolvedAppleId ? [{ appleId: resolvedAppleId }] : [])] });
        if (!user) {
            const password = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10);
            user = await User.create({
                fullName: fullName || claims?.name || 'Apple User',
                email: userEmail,
                password,
                appleId: resolvedAppleId,
                role: 'user',
                sellerStatus: 'approved'
            });
        }
        const token = jwt.sign({ id: user._id, role: user.role || 'user' }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
        return res.status(200).json({ success: true, message: 'Apple login successful', token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role || 'user' } });
    } catch (error) {
        console.error('Apple Login Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
