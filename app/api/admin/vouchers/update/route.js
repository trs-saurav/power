// api/admin/vouchers/update/route.js
import connectDB from "@/config/db";
import Voucher from "@/models/voucher";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// PATCH method for updating voucher status
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { voucherId, action, value } = body;

    if (!voucherId || !action) {
      return NextResponse.json(
        { success: false, message: "Voucher ID and action are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingVoucher = await Voucher.findById(voucherId);
    if (!existingVoucher) {
      return NextResponse.json(
        { success: false, message: "Voucher not found" },
        { status: 404 }
      );
    }

    let updateData = {};
    let message = "";

    switch (action) {
      case 'toggle_status':
        updateData.isActive = value;
        message = `Voucher ${value ? 'activated' : 'deactivated'} successfully`;
        break;
      case 'disable':
        updateData.isActive = false;
        message = "Voucher disabled successfully";
        break;
      case 'enable':
        updateData.isActive = true;
        message = "Voucher enabled successfully";
        break;
      case 'reset_usage':
        updateData.usedCount = 0;
        updateData.usedBy = [];
        message = "Voucher usage reset successfully";
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message,
      voucher: updatedVoucher
    });

  } catch (error) {
    console.error("Error updating voucher status:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update voucher status" },
      { status: 500 }
    );
  }
}

// GET method for fetching single voucher status
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
    const voucherId = searchParams.get('id');

    if (!voucherId) {
      return NextResponse.json(
        { success: false, message: "Voucher ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const voucher = await Voucher.findById(voucherId).lean();

    if (!voucher) {
      return NextResponse.json({ success: false, message: "Voucher not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, voucher });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch voucher" }, { status: 500 });
  }
}

// PUT method for batch status updates
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { voucherIds, action, value } = body;

    if (!Array.isArray(voucherIds) || voucherIds.length === 0 || !action) {
      return NextResponse.json({ success: false, message: "Invalid batch request" }, { status: 400 });
    }

    await connectDB();
    let updateData = {};
    if (action === 'disable_all') updateData.isActive = false;
    else if (action === 'enable_all') updateData.isActive = true;
    else if (action === 'set_status') updateData.isActive = value;

    const updateResult = await Voucher.updateMany({ _id: { $in: voucherIds } }, updateData);

    return NextResponse.json({
      success: true,
      message: `${updateResult.modifiedCount} vouchers updated successfully`,
      updatedCount: updateResult.modifiedCount
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Batch update failed" }, { status: 500 });
  }
}
