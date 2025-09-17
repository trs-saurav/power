import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/order";
import Product from "@/models/product";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { items, address } = await request.json();

        if(!address || items.length === 0 || !amount) {
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        //calculate amount using items and their quantities from db to avoid client side manipulation
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.productId);
                return acc + (product.offerPrice * item.quantity);
        },0);

 
        await connectDB();



        await inngest.send({
            name: "order/created",
            data: {
                userId,
                items,
                amount: amount + Math.floor(amount * 0.18) + 50, //amount + tax + delivery charge
                address,
                date:  Date.now()
            },
        });

        const user = await User.findById(userId)
        user.cartItems = {}

        await user.save();


        return NextResponse.json({success: true, message: "Order placed successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
       return NextResponse.json({success: false, message: error.message }, { status: 500 });
    }
}