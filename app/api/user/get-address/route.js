import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Address from "@/models/address";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;
        
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
