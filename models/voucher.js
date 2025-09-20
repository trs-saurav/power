// models/voucher.js
import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  // Basic Information
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Discount Configuration
  discountType: {
    type: String,
    enum: ['percentage', 'fixed_amount'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscountAmount: {
    type: Number, // For percentage discounts
    default: null
  },
  
  // Usage Limits
  usageLimit: {
    type: Number,
    default: null // null = unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1 // How many times one user can use
  },
  
  // Validity
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Conditions
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxOrderAmount: {
    type: Number,
    default: null
  },
  applicableCategories: {
    type: [String],
    default: [] // Empty = all categories
  },
  applicableBrands: {
    type: [String],
    default: [] // Empty = all brands
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    ref: "user"
  },
  usedBy: [{
    userId: {
      type: String,
      ref: "user"
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderAmount: Number,
    discountApplied: Number
  }]
}, {
  timestamps: true
});

// Indexes for better performance
voucherSchema.index({ code: 1 });
voucherSchema.index({ isActive: 1 });
voucherSchema.index({ startDate: 1, endDate: 1 });
voucherSchema.index({ createdBy: 1 });

const Voucher = mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema);

export default Voucher;
