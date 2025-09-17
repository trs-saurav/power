import connectDB from "@/config/db";
import Address from "@/models/address";
import Order from "@/models/order";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { get } from "http";
import { NextResponse } from "next/server";



export async function GET(request) {

    try {
        
        const {userId} = getAuth(request);
        
        await connectDB();

        Address.length
        Product.length

        const orders = await Order.find({userId}).populate(['address', 'items.productId']);

        return NextResponse.json({success: true, orders}, {status: 200});

    } catch (error) {
        return NextResponse.json({success: false, message: error.message}, {status: 500});
        
    }
}