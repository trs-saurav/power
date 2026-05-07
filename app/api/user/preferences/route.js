import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  newsletter: true,
  productUpdates: true,
  securityAlerts: true,
  language: 'en',
  timezone: 'UTC',
  theme: 'system',
};

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const email = authHeader?.split(" ")[1];

    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
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

    const preferences = user.preferences || DEFAULT_PREFERENCES;

    return NextResponse.json(
      { preferences },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const email = authHeader?.split(" ")[1];

    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const preferences = await request.json();

    await connectDB();

    const user = await User.findByIdAndUpdate(
      email,
      { preferences },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Preferences updated successfully", preferences },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
