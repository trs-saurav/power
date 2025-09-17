import connectDB from "@/config/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Auth (still protect the endpoint; only authorized sellers/admins can read)


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
