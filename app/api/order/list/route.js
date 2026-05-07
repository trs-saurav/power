import connectDB from "@/config/db";
import Address from "@/models/address";
import Order from "@/models/order";
import Product from "@/models/product";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;
        
        await connectDB();

        // Ensure models are registered for populate
        Address.length;
        Product.length;

        const orders = await Order.find({ userId })
            .populate(['address', 'items.productId'])
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, orders }, { status: 200 });

    } catch (error) {
        console.error("Error fetching order list:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}