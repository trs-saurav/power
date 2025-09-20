// app/api/order/update/route.js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/order";
import User from "@/models/user";
import { inngest } from "@/config/inngest";
import { sendOrderStatusUpdateEmail } from "@/lib/emailService";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {

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

        // Store original status for email comparison
        const originalStatus = order.status;

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
            } else if (status === 'Processing') {
                statusHistoryEntry.note = 'Order is being processed';
            } else if (status === 'Packed') {
                statusHistoryEntry.note = 'Order has been packed and ready for shipping';
            } else if (status === 'Out for Delivery') {
                statusHistoryEntry.note = 'Order is out for delivery';
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


        // 🎯 SEND STATUS UPDATE EMAIL (Only for status changes)
        if (status && status !== originalStatus) {
            try {
                // Get user details for email
                const customerUser = await User.findById(order.userId);
                
                if (customerUser) {
                    // Get user email - try multiple sources
                    let userEmail = null;
                    let userName = null;

                    // Method 1: Check if user has email field in database
                    if (customerUser.email) {
                        userEmail = customerUser.email;
                        userName = customerUser.name || customerUser.firstName || 'Valued Customer';
                    } 
                    // Method 2: Check if user has emailAddresses array (Clerk format)
                    else if (customerUser.emailAddresses && customerUser.emailAddresses.length > 0) {
                        userEmail = customerUser.emailAddresses[0].emailAddress;
                        userName = customerUser.firstName && customerUser.lastName 
                            ? `${customerUser.firstName} ${customerUser.lastName}` 
                            : customerUser.firstName || 'Valued Customer';
                    }

                    if (userEmail) {
                 
                        // 🔥 CORRECTED: Pass parameters in the right order
                        // Template expects: (order, user, oldStatus, newStatus)
                        const emailResult = await sendOrderStatusUpdateEmail(
                            updatedOrder,           // order object
                            {                       // user object
                                name: userName,
                                email: userEmail,
                                firstName: customerUser.firstName,
                                lastName: customerUser.lastName
                            },
                            originalStatus,         // oldStatus
                            status                  // newStatus
                        );
                        
                        if (emailResult.success) {
                            console.log('✅ Order status update email sent successfully');
                        } else {
                            console.error('❌ Failed to send status update email:', emailResult.error);
                        }
                    } else {
                        console.log('⚠️  No email address found for customer, skipping email notification');
                        console.log('Customer user data:', JSON.stringify(customerUser, null, 2));
                    }
                } else {
                    console.log('⚠️  Customer user not found, skipping email notification');
                }
            } catch (emailError) {
                console.error('❌ Error in status update email process:', emailError);
                // Don't fail the update if email fails - just log the error
            }
        }

        // 🎯 SEND EMAIL FOR PAYMENT STATUS CHANGES TOO
        if (typeof payment === 'boolean' && payment !== order.payment && payment === true) {
            try {
                // Get user details for payment confirmation email
                const customerUser = await User.findById(order.userId);
                
                if (customerUser) {
                    let userEmail = null;
                    let userName = null;

                    if (customerUser.email) {
                        userEmail = customerUser.email;
                        userName = customerUser.name || customerUser.firstName || 'Valued Customer';
                    } else if (customerUser.emailAddresses && customerUser.emailAddresses.length > 0) {
                        userEmail = customerUser.emailAddresses[0].emailAddress;
                        userName = customerUser.firstName && customerUser.lastName 
                            ? `${customerUser.firstName} ${customerUser.lastName}` 
                            : customerUser.firstName || 'Valued Customer';
                    }

                    if (userEmail) {
                        console.log(`💰 Sending payment confirmation email to: ${userEmail}`);
                        
                        // Send payment confirmation as status update
                        const emailResult = await sendOrderStatusUpdateEmail(
                            updatedOrder,
                            {
                                name: userName,
                                email: userEmail,
                                firstName: customerUser.firstName,
                                lastName: customerUser.lastName
                            },
                            'Payment Pending',
                            'Payment Confirmed'
                        );
                        
                        if (emailResult.success) {
                            console.log('✅ Payment confirmation email sent successfully');
                        } else {
                            console.error('❌ Failed to send payment confirmation email:', emailResult.error);
                        }
                    }
                }
            } catch (emailError) {
                console.error('❌ Error in payment confirmation email process:', emailError);
            }
        }

        // Send Inngest event for status changes
        if (status && status !== originalStatus) {
            try {
                await inngest.send({
                    name: "order/status-updated",
                    data: {
                        orderId: orderId,
                        oldStatus: originalStatus,
                        newStatus: status,
                        userId: order.userId,
                        updatedBy: userId,
                        courier: courier || null,
                        trackingId: trackingId || null,
                        date: Date.now(),
                        orderAmount: order.amount,
                        customerEmail: null,
                        items: order.items
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
            order: updatedOrder,
            statusChanged: status && status !== originalStatus,
            paymentChanged: typeof payment === 'boolean' && payment !== order.payment,
            emailSent: (status && status !== originalStatus) || (typeof payment === 'boolean' && payment !== order.payment && payment === true)
        });

    } catch (error) {
        console.error("Order update error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to update order"
        }, { status: 500 });
    }
}
