import User from "@/models/user";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function POST(request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;

        const { cartData } = await request.json();

        await connectDB();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        user.cartItems = cartData;
        await user.save();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}