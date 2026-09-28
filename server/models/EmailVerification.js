import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true },
  birthday: { type: Date, required: true },
  passwordHash: { type: String, required: true },
  otpHash: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now }
}, { timestamps: true });

emailVerificationSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });
emailVerificationSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('EmailVerification', emailVerificationSchema);
