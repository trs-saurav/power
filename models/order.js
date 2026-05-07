import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [
        {
            productId: {
                type: String,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            },
            name: String,
            image: String,
            price: Number,
            total: Number
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    promoCode: {
        type: String,
        default: null
    },
    appliedVoucher: {
        code: String,
        title: String,
        discountType: String,
        discountValue: Number,
        appliedDiscount: Number
    },
    address: {
        type: String,
        required: true,
        ref: 'Address'
    },
    status: {
        type: String,
        enum: [
            "Order Placed",
            "Processing",
            "Packed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
            "Refunded"
        ],
        default: "Order Placed",
        required: true
    },
    paymentMethod: {
        type: String,
        default: "COD"
    },
    payment: {
        type: Boolean,
        default: false
    },
    // New tracking fields
    courier: {
        name: {
            type: String,
            default: null
        },
        trackingId: {
            type: String,
            default: null
        },
        trackingUrl: {
            type: String,
            default: null
        }
    },
    // Status history for tracking
    statusHistory: [{
        status: String,
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: String,
        note: String
    }],
    // Cancellation details
    cancellation: {
        reason: String,
        cancelledAt: Date,
        cancelledBy: String,
        refundStatus: {
            type: String,
            enum: ["Pending", "Processed", "Failed"],
            default: null
        }
    },
    date: {
        type: Number,
        required: true,
    },
    // Delivery details
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
    // Admin notes
    adminNotes: String
}, { timestamps: true });

// Indexes for better performance
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ status: 1, date: -1 });
orderSchema.index({ 'courier.trackingId': 1 });

const Order = mongoose.models?.order || mongoose.model("order", orderSchema);
export default Order;
