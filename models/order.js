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
            }
        }
    ],
    amount: {
        type: Number,
        required: true
}
,    address: {
        type: String,
        required: true,
        ref : 'Address'
    },
    status: {
        type: String,
        default: "Pending",
        required: true
    },
    date: {
        type: Number,
        required: true,
    }
});

const Order = mongoose.model.order || mongoose.model("order", orderSchema);
export default Order;
