import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";



export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;

        
        
        const { cartData } = await request.json();

        await connectDB();
        const user = await User.findById(userId);

        user.cartItems = cartData;
        await user.save();

       return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }

}