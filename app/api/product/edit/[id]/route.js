import connectDB from "@/config/db";
import Product from "@/models/product";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// GET single product for editing
export async function GET(request, { params }) {
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

    return NextResponse.json({ 
      success: true, 
      product 
    });

  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
  }
}

// UPDATE product
export async function PUT(request, { params }) {
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

    const formData = await request.formData();
    
    const updateData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      offerPrice: Number(formData.get('offerPrice')),
      brand: formData.get('brand'),
      model: formData.get('model'),
      availability: formData.get('availability') || 'in_stock'
    };

    const warrantyPeriod = formData.get('warrantyPeriod');
    const warrantyType = formData.get('warrantyType');
    if (warrantyPeriod && warrantyType) {
      updateData.warranty = {
        period: Number(warrantyPeriod),
        type: warrantyType
      };
    }

    const capacityValue = formData.get('capacityValue');
    const capacityUnit = formData.get('capacityUnit');
    if (capacityValue && capacityUnit) {
      updateData.capacity = {
        value: Number(capacityValue),
        unit: capacityUnit
      };
    }

    const weightValue = formData.get('weightValue');
    const weightUnit = formData.get('weightUnit');
    if (weightValue && weightUnit) {
      updateData.weight = {
        value: Number(weightValue),
        unit: weightUnit
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}
