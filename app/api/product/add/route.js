import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Ensure Node.js runtime (Buffer, Cloudinary SDK, etc.)
export const runtime = 'nodejs';

// Configure Cloudinary (server-only env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    // Auth
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const files = formData.getAll("images"); // array of Web File

    // Basic validation
    if (!name || !description || !category || !price || !offerPrice) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No image files received" }, { status: 400 });
    }

    // Helpful logging
    files.forEach((f, idx) => {
      // Web File has name, type, size
      console.log(`File[${idx}] => name=${f?.name} type=${f?.type} size=${f?.size}`);
    });

    // Upload each file to Cloudinary using data URI (robust in App Router)
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (!buffer?.length) {
          throw new Error("Received empty file buffer");
        }

        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type || 'application/octet-stream'};base64,${base64}`;

        // Optional: add folder or tags as needed
        const result = await cloudinary.uploader.upload(dataUri, {
          resource_type: 'auto',
          folder: 'products', // change or remove as needed
          use_filename: true,
          unique_filename: true,
          overwrite: false
        });

        // result.secure_url should be present
        return result;
      })
    );

    const images = uploadResults.map((r) => r.secure_url);
    console.log("Uploaded image URLs:", images);

    // Save to DB
    await connectDB();
    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      images,
      date: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: "Product uploaded successfully",
      productId: newProduct?._id,
      images: images
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      success: false,
      message: error?.message || "Internal Server Error"
    }, { status: 500 });
  }
}
