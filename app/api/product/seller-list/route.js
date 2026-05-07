import connectDB from "@/config/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Return ALL products
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
