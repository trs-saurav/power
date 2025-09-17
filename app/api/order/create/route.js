import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/user";
import Order from "@/models/order";
import Product from "@/models/product";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { items, address } = await request.json();

        if(!address || items.length === 0) {
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        await connectDB();

        // Calculate amount using proper async reduce implementation
        let totalAmount = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json({success: false, message: "Product not found" }, { status: 400 });
            }
            totalAmount += product.offerPrice * item.quantity;
        }

        const finalAmount = totalAmount + Math.floor(totalAmount * 0.18) + 50; // amount + tax + delivery charge

        await inngest.send({
            name: "order/created",
            data: {
                userId,
                items,
                amount: finalAmount,
                address,
                date: Date.now()
            },
        });

        const user = await User.findById(userId);
        if (user) {
            user.cartItems = {};
            await user.save();
        }

        return NextResponse.json({success: true, message: "Order placed successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: error.message }, { status: 500 });
    }
}
