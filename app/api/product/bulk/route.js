import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { NextResponse } from "next/server";

// Bulk delete products
export async function DELETE(request) {
  try {
    await connectDB();

    const user = await authSeller(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product IDs array is required" },
        { status: 400 }
      );
    }

    // Delete products
    const deleteResult = await Product.deleteMany({ _id: { $in: productIds } });

    return NextResponse.json(
      { 
        success: true, 
        message: `${deleteResult.deletedCount} products deleted successfully`,
        deletedCount: deleteResult.deletedCount
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { success: false, message: "Failed to delete products" },
      { status: 500 }
    );
  }
}

// Bulk update products (status, category, etc.)
export async function PUT(request) {
  try {
    await connectDB();

    const user = await authSeller(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { productIds, updateData } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product IDs array is required" },
        { status: 400 }
      );
    }

    // Update products
    const updateResult = await Product.updateMany(
      { _id: { $in: productIds } },
      updateData
    );

    return NextResponse.json(
      { 
        success: true, 
        message: `${updateResult.modifiedCount} products updated successfully`,
        modifiedCount: updateResult.modifiedCount
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { success: false, message: "Failed to update products" },
      { status: 500 }
    );
  }
}
