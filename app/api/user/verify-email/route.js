import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, token } = await request.json();

    console.log("🔐 Verify email request");
    console.log("Email:", email);
    console.log("Token:", token?.substring(0, 8) + "...");

    if (!email || !token) {
      console.log("❌ Missing email or token");
      return NextResponse.json(
        { message: "Email and token are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(email);
    if (!user) {
      console.log("❌ User not found:", email);
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    console.log("✅ User found");
    console.log("Stored token:", user.emailVerificationToken?.substring(0, 8) + "...");
    console.log("Token expiry:", user.emailVerificationTokenExpiry);
    console.log("Current time:", new Date());

    // Check if token is valid and not expired
    if (
      user.emailVerificationToken !== token ||
      !user.emailVerificationTokenExpiry ||
      new Date() > user.emailVerificationTokenExpiry
    ) {
      console.log("❌ Invalid or expired token");
      console.log("Token match:", user.emailVerificationToken === token);
      console.log("Has expiry:", !!user.emailVerificationTokenExpiry);
      console.log("Not expired:", new Date() <= user.emailVerificationTokenExpiry);
      
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Mark email as verified using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      email,
      {
        $set: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationTokenExpiry: null,
        }
      },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      console.log("❌ Failed to update user");
      return NextResponse.json(
        { message: "Failed to update user" },
        { status: 500 }
      );
    }

    console.log("✅ Email verified successfully for:", email);

    return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Email verification error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to verify email" },
      { status: 500 }
    );
  }
}
