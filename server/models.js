const mongoose = require('mongoose');

// ─── User Schema ───────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // Not required — Google OAuth users won't have one
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'owner'],
    default: 'user',
  },
  emailVerifyToken: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ─── OTP Schema ────────────────────────────────────────────
const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  },
});

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);

// ─── Product Schema ────────────────────────────────────────
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['laptops', 'cameras', 'phones', 'drones', 'tablets', 'gaming', 'vr', 'audio', 'accessories'],
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  actualPrice: {
    type: Number,
    default: 0,
  },
  damageDeposit: {
    type: Number,
    required: true,
  },
  specs: {
    type: Object,
    default: {},
  },
  images: {
    type: [String],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  rentedCount: {
    type: Number,
    default: 0,
  },
  manufactureDate: {
    type: String,
    default: '',
  },
  delivery: {
    type: String,
    default: 'Tomorrow',
  },
  sponsored: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Text index for search
productSchema.index({ title: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

// ─── Review Schema ─────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// ─── Order Schema ──────────────────────────────────────────
const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalRent: Number,       // pricePerDay × days
  platformFee: Number,     // 10%
  deliveryFee: {
    type: Number,
    default: 150,
  },
  damageDeposit: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'returned', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cod'],
    default: 'online',
  },
  deliveryAddress: {
    fullName: String,
    phone: String,
    email: String,
    address: String,
  },
  txHash: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = { User, OTP, Product, Review, Order };
