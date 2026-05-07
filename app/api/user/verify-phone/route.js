import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { code } = await request.json();
    const authHeader = request.headers.get("Authorization");
    const email = authHeader?.replace("Bearer ", "");

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and code are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(email);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if code is valid and not expired
    if (
      user.phoneVerificationCode !== code ||
      !user.phoneVerificationCodeExpiry ||
      new Date() > user.phoneVerificationCodeExpiry
    ) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Mark phone as verified
    user.phoneVerified = true;
    user.phoneVerificationCode = null;
    user.phoneVerificationCodeExpiry = null;
    await user.save();

    return NextResponse.json(
      { message: "Phone verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Phone verification error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to verify phone" },
      { status: 500 }
    );
  }
}
