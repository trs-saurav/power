import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/order";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import Address from "@/models/address";


export async function GET(request) {

    try {
        
        const {userId} = getAuth(request);

        const isAdmin = await authSeller(userId);

        if (!isAdmin) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        Address.length

        const orders = await Order.find({}).populate(['address', 'items.productId']);

        return NextResponse.json({success: true, orders}, {status: 200});

    } catch (error) {
        return NextResponse.json({success: false, message: error.message}, {status: 500});
    }



}