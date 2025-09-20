// api/admin/vouchers/delete/route.js
import connectDB from "@/config/db";
import Voucher from "@/models/voucher";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// DELETE method
export async function DELETE(request) {
  try {
    console.log('=== Voucher Delete API Called ===');
    
    // Auth check
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 }
      );
    }

    // Get voucher ID from URL params or request body
    const { searchParams } = new URL(request.url);
    let voucherId = searchParams.get('id');
    
    // If not in params, try to get from request body
    if (!voucherId) {
      try {
        const body = await request.json();
        voucherId = body.voucherId || body.id;
      } catch (error) {
        // Request might not have body, that's ok
      }
    }

    // Validate voucher ID
    if (!voucherId) {
      return NextResponse.json(
        { success: false, message: "Voucher ID is required" },
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

    // Connect to database
    await connectDB();
    
    // Find the voucher first to get details
    const voucher = await Voucher.findById(voucherId);
    
    if (!voucher) {
      return NextResponse.json(
        { success: false, message: "Voucher not found" },
        { status: 404 }
      );
    }

    // Store voucher details for response
    const voucherDetails = {
      id: voucher._id,
      code: voucher.code,
      title: voucher.title,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      usedCount: voucher.usedCount,
      isActive: voucher.isActive
    };

    // Check if voucher has been used
    const hasBeenUsed = voucher.usedCount > 0;
    
    // Optionally, you might want to prevent deletion of used vouchers
    // Uncomment the following lines if you want this behavior:
    /*
    if (hasBeenUsed) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot delete voucher that has been used. Consider deactivating it instead.",
          usedCount: voucher.usedCount
        },
        { status: 400 }
      );
    }
    */

    // Delete the voucher from database
    const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);
    
    if (!deletedVoucher) {
      return NextResponse.json(
        { success: false, message: "Failed to delete voucher from database" },
        { status: 500 }
      );
    }

    console.log(`Voucher ${voucher.code} deleted successfully`);

    // Success response
    return NextResponse.json({
      success: true,
      message: "Voucher deleted successfully",
      deletedVoucher: voucherDetails,
      warnings: hasBeenUsed ? [`This voucher was used ${voucher.usedCount} times`] : [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error deleting voucher:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to delete voucher",
        error: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          name: error.name
        } : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST method (alternative way to delete via POST request)
export async function POST(request) {
  try {
    const body = await request.json();
    const { voucherId, action, confirmUsed } = body;
    
    if (action !== 'delete') {
      return NextResponse.json(
        { success: false, message: "Invalid action. Use 'delete'" },
        { status: 400 }
      );
    }
    
    // Create a new request object with the voucherId in searchParams
    const url = new URL(request.url);
    url.searchParams.set('id', voucherId);
    
    const newRequest = new Request(url, {
      method: 'DELETE',
      headers: request.headers,
      body: JSON.stringify({ confirmUsed })
    });
    
    return DELETE(newRequest);
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}

// Bulk delete method
export async function PATCH(request) {
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
    const { voucherIds, action } = body;

    if (action !== 'bulk_delete' || !Array.isArray(voucherIds)) {
      return NextResponse.json(
        { success: false, message: "Invalid bulk delete request" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get voucher details before deletion
    const vouchers = await Voucher.find({ 
      _id: { $in: voucherIds } 
    }).select('_id code title usedCount');

    if (vouchers.length === 0) {
      return NextResponse.json(
        { success: false, message: "No vouchers found" },
        { status: 404 }
      );
    }

    // Delete vouchers
    const deleteResult = await Voucher.deleteMany({ 
      _id: { $in: voucherIds } 
    });

    return NextResponse.json({
      success: true,
      message: `${deleteResult.deletedCount} vouchers deleted successfully`,
      deletedCount: deleteResult.deletedCount,
      deletedVouchers: vouchers.map(v => ({
        id: v._id,
        code: v.code,
        title: v.title,
        wasUsed: v.usedCount > 0
      }))
    });

  } catch (error) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { success: false, message: "Bulk delete failed" },
      { status: 500 }
    );
  }
}

// GET method for testing (optional)
export async function GET(request) {
  return NextResponse.json({
    message: "Voucher deletion endpoint",
    methods: {
      DELETE: "Delete voucher by ID",
      POST: "Delete voucher via POST with action='delete'",
      PATCH: "Bulk delete vouchers"
    },
    usage: {
      DELETE: "DELETE /api/admin/vouchers/delete?id=VOUCHER_ID",
      POST: "POST /api/admin/vouchers/delete with body: {voucherId: 'ID', action: 'delete'}",
      PATCH: "PATCH /api/admin/vouchers/delete with body: {voucherIds: ['ID1', 'ID2'], action: 'bulk_delete'}"
    }
  });
}
