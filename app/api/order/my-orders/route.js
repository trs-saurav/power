import connectDB from "@/config/db";
import Order from "@/models/order";
import { NextResponse } from "next/server";

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

    const orders = await Order.find({ userEmail: email })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get my orders error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
