import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['solar', 'electricwork', 'ups', 'camera'],
        required: true
    }
}, {
    timestamps: true
});

// Check if model already exists before creating it
const Gallery = mongoose.models?.Gallery || mongoose.model('Gallery', gallerySchema);

export default Gallery;
