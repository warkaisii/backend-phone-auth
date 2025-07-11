import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// In-memory store for demo OTPs
const otpStore = {};

router.post('/verify', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;

  console.log(`Fake OTP for ${phone}: ${otp}`);
  return res.json({ message: 'OTP sent (check console)' });
});

router.post('/confirm', async (req, res) => {
  const { phone, otp } = req.body;
  if (otpStore[phone] !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  delete otpStore[phone];
  let user = await User.findOne({ phone });

  if (!user) user = await User.create({ phone });

  await User.updateMany({ phone: { $ne: phone } }, { sessionToken: null });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  user.sessionToken = token;
  await user.save();

  return res.json({ token });
});

export default router;
