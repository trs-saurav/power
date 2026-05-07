import { auth } from "@/auth";
import connectDB from "@/config/db";
import Order from "@/models/order";
import { NextResponse } from "next/server";
import Address from "@/models/address";
import Product from "@/models/product"; // Ensure Product is imported for populate

export async function GET(request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Populate address and product details
        const orders = await Order.find({})
            .populate('address')
            .populate('items.productId')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, orders }, { status: 200 });

    } catch (error) {
        console.error("Error fetching seller orders:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}