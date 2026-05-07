import connectDB from "@/config/db";
import User from "@/models/user";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/emailService";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: "If an account with that email exists, you will receive a password reset link" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiry to 24 hours
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.resetToken = resetTokenHash;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    
    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Clear the reset token if email fails
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
      
      return NextResponse.json(
        { message: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
