import connectDB from "@/config/db";
import Product from "@/models/product";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    // Auth (still protect the endpoint; only authorized sellers/admins can read)
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    // DB
    await connectDB();

    // Return ALL products (no filter)
    const products = await Product.find({}).lean();

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
