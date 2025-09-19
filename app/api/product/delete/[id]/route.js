import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(request, { params }) {
  console.log('🔥 DELETE method called');
  console.log('📋 Params received:', params);
  
  try {
    // Step 1: Database Connection
    console.log('📡 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Step 2: Authentication
    console.log('🔐 Authenticating user...');
    const user = await authSeller(request);
    console.log('👤 User authenticated:', user ? 'YES' : 'NO');
    console.log('👤 User details:', user);
    
    if (!user) {
      console.log('❌ Authentication failed');
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Step 3: Get Product ID
    const productId = params?.id;
    console.log('🆔 Product ID:', productId);

    if (!productId) {
      console.log('❌ No product ID provided');
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Step 4: Find Product
    console.log('🔍 Searching for product...');
    const product = await Product.findById(productId);
    console.log('📦 Product found:', product ? 'YES' : 'NO');
    
    if (product) {
      console.log('📦 Product details:', {
        id: product._id,
        name: product.name,
        brand: product.brand
      });
    }

    if (!product) {
      console.log('❌ Product not found in database');
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Step 5: Delete Images from Cloudinary (simplified for now)
    const productImages = product.images || [];
    console.log('🖼️ Product images count:', productImages.length);

    // Step 6: Delete Product from Database
    console.log('🗑️ Attempting to delete product from database...');
    
    // Try different deletion methods
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      console.log('✅ Product deleted using findByIdAndDelete:', deletedProduct ? 'SUCCESS' : 'FAILED');
      
      if (deletedProduct) {
        console.log('🎉 Product successfully deleted:', deletedProduct.name);
        return NextResponse.json(
          { 
            success: true, 
            message: `Product "${deletedProduct.name}" deleted successfully`,
            deletedProduct: {
              id: deletedProduct._id,
              name: deletedProduct.name
            }
          },
          { status: 200 }
        );
      } else {
        console.log('❌ findByIdAndDelete returned null');
        
        // Try alternative deletion method
        console.log('🔄 Trying deleteOne method...');
        const deleteResult = await Product.deleteOne({ _id: productId });
        console.log('📊 DeleteOne result:', deleteResult);
        
        if (deleteResult.deletedCount > 0) {
          console.log('✅ Product deleted using deleteOne');
          return NextResponse.json(
            { 
              success: true, 
              message: `Product deleted successfully`,
              deletedCount: deleteResult.deletedCount
            },
            { status: 200 }
          );
        } else {
          console.log('❌ No documents were deleted');
          return NextResponse.json(
            { success: false, message: "No product was deleted" },
            { status: 500 }
          );
        }
      }
    } catch (deleteError) {
      console.error('💥 Error during product deletion:', deleteError);
      throw deleteError;
    }

  } catch (error) {
    console.error('💥 Overall DELETE error:', error);
    console.error('📚 Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred while deleting the product",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  console.log('📡 GET method called with params:', params);
  
  try {
    await connectDB();
    
    const productId = params?.id;
    console.log('🔍 Looking for product with ID:', productId);
    
    const product = await Product.findById(productId);
    console.log('📦 Product found in GET:', product ? 'YES' : 'NO');
    
    if (product) {
      console.log('📦 Product details:', {
        id: product._id,
        name: product.name,
        brand: product.brand,
        model: product.model
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        message: product ? 'Product found' : 'Product not found',
        product: product ? {
          id: product._id,
          name: product.name,
          brand: product.brand,
          model: product.model
        } : null
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
