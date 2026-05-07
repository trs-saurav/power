import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/config/db";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;

        await connectDB();

        const user = await User.findById(userId);

        const { cartItems } = user;
        return NextResponse.json({ success: true, cartItems });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}