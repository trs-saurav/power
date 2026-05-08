import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";
import Order from "@/models/order";
import Voucher from "@/models/voucher";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail, sendWelcomeEmail } from "@/lib/emailService";

export const inngest = new Inngest({ id: "power-electronics" });

// User creation function (triggered from NextAuth signup endpoint)
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-creation',
        triggers: [{ event: 'user/signup' }]
    },
    async ({event}) => {
        try {
            const { userId, email, firstName, lastName, name, imageUrl } = event.data;
            
            const userData = {
                _id: userId,
                email: email,
                name: name || `${firstName || ''} ${lastName || ''}`.trim(),
                firstName: firstName,
                lastName: lastName,
                imageUrl: imageUrl || null,
                createdAt: new Date()
            };
            
            await connectDB();
            
            // Check if user already exists
            let existingUser = await User.findById(userId);
            if (!existingUser) {
                const createdUser = await User.create(userData);
                console.log('✅ User created in database:', createdUser._id);
                
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
            } else {
                console.log('ℹ️ User already exists:', userId);
                return {
                    success: true,
                    userId: existingUser._id,
                    message: 'User already exists'
                };
            }
        } catch (error) {
            console.error('Error in syncUserCreation:', error);
            throw error;
        }
    }
);

// User update function (triggered from NextAuth profile update endpoint)
export const syncUserUpdate = inngest.createFunction(
    {
        id: 'sync-user-update',
        triggers: [{ event: 'user/update' }]
    },
    async ({event}) => {
        try {
            const { userId, email, firstName, lastName, name, imageUrl } = event.data;
            
            const userData = {
                email: email,
                name: name || `${firstName || ''} ${lastName || ''}`.trim(),
                firstName: firstName,
                lastName: lastName,
                imageUrl: imageUrl || null,
                updatedAt: new Date()
            };
            
            await connectDB();
            const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
            
            if (updatedUser) {
                console.log('✅ User updated in database:', userId);
                return {
                    success: true,
                    userId: updatedUser._id,
                    message: 'User updated successfully'
                };
            } else {
                console.log('⚠️ User not found for update:', userId);
                return {
                    success: false,
                    message: 'User not found'
                };
            }
        } catch (error) {
            console.error('Error in syncUserUpdate:', error);
            throw error;
        }
    }
);

// User deletion function (triggered from NextAuth logout/account deletion)
export const syncUserDeletion = inngest.createFunction( 
    {
        id: 'sync-user-deletion',
        triggers: [{ event: 'user/delete' }]
    },
    async ({event}) => {
        try {
            const { userId } = event.data;
            await connectDB();
            
            // Update all orders to mark them as from deleted user
            await Order.updateMany(
                { userId: userId },
                { 
                    $set: { 
                        userId: 'deleted-user',
                        userDeleted: true,
                        deletedAt: new Date()
                    }
                }
            );
            
            // Delete the user
            const deletedUser = await User.findByIdAndDelete(userId);
            
            if (deletedUser) {
                console.log('✅ User deleted from database:', userId);
                return {
                    success: true,
                    userId: userId,
                    message: 'User deleted successfully'
                };
            } else {
                console.log('⚠️ User not found for deletion:', userId);
                return {
                    success: false,
                    message: 'User not found'
                };
            }
        } catch (error) {
            console.error('Error in syncUserDeletion:', error);
            throw error;
        }
    }
);

