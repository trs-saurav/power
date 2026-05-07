// api/admin/vouchers/route.js
import connectDB from "@/config/db";
import Voucher from "@/models/voucher";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// GET - Fetch all vouchers for admin
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status'); // active, expired, inactive
    const search = searchParams.get('search');

    await connectDB();

    // Build query
    let query = {};
    
    if (status === 'active') {
      query.isActive = true;
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    } else if (status === 'expired') {
      query.endDate = { $lt: new Date() };
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [vouchers, totalCount] = await Promise.all([
      Voucher.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean(),
      Voucher.countDocuments(query)
    ]);

    // Get statistics
    const [activeCount, expiredCount, totalUsage] = await Promise.all([
      Voucher.countDocuments({
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      }),
      Voucher.countDocuments({ endDate: { $lt: new Date() } }),
      Voucher.aggregate([
        { $group: { _id: null, totalUsed: { $sum: "$usedCount" } } }
      ])
    ]);

    return NextResponse.json({
      success: true,
      vouchers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit
      },
      statistics: {
        activeCount,
        expiredCount,
        totalUsage: totalUsage[0]?.totalUsed || 0
      }
    });

  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create new voucher
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const body = await request.json();
    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      maxDiscountAmount,
      usageLimit,
      userUsageLimit,
      startDate,
      endDate,
      minOrderAmount,
      maxOrderAmount,
      applicableCategories,
      applicableBrands,
      isActive
    } = body;

    // Validation
    if (!code || !title || !description || !discountType || !discountValue || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return NextResponse.json(
        { success: false, message: "End date must be after start date" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if voucher code already exists
    const existingVoucher = await Voucher.findOne({ code: code.toUpperCase() });
    if (existingVoucher) {
      return NextResponse.json(
        { success: false, message: "Voucher code already exists" },
        { status: 400 }
      );
    }

    const newVoucher = await Voucher.create({
      code: code.toUpperCase(),
      title,
      description,
      discountType,
      discountValue,
      maxDiscountAmount: discountType === 'percentage' ? maxDiscountAmount : null,
      usageLimit,
      userUsageLimit: userUsageLimit || 1,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      minOrderAmount: minOrderAmount || 0,
      maxOrderAmount,
      applicableCategories: applicableCategories || [],
      applicableBrands: applicableBrands || [],
      isActive: isActive !== false,
      createdBy: userId
    });

    return NextResponse.json({
      success: true,
      message: "Voucher created successfully",
      voucher: newVoucher
    });

  } catch (error) {
    console.error("Error creating voucher:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create voucher" },
      { status: 500 }
    );
  }
}
