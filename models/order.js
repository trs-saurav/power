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
            // Optional: Add these fields for better order tracking
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
    // Add voucher and pricing breakdown fields
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
        default: "Order Placed", // Changed from "Pending" to match your API
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
    date: {
        type: Number,
        required: true,
    }
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
