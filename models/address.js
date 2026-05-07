import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    fullName: {  // Changed from 'fullname' to match your form
        type: String,
        required: true
    },
    phoneNumber: {  // Changed from 'PhoneNumber' to match your form
        type: String,
        required: true
    },
    pincode: {  // Changed from 'pinCode' to match your form
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'India'  // Added default value
    }
}, { 
    timestamps: true  // Adds createdAt and updatedAt fields
});

// Fixed model syntax - use mongoose.models.Address (capital A)
const Address = mongoose.models?.Address || mongoose.model("Address", addressSchema);

export default Address;
