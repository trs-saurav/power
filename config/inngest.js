import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";
import Order from "@/models/order";
import { sendOrderStatusUpdateEmail, sendWelcomeEmail } from "@/lib/emailService";

export const inngest = new Inngest({ id: "power-electronics" });

// Inngest function to save user data to the database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { 
        event: 'clerk/user.created'
    },
    async ({event}) => {
        try {
            const {id, first_name, last_name, email_addresses, image_url} = event.data;
            
            const userData = {
                _id: id,
                email: email_addresses[0]?.email_address,
                name: `${first_name || ''} ${last_name || ''}`.trim(),
                firstName: first_name,
                lastName: last_name,
                imageUrl: image_url,
                emailAddresses: email_addresses
            };
            
            await connectDB();
            const createdUser = await User.create(userData);
            
            // Send welcome email
            if (userData.email) {
                try {
                    await sendWelcomeEmail(userData.email, userData.name);
                    console.log('✅ Welcome email sent to new user:', userData.email);
                } catch (emailError) {
                    console.error('❌ Failed to send welcome email:', emailError);
                }
            }
            
            return {
                success: true,
                userId: createdUser._id,
                message: 'User created successfully'
            };
        } catch (error) {
            console.error('Error in syncUserCreation:', error);
            throw error;
        }
    }
);

// Inngest function to update user data in the database
export const syncUserUpdate = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },
    async ({event}) => {
        try {
            const {id, first_name, last_name, email_addresses, image_url} = event.data;
            
            const userData = {
                email: email_addresses[0]?.email_address,
                name: `${first_name || ''} ${last_name || ''}`.trim(),
                firstName: first_name,
                lastName: last_name,
                imageUrl: image_url,
                emailAddresses: email_addresses,
                updatedAt: new Date()
            };
            
            await connectDB();
            const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
            
            return {
                success: true,
                userId: updatedUser?._id,
                message: 'User updated successfully'
            };
        } catch (error) {
            console.error('Error in syncUserUpdate:', error);
            throw error;
        }
    }
);

// Inngest function to delete user data from the database
export const syncUserDeletion = inngest.createFunction( 
    {
        id: 'delete-user-from-clerk'
    },
    {
        event: 'clerk/user.deleted'
    },
    async ({event}) => {
        try {
            const {id} = event.data;
            await connectDB();
            
            // Also handle user's orders - you might want to anonymize instead of delete
            await Order.updateMany(
                { userId: id },
                { 
                    $set: { 
                        userId: 'deleted-user',
                        userDeleted: true,
                        deletedAt: new Date()
                    }
                }
            );
            
            await User.findByIdAndDelete(id);
            
            return {
                success: true,
                userId: id,
                message: 'User deleted successfully'
            };
        } catch (error) {
            console.error('Error in syncUserDeletion:', error);
            throw error;
        }
    }
);

// Inngest function to create user order in the database
export const createUserOrder = inngest.createFunction(
    {
        id: 'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        }
    },
    {
        event: 'order/created'
    },
    async ({events}) => {
        try {
            const orders = events.map((event) => {
                return {
                    userId: event.data.userId,
                    items: event.data.items,
                    amount: event.data.amount,
                    subtotal: event.data.subtotal,
                    deliveryFee: event.data.deliveryFee,
                    discount: event.data.discount,
                    promoCode: event.data.promoCode,
                    appliedVoucher: event.data.appliedVoucher,
                    address: event.data.address,
                    status: "Order Placed", // Fixed status
                    paymentMethod: "COD",
                    payment: false,
                    date: event.data.date,
                    // Add metadata
                    createdVia: 'inngest',
                    batchId: events[0].id // Use first event ID as batch ID
                };
            });
            
            await connectDB();
            const createdOrders = await Order.insertMany(orders);
            
            console.log(`✅ Created ${createdOrders.length} orders via Inngest`);
            
            return {
                success: true,
                processed: createdOrders.length,
                orderIds: createdOrders.map(order => order._id)
            };
        } catch (error) {
            console.error('Error in createUserOrder:', error);
            throw error;
        }
    }
);

