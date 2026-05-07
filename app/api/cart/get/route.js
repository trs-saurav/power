import { NextResponse } from "next/server";
import User from "@/models/user";
import { auth } from "@/auth";
import connectDB from "@/config/db";

export async function GET(request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email; // We use email as ID based on sign-in logic

        await connectDB();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const { cartItems } = user;
        return NextResponse.json({ success: true, cartItems });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}