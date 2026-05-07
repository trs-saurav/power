import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, default: "" },
  passwordHash: { type: String, default: null }, // null for OAuth users
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'], default: null },
  phone: { type: String, default: null },
  phoneVerified: { type: Boolean, default: false },
  phoneVerificationCode: { type: String, default: null },
  phoneVerificationCodeExpiry: { type: Date, default: null },
  dateOfBirth: { type: Date, default: null },
  bio: { type: String, default: "" },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: null },
  emailVerificationTokenExpiry: { type: Date, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cartItems: { type: Object, default: {} },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  defaultSettings: { type: Object, default: {} },
  preferences: { type: Object, default: {} },
}, { minimize: false, timestamps: true });

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
