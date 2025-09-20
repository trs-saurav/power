// app/api/vouchers/validate/route.js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Voucher from "@/models/voucher";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log('=== VOUCHER VALIDATION API CALLED ===');
    
    const { userId } = getAuth(request);
    const { code, orderAmount, cartItems } = await request.json();
    
    console.log('Validation request:', { userId, code, orderAmount, cartItemsCount: Object.keys(cartItems || {}).length });

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Authentication required"
      }, { status: 401 });
    }
    
    if (!code) {
      return NextResponse.json({
        success: false,
        message: "Voucher code is required"
      }, { status: 400 });
    }

    await connectDB();
    console.log('Database connected');
    
    // Find voucher by code
    const voucher = await Voucher.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    console.log('Voucher found:', !!voucher);

    if (!voucher) {
      return NextResponse.json({
        success: false,
        message: "Invalid voucher code"
      }, { status: 404 });
    }

    // Check if voucher is within date range
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    
    console.log('Date check:', { now: now.toISOString(), startDate: startDate.toISOString(), endDate: endDate.toISOString() });

    if (now < startDate) {
      return NextResponse.json({
        success: false,
        message: "This voucher is not yet active"
      }, { status: 400 });
    }

    if (now > endDate) {
      return NextResponse.json({
        success: false,
        message: "This voucher has expired"
      }, { status: 400 });
    }

    // Check overall usage limit
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return NextResponse.json({
        success: false,
        message: "This voucher has reached its usage limit"
      }, { status: 400 });
    }

    // Check user-specific usage limit
    const userUsageCount = voucher.usedBy.filter(usage => usage.userId === userId).length;
    console.log('User usage count:', userUsageCount, 'Limit:', voucher.userUsageLimit);
    
    if (userUsageCount >= voucher.userUsageLimit) {
      return NextResponse.json({
        success: false,
        message: "You have already used this voucher the maximum number of times"
      }, { status: 400 });
    }

    // Check minimum order amount
    if (voucher.minOrderAmount && orderAmount < voucher.minOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `Minimum order amount of ₹${voucher.minOrderAmount} required for this voucher`,
        minAmount: voucher.minOrderAmount
      }, { status: 400 });
    }

    // Check maximum order amount
    if (voucher.maxOrderAmount && orderAmount > voucher.maxOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `This voucher is only valid for orders up to ₹${voucher.maxOrderAmount}`,
        maxAmount: voucher.maxOrderAmount
      }, { status: 400 });
    }

    // Check category restrictions (if cart items provided)
    if (voucher.applicableCategories.length > 0 && cartItems) {
      const cartProductIds = Object.keys(cartItems);
      const products = await Product.find({ 
        _id: { $in: cartProductIds } 
      }, 'category');
      
      const cartCategories = products.map(p => p.category);
      const hasValidCategory = cartCategories.some(cat => 
        voucher.applicableCategories.includes(cat)
      );
      
      if (!hasValidCategory) {
        return NextResponse.json({
          success: false,
          message: `This voucher is only applicable to: ${voucher.applicableCategories.join(', ')}`
        }, { status: 400 });
      }
    }

    // Check brand restrictions (if cart items provided)
    if (voucher.applicableBrands.length > 0 && cartItems) {
      const cartProductIds = Object.keys(cartItems);
      const products = await Product.find({ 
        _id: { $in: cartProductIds } 
      }, 'brand');
      
      const cartBrands = products.map(p => p.brand);
      const hasValidBrand = cartBrands.some(brand => 
        voucher.applicableBrands.includes(brand)
      );
      
      if (!hasValidBrand) {
        return NextResponse.json({
          success: false,
          message: `This voucher is only applicable to brands: ${voucher.applicableBrands.join(', ')}`
        }, { status: 400 });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (voucher.discountType === 'percentage') {
      discountAmount = (orderAmount * voucher.discountValue) / 100;
      if (voucher.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, voucher.maxDiscountAmount);
      }
    } else if (voucher.discountType === 'fixed_amount') {
      discountAmount = voucher.discountValue;
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    console.log('Discount calculated:', discountAmount);

    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        title: voucher.title,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        usedCount: voucher.usedCount,
        usageLimit: voucher.usageLimit,
        userUsageCount: userUsageCount,
        userUsageLimit: voucher.userUsageLimit,
        remainingUses: voucher.userUsageLimit - userUsageCount
      },
      discountAmount,
      finalAmount: orderAmount - discountAmount
    });

  } catch (error) {
    console.error('Voucher validation error:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to validate voucher",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
