import connectDB from "@/config/db";
import Product from "@/models/product";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id: productId } = await params;

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Optional: Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (err) {
          console.warn('Cloudinary image deletion failed:', err);
        }
      }
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json({ 
      success: true, 
      message: `Product "${product.name}" deleted successfully` 
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id: productId } = await params;
    const product = await Product.findById(productId);

    return NextResponse.json({ 
      success: true, 
      product 
    });

  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
  }
}
