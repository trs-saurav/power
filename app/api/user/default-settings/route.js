import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

const DEFAULT_SETTINGS = {
  defaultAddress: null,
  paymentMethod: 'card',
  notifyOnOrders: true,
  notifyOnDelivery: true,
  newsAndUpdates: false,
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

    const settings = user.defaultSettings || DEFAULT_SETTINGS;

    return NextResponse.json(
      { settings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get default settings error:", error);
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

    const settings = await request.json();

    await connectDB();

    const user = await User.findByIdAndUpdate(
      email,
      { defaultSettings: settings },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Settings updated successfully", settings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update default settings error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
