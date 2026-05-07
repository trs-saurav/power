// app/api/order/update/route.js
import connectDB from "@/config/db";
import { auth } from "@/auth";
import Order from "@/models/order";
import User from "@/models/user";
import { inngest } from "@/config/inngest";
import { sendOrderStatusUpdateEmail } from "@/lib/emailService";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id || session.user.email;
        const body = await request.json();
        const { 
            orderId, 
            status, 
            payment, 
            courier, 
            trackingId, 
            trackingUrl,
            adminNotes,
            expectedDeliveryDate,
            cancellationReason
        } = body;

        if (!orderId) {
            return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
        }

        await connectDB();

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        const originalStatus = order.status;
        const updateData = {};
        const statusHistoryEntry = {
            updatedAt: new Date(),
            updatedBy: userId
        };

        if (status && status !== order.status) {
            updateData.status = status;
            statusHistoryEntry.status = status;
            
            if (status === 'Delivered') {
                updateData.actualDeliveryDate = new Date();
                statusHistoryEntry.note = 'Order marked as delivered';
            } else if (status === 'Cancelled') {
                updateData.cancellation = {
                    reason: cancellationReason || 'Cancelled by admin',
                    cancelledAt: new Date(),
                    cancelledBy: userId,
                    refundStatus: 'Pending'
                };
                statusHistoryEntry.note = `Order cancelled: ${cancellationReason || 'Cancelled by admin'}`;
            } else if (status === 'Shipped') {
                statusHistoryEntry.note = `Order shipped${courier ? ` via ${courier}` : ''}${trackingId ? ` (Tracking: ${trackingId})` : ''}`;
            }
        }

        if (typeof payment === 'boolean' && payment !== order.payment) {
            updateData.payment = payment;
        }

        if (courier || trackingId || trackingUrl) {
            updateData.courier = {
                name: courier || order.courier?.name || null,
                trackingId: trackingId || order.courier?.trackingId || null,
                trackingUrl: trackingUrl || order.courier?.trackingUrl || null
            };
        }

        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (expectedDeliveryDate) updateData.expectedDeliveryDate = new Date(expectedDeliveryDate);

        if (statusHistoryEntry.status || statusHistoryEntry.note) {
            updateData.$push = { statusHistory: statusHistoryEntry };
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

        // Email logic
        if (status && status !== originalStatus) {
            try {
                const customerUser = await User.findById(order.userId);
                if (customerUser && customerUser.email) {
                    await sendOrderStatusUpdateEmail(
                        updatedOrder,
                        {
                            name: customerUser.name || 'Valued Customer',
                            email: customerUser.email
                        },
                        originalStatus,
                        status
                    );
                }
            } catch (emailError) {
                console.error('Email process error:', emailError);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Order update error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
