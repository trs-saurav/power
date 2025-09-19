import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { NextResponse } from "next/server";

// GET single product for editing
export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await authSeller(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const productId = params?.id;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          brand: product.brand,
          model: product.model,
          category: product.category,
          price: product.price,
          offerPrice: product.offerPrice,
          images: product.images,
          availability: product.availability,
          warrantyPeriod: product.warranty?.period,
          warrantyType: product.warranty?.type,
          capacityValue: product.capacity?.value,
          capacityUnit: product.capacity?.unit,
          weightValue: product.weight?.value,
          weightUnit: product.weight?.unit,
          createdAt: product.createdAt || product.date
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get product for edit error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch product details",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const user = await authSeller(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const productId = params?.id;
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Parse the form data
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

    // Handle warranty
    const warrantyPeriod = formData.get('warrantyPeriod');
    const warrantyType = formData.get('warrantyType');
    if (warrantyPeriod && warrantyType) {
      updateData.warranty = {
        period: Number(warrantyPeriod),
        type: warrantyType
      };
    }

    // Handle capacity
    const capacityValue = formData.get('capacityValue');
    const capacityUnit = formData.get('capacityUnit');
    if (capacityValue && capacityUnit) {
      updateData.capacity = {
        value: Number(capacityValue),
        unit: capacityUnit
      };
    }

    // Handle weight
    const weightValue = formData.get('weightValue');
    const weightUnit = formData.get('weightUnit');
    if (weightValue && weightUnit) {
      updateData.weight = {
        value: Number(weightValue),
        unit: weightUnit
      };
    }

    // Handle new images (if any) - you'll need to implement image upload logic here
    // For now, we'll keep existing images
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Product updated successfully",
        product: updatedProduct
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update product",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
