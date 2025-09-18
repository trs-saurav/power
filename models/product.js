import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "user"
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offerPrice: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    
    // New fields added
    brand: {
        type: String,
        required: true
    },
    warranty: {
        period: {
            type: Number, // warranty period in months
            required: true
        },
        type: {
            type: String, // e.g., "manufacturer", "seller", "extended"
            required: true,
            enum: ["manufacturer", "seller", "extended", "none"]
        }
    },
    model: {
        type: String,
        required: true
    },
    capacity: {
        value: {
            type: Number // numerical value
        },
        unit: {
            type: String // e.g., "GB", "TB", "L", "mAh", "kg"
        }
    },
    
    // Additional useful fields
    availability: {
        type: String,
        enum: ["in_stock", "out_of_stock", "pre_order", "discontinued"],
        default: "in_stock"
    },
    weight: {
        value: {
            type: Number
        },
        unit: {
            type: String,
            default: "kg"
        }
    }
});

// Add indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ availability: 1 });
productSchema.index({ userId: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
