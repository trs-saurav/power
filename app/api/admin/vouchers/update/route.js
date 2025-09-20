// api/admin/vouchers/update/route.js
import connectDB from "@/config/db";
import Voucher from "@/models/voucher";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// PATCH method for updating voucher status
export async function PATCH(request) {
  try {
    console.log('=== VOUCHER STATUS UPDATE API CALLED ===');
    
    // Auth check
    const { userId } = getAuth(request);
    console.log('User ID:', userId);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const isAdmin = await authSeller(userId);
    console.log('Is Admin:', isAdmin);
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const { voucherId, action, value } = body;

    if (!voucherId || !action) {
      return NextResponse.json(
        { success: false, message: "Voucher ID and action are required" },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format
    if (!voucherId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid voucher ID format" },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('Database connected');

    // Check if voucher exists
    const existingVoucher = await Voucher.findById(voucherId);
    console.log('Existing voucher found:', !!existingVoucher);
    
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
        console.log(`Setting voucher ${voucherId} isActive to:`, value);
        break;
        
      case 'disable':
        updateData.isActive = false;
        message = "Voucher disabled successfully";
        console.log(`Disabling voucher ${voucherId}`);
        break;
        
      case 'enable':
        updateData.isActive = true;
        message = "Voucher enabled successfully";
        console.log(`Enabling voucher ${voucherId}`);
        break;
        
      case 'reset_usage':
        updateData.usedCount = 0;
        updateData.usedBy = [];
        message = "Voucher usage reset successfully";
        console.log(`Resetting usage for voucher ${voucherId}`);
        break;
        
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action. Supported actions: toggle_status, disable, enable, reset_usage" },
          { status: 400 }
        );
    }

    console.log('Update data:', updateData);

    // Perform the update
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validation
      }
    );

    if (!updatedVoucher) {
      return NextResponse.json(
        { success: false, message: "Failed to update voucher" },
        { status: 500 }
      );
    }

    console.log('Voucher updated successfully:', updatedVoucher._id);
    console.log('New status:', updatedVoucher.isActive);

    return NextResponse.json({
      success: true,
      message,
      voucher: {
        id: updatedVoucher._id,
        code: updatedVoucher.code,
        title: updatedVoucher.title,
        isActive: updatedVoucher.isActive,
        usedCount: updatedVoucher.usedCount,
        usageLimit: updatedVoucher.usageLimit,
        updatedAt: updatedVoucher.updatedAt
      },
      action: action,
      newValue: action === 'toggle_status' ? value : updateData.isActive,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error updating voucher status:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to update voucher status",
        error: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          name: error.name
        } : undefined
      },
      { status: 500 }
    );
  }
}

// GET method for fetching single voucher status
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);
    
    if (!isAdmin) {
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

    const voucher = await Voucher.findById(voucherId)
      .select('_id code title isActive usedCount usageLimit updatedAt')
      .lean();

    if (!voucher) {
      return NextResponse.json(
        { success: false, message: "Voucher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher._id,
        code: voucher.code,
        title: voucher.title,
        isActive: voucher.isActive,
        usedCount: voucher.usedCount,
        usageLimit: voucher.usageLimit,
        updatedAt: voucher.updatedAt
      }
    });

  } catch (error) {
    console.error("Error fetching voucher:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch voucher" },
      { status: 500 }
    );
  }
}

// PUT method for batch status updates
export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { voucherIds, action, value } = body;

    if (!Array.isArray(voucherIds) || voucherIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Voucher IDs array is required" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action is required" },
        { status: 400 }
      );
    }

    await connectDB();

    let updateData = {};
    let message = "";

    switch (action) {
      case 'disable_all':
        updateData.isActive = false;
        message = `${voucherIds.length} vouchers disabled successfully`;
        break;
        
      case 'enable_all':
        updateData.isActive = true;
        message = `${voucherIds.length} vouchers enabled successfully`;
        break;
        
      case 'set_status':
        updateData.isActive = value;
        message = `${voucherIds.length} vouchers ${value ? 'enabled' : 'disabled'} successfully`;
        break;
        
      default:
        return NextResponse.json(
          { success: false, message: "Invalid batch action" },
          { status: 400 }
        );
    }

    // Update multiple vouchers
    const updateResult = await Voucher.updateMany(
      { _id: { $in: voucherIds } },
      updateData
    );

    return NextResponse.json({
      success: true,
      message,
      updatedCount: updateResult.modifiedCount,
      requestedCount: voucherIds.length,
      action: action,
      newValue: updateData.isActive
    });

  } catch (error) {
    console.error("Error in batch update:", error);
    return NextResponse.json(
      { success: false, message: "Batch update failed" },
      { status: 500 }
    );
  }
}
