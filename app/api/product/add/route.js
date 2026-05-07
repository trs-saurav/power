import connectDB from "@/config/db";
import Product from "@/models/product";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Ensure Node.js runtime
export const runtime = 'nodejs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;

    // Parse form data
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const brand = formData.get("brand");
    const model = formData.get("model");
    const warrantyPeriod = formData.get("warrantyPeriod");
    const warrantyType = formData.get("warrantyType");
    const capacityValue = formData.get("capacityValue");
    const capacityUnit = formData.get("capacityUnit");
    const availability = formData.get("availability");
    const weightValue = formData.get("weightValue");
    const weightUnit = formData.get("weightUnit");
    const files = formData.getAll("images");

    // Basic validation
    if (!name || !description || !category || !price || !offerPrice || !brand || !model || !warrantyPeriod || !warrantyType) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields" 
      }, { status: 400 });
    }
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No image files received" }, { status: 400 });
    }

    // Upload files to Cloudinary
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type || 'application/octet-stream'};base64,${base64}`;

        return await cloudinary.uploader.upload(dataUri, {
          resource_type: 'auto',
          folder: 'products',
          use_filename: true,
          unique_filename: true,
          overwrite: false
        });
      })
    );

    const images = uploadResults.map((r) => r.secure_url);

    // Prepare product data
    const productData = {
      userId,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      brand,
      model,
      warranty: {
        period: Number(warrantyPeriod),
        type: warrantyType
      },
      images,
      date: Date.now()
    };

    if (capacityValue || capacityUnit) {
      productData.capacity = {};
      if (capacityValue) productData.capacity.value = Number(capacityValue);
      if (capacityUnit) productData.capacity.unit = capacityUnit;
    }

    if (availability) productData.availability = availability;

    if (weightValue || weightUnit) {
      productData.weight = {};
      if (weightValue) productData.weight.value = Number(weightValue);
      if (weightUnit) productData.weight.unit = weightUnit;
    }

    // Save to DB
    await connectDB();
    const newProduct = await Product.create(productData);

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