// 🆕 NEW: Inngest function to handle order status updates
export const handleOrderStatusUpdate = inngest.createFunction(
    {
        id: 'handle-order-status-update',
        retries: 3
    },
    {
        event: 'order/status-updated'
    },
    async ({event}) => {
        try {
            const {
                orderId,
                oldStatus,
                newStatus,
                userId,
                updatedBy,
                courier,
                trackingId,
                orderAmount,
                items
            } = event.data;
            
            console.log(`📋 Processing status update: ${oldStatus} → ${newStatus} for order ${orderId}`);
            
            await connectDB();
            
            // Get the updated order with full details
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            
            // Get user details for email notification
            const user = await User.findById(userId);
            if (!user) {
                console.log(`⚠️ User ${userId} not found for order ${orderId}`);
                return { success: false, message: 'User not found' };
            }
            
            // Determine email address
            let userEmail = null;
            let userName = null;
            
            if (user.email) {
                userEmail = user.email;
                userName = user.name || user.firstName || 'Valued Customer';
            } else if (user.emailAddresses && user.emailAddresses.length > 0) {
                userEmail = user.emailAddresses[0].email_address;
                userName = user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.firstName || 'Valued Customer';
            }
            
            // Send status update email
            if (userEmail) {
                try {
                    const emailResult = await sendOrderStatusUpdateEmail(
                        order,
                        {
                            name: userName,
                            email: userEmail,
                            firstName: user.firstName,
                            lastName: user.lastName
                        },
                        oldStatus,
                        newStatus
                    );
                    
                    if (emailResult.success) {
                        console.log('✅ Status update email sent via Inngest');
                    } else {
                        console.error('❌ Failed to send status update email via Inngest:', emailResult.error);
                    }
                    
                    return {
                        success: true,
                        emailSent: emailResult.success,
                        orderId: orderId,
                        status: newStatus
                    };
                } catch (emailError) {
                    console.error('❌ Email error in Inngest:', emailError);
                    throw emailError;
                }
            } else {
                console.log('⚠️ No email address found for user, skipping notification');
                return {
                    success: false,
                    message: 'No email address found',
                    orderId: orderId
                };
            }
        } catch (error) {
            console.error('❌ Error in handleOrderStatusUpdate:', error);
            throw error;
        }
    }
);

// 🆕 NEW: Inngest function to handle order cancellations
export const handleOrderCancellation = inngest.createFunction(
    {
        id: 'handle-order-cancellation',
        retries: 2
    },
    {
        event: 'order/cancelled'
    },
    async ({event}) => {
        try {
            const {
                orderId,
                userId,
                cancellationReason,
                refundAmount,
                cancelledBy
            } = event.data;
            
            console.log(`❌ Processing order cancellation for order ${orderId}`);
            
            await connectDB();
            
            // Update order status and add cancellation details
            const order = await Order.findByIdAndUpdate(
                orderId,
                {
                    status: 'Cancelled',
                    cancellation: {
                        reason: cancellationReason || 'Order cancelled',
                        cancelledAt: new Date(),
                        cancelledBy: cancelledBy,
                        refundStatus: 'Pending',
                        refundAmount: refundAmount
                    },
                    $push: {
                        statusHistory: {
                            status: 'Cancelled',
                            updatedAt: new Date(),
                            updatedBy: cancelledBy,
                            note: `Order cancelled: ${cancellationReason}`
                        }
                    }
                },
                { new: true }
            );
            
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            
            // Get user and send cancellation email
            const user = await User.findById(userId);
            if (user) {
                const userEmail = user.email || user.emailAddresses?.[0]?.email_address;
                const userName = user.name || user.firstName || 'Valued Customer';
                
                if (userEmail) {
                    const emailResult = await sendOrderStatusUpdateEmail(
                        order,
                        {
                            name: userName,
                            email: userEmail,
                            firstName: user.firstName,
                            lastName: user.lastName
                        },
                        'Processing', // Assume previous status
                        'Cancelled'
                    );
                    
                    console.log(emailResult.success ? '✅ Cancellation email sent' : '❌ Failed to send cancellation email');
                }
            }
            
            return {
                success: true,
                orderId: orderId,
                status: 'Cancelled'
            };
        } catch (error) {
            console.error('❌ Error in handleOrderCancellation:', error);
            throw error;
        }
    }
);



