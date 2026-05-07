import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import nodemailer from "@/config/nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();
    const authHeader = request.headers.get("Authorization");
    const userEmail = authHeader?.replace("Bearer ", "").trim();

    console.log("📧 Send verification email request");
    console.log("Email from body:", email);
    console.log("User email from auth:", userEmail);

    if (!userEmail || userEmail !== email) {
      console.log("❌ Unauthorized: Email mismatch or missing");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(userEmail);
    if (!user) {
      console.log("❌ User not found:", userEmail);
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log("🔐 Generated verification token:", verificationToken);
    console.log("⏰ Token expiry:", tokenExpiry);

    // Update user with verification token using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      userEmail,
      {
        $set: {
          emailVerificationToken: verificationToken,
          emailVerificationTokenExpiry: tokenExpiry,
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

    console.log("✅ User updated with token");
    console.log("Saved token:", updatedUser.emailVerificationToken);

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}&email=${email}`;

    console.log("📨 Verification URL:", verificationUrl);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Hi ${updatedUser.name},</p>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verify Email
          </a>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await nodemailer.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", email);

    return NextResponse.json(
      { message: "Verification email sent successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Email verification error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to send verification email" },
      { status: 500 }
    );
  }
}
