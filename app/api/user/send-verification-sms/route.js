import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { phone } = await request.json();
    const authHeader = request.headers.get("Authorization");
    const email = authHeader?.replace("Bearer ", "");

    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!phone || phone.trim().length < 10) {
      return NextResponse.json(
        { message: "Invalid phone number" },
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

    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with verification code
    user.phoneVerificationCode = verificationCode;
    user.phoneVerificationCodeExpiry = codeExpiry;
    user.phone = phone;
    await user.save();

    // TODO: Send SMS using Twilio or similar service
    // For now, we'll log it (in production, integrate with Twilio/AWS SNS)
    console.log(`[SMS] Verification code for ${phone}: ${verificationCode}`);

    // In a real app, you would send via Twilio:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `Your verification code is: ${verificationCode}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });

    return NextResponse.json(
      {
        message: "Verification code sent successfully",
        // For development only - remove in production
        ...(process.env.NODE_ENV === "development" && {
          devVerificationCode: verificationCode,
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Phone verification error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to send verification code" },
      { status: 500 }
    );
  }
}
