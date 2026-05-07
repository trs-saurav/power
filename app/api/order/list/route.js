import connectDB from "@/config/db";
import Address from "@/models/address";
import Order from "@/models/order";
import Product from "@/models/product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { get } from "http";
import { NextResponse } from "next/server";



export async function GET(request) {

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;
        
        await connectDB();

        Address.length
        Product.length

        const orders = await Order.find({userId}).populate(['address', 'items.productId']);

        return NextResponse.json({success: true, orders}, {status: 200});

    } catch (error) {
        return NextResponse.json({success: false, message: error.message}, {status: 500});
        
    }
}