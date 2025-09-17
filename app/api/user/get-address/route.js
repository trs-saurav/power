import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" }, 
                { status: 401 }
            );
        }

        await connectDB();
        const addresses = await Address.find({ userId });

        return NextResponse.json({ 
            success: true, 
            addresses,
            count: addresses.length 
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Error fetching addresses" 
        }, { status: 500 });
    }
}