// 🚀 MAIN ORDER CREATION FUNCTION - Handles COMPLETE order lifecycle
// In config/inngest.js - Updated createOrder function with more logging
export const createOrder = inngest.createFunction(
    {
        id: 'create-order',
        retries: 3,
        triggers: [{ event: 'order/create' }]
    },
    async ({event, step}) => {
        console.log('🔥 Inngest createOrder function triggered');
        console.log('📊 Event data received:', JSON.stringify(event.data, null, 2));

        const {
            tempOrderId,
            userId,
            items,
            amount,
            subtotal,
            deliveryFee,
            discount,
            promoCode,
            appliedVoucher,
            voucherCode,
            address,
            status,
            paymentMethod,
            payment,
            date,
            userEmail,
            userName
        } = event.data;

        console.log('🚀 Creating order via Inngest for user:', userId);

        // Step 1: Create order in database
        const savedOrder = await step.run("create-order-in-db", async () => {
            console.log('🔄 Step 1: Connecting to database...');
            await connectDB();
            console.log('✅ Database connected successfully');
            
            const orderData = {
                userId: userId,
                items: items,
                amount: amount,
                subtotal: subtotal,
                deliveryFee: deliveryFee,
                discount: discount,
                promoCode: promoCode,
                appliedVoucher: appliedVoucher,
                address: address,
                status: status,
                paymentMethod: paymentMethod,
                payment: payment,
                date: date
            };

            console.log('🔄 Creating order with data:', JSON.stringify(orderData, null, 2));

            try {
                const newOrder = new Order(orderData);
                const order = await newOrder.save();
                
                console.log('✅ Order created successfully in database:', order._id);
                console.log('📄 Created order details:', JSON.stringify(order, null, 2));
                return order;
            } catch (dbError) {
                console.error('❌ Database error creating order:', dbError);
                throw new Error(`Failed to create order in database: ${dbError.message}`);
            }
        });

        // Rest of your steps remain the same...
        // Step 2: Update voucher usage (if applicable)
        if (voucherCode) {
            await step.run("update-voucher-usage", async () => {
                try {
                    console.log('🔄 Step 2: Updating voucher usage for:', voucherCode);
                    await connectDB();
                    const voucherResult = await Voucher.findOneAndUpdate(
                        { code: voucherCode },
                        {
                            $inc: { usedCount: 1 },
                            $push: {
                                usedBy: {
                                    userId: userId,
                                    usedAt: new Date(),
                                    orderAmount: subtotal,
                                    discountApplied: discount
                                }
                            }
                        }
                    );
                    console.log('✅ Voucher usage updated:', voucherResult ? 'Found' : 'Not found');
                    return { success: true };
                } catch (voucherError) {
                    console.error('❌ Error updating voucher usage:', voucherError);
                    return { success: false, error: voucherError.message };
                }
            });
        }

        // Step 3: Send order confirmation email
        if (userEmail) {
            await step.run("send-confirmation-email", async () => {
                try {
                    console.log('🔄 Step 3: Sending confirmation email to:', userEmail);
                    const emailResult = await sendOrderConfirmationEmail(
                        savedOrder,
                        userEmail,
                        userName
                    );
                    
                    if (emailResult.success) {
                        console.log('✅ Order confirmation email sent successfully');
                    } else {
                        console.error('❌ Failed to send confirmation email:', emailResult.error);
                    }
                    
                    return emailResult;
                } catch (emailError) {
                    console.error('❌ Email sending error:', emailError);
                    return { success: false, error: emailError.message };
                }
            });
        }

        // Step 4: Clear user cart
        await step.run("clear-user-cart", async () => {
            try {
                console.log('🔄 Step 4: Clearing user cart for:', userId);
                await connectDB();
                const cartResult = await User.findByIdAndUpdate(userId, {
                    $unset: { cartItems: 1 }
                });
                console.log('✅ User cart cleared:', cartResult ? 'Success' : 'User not found');
                return { success: true };
            } catch (cartError) {
                console.error('❌ Cart clear error:', cartError);
                return { success: false, error: cartError.message };
            }
        });

        console.log('🎉 Order creation completed successfully');
        return {
            success: true,
            orderId: savedOrder._id.toString(),
            orderNumber: savedOrder._id.toString().slice(-8).toUpperCase(),
            message: 'Order created and processed successfully'
        };
    }
);


// 📋 Order post-processing function
export const processOrderCreated = inngest.createFunction(
    {
        id: 'process-order-created',
        retries: 2,
        triggers: [{ event: 'order/created' }]
    },
    async ({event}) => {
        try {
            const { orderId, userId, amount, items } = event.data;
            
            console.log('📋 Processing order created event for:', orderId);
            
            // Handle analytics, inventory updates, third-party sync, etc.
            console.log(`📊 Analytics: User ${userId} placed order ${orderId} worth ₹${amount}`);
            
            return {
                success: true,
                processed: orderId,
                message: 'Order post-processing completed'
            };
        } catch (error) {
            console.error('❌ Error in processOrderCreated:', error);
            throw error;
        }
    }
);

// 🔄 Order status update function
export const handleOrderStatusUpdate = inngest.createFunction(
    {
        id: 'handle-order-status-update',
        retries: 3,
        triggers: [{ event: 'order/status-updated' }]
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
                trackingId
            } = event.data;
            
            console.log(`📋 Processing status update: ${oldStatus} → ${newStatus} for order ${orderId}`);
            
            await connectDB();
            
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            
            const user = await User.findById(userId);
            if (!user) {
                console.log(`⚠️ User ${userId} not found for order ${orderId}`);
                return { success: false, message: 'User not found' };
            }
            
            let userEmail = null;
            let userName = null;
            
            if (user.email) {
                userEmail = user.email;
                userName = user.name || user.firstName || 'Valued Customer';
            } else if (user.emailAddresses && user.emailAddresses.length > 0) {
                userEmail = user.emailAddresses[0].email_address || user.emailAddresses[0].emailAddress;
                userName = user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.firstName || 'Valued Customer';
            }
            
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

// 🗑️ Order cancellation function
export const handleOrderCancellation = inngest.createFunction(
    {
        id: 'handle-order-cancellation',
        retries: 2,
        triggers: [{ event: 'order/cancelled' }]
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
            
            const user = await User.findById(userId);
            if (user) {
                const userEmail = user.email || user.emailAddresses?.[0]?.email_address || user.emailAddresses?.[0]?.emailAddress;
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
                        'Processing',
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
