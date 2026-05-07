// app/api/vouchers/validate/route.js
import { auth } from "@/auth";
import connectDB from "@/config/db";
import Voucher from "@/models/voucher";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log('=== VOUCHER VALIDATION API CALLED ===');
    
    const session = await auth();
    const userId = session?.user?.id;
    const { code, orderAmount, cartItems } = await request.json();
    
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
    
    // Find voucher by code
    const voucher = await Voucher.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

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
    
    if (now < startDate) {
      return NextResponse.json({ success: false, message: "This voucher is not yet active" }, { status: 400 });
    }

    if (now > endDate) {
      return NextResponse.json({ success: false, message: "This voucher has expired" }, { status: 400 });
    }

    // Check overall usage limit
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return NextResponse.json({ success: false, message: "This voucher has reached its usage limit" }, { status: 400 });
    }

    // Check user-specific usage limit
    const userUsageCount = voucher.usedBy.filter(usage => usage.userId === userId).length;
    
    if (userUsageCount >= voucher.userUsageLimit) {
      return NextResponse.json({ success: false, message: "You have already used this voucher the maximum number of times" }, { status: 400 });
    }

    // Check minimum order amount
    if (voucher.minOrderAmount && orderAmount < voucher.minOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `Minimum order amount of ₹${voucher.minOrderAmount} required for this voucher`
      }, { status: 400 });
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

    discountAmount = Math.min(discountAmount, orderAmount);

    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        title: voucher.title,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
      },
      discountAmount,
      finalAmount: orderAmount - discountAmount
    });

  } catch (error) {
    console.error('Voucher validation error:', error);
    return NextResponse.json({ success: false, message: "Failed to validate voucher" }, { status: 500 });
  }
}
