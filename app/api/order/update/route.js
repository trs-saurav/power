// app/api/order/update/route.js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/order";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        console.log('=== ORDER UPDATE API CALLED ===');
        
        const { userId } = getAuth(request);
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

        console.log('Update request:', { orderId, status, payment, courier, trackingId });

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: "Order ID is required" },
                { status: 400 }
            );
        }

        await connectDB();

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        // Prepare update data
        const updateData = {};
        const statusHistoryEntry = {
            updatedAt: new Date(),
            updatedBy: userId
        };

        // Update status if provided
        if (status && status !== order.status) {
            updateData.status = status;
            statusHistoryEntry.status = status;
            
            // Handle special status cases
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

        // Update payment status
        if (typeof payment === 'boolean' && payment !== order.payment) {
            updateData.payment = payment;
            if (payment) {
                statusHistoryEntry.note = (statusHistoryEntry.note || '') + ' Payment confirmed';
            }
        }

        // Update courier information
        if (courier || trackingId || trackingUrl) {
            updateData.courier = {
                name: courier || order.courier?.name || null,
                trackingId: trackingId || order.courier?.trackingId || null,
                trackingUrl: trackingUrl || order.courier?.trackingUrl || null
            };
        }

        // Update admin notes
        if (adminNotes !== undefined) {
            updateData.adminNotes = adminNotes;
        }

        // Update expected delivery date
        if (expectedDeliveryDate) {
            updateData.expectedDeliveryDate = new Date(expectedDeliveryDate);
        }

        // Add status history entry if there are meaningful updates
        if (statusHistoryEntry.status || statusHistoryEntry.note) {
            updateData.$push = { statusHistory: statusHistoryEntry };
        }

        // Update the order
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        console.log('Order updated successfully:', updatedOrder._id);

        // Send Inngest event for status changes
        if (status && status !== order.status) {
            try {
                await inngest.send({
                    name: "order/status-updated",
                    data: {
                        orderId: orderId,
                        oldStatus: order.status,
                        newStatus: status,
                        userId: order.userId,
                        updatedBy: userId,
                        courier: courier || null,
                        trackingId: trackingId || null,
                        date: Date.now()
                    },
                });
                console.log('Status update event sent to Inngest');
            } catch (inngestError) {
                console.error('Inngest error:', inngestError);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Order update error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to update order"
        }, { status: 500 });
    }
}
