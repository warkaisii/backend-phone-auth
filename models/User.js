import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  sessionToken: { type: String },
  pin: { type: String },
  biometricEnabled: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
