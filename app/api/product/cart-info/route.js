import connectDB from "@/config/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { itemIds } = await request.json();
    
    if (!itemIds || !Array.isArray(itemIds)) {
      return NextResponse.json({ success: false, message: "Invalid item IDs" }, { status: 400 });
    }

    await connectDB();

    // Fetch only the necessary fields for cart calculations
    const products = await Product.find({ _id: { $in: itemIds } })
      .select("name offerPrice images price")
      .lean();

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
