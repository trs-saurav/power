import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/user";
import Product from "@/models/product";
import Voucher from "@/models/voucher";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const body = await request.json();
        const { items, address, promoCode, discount, subtotal } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        if (!address || !items || items.length === 0) {
            return NextResponse.json(
                { success: false, message: "Address and cart items are required" },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Validate products and calculate amount (but don't create order here)
        let totalAmount = 0;
        const validatedItems = [];
        const notFoundProducts = [];

        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity <= 0) {
                continue;
            }

            const product = await Product.findById(item.productId);
            
            if (!product) {
                console.error(`Product not found: ${item.productId}`);
                notFoundProducts.push(item.productId);
                continue;
            }

            // Check product availability
            if (product.availability === "out_of_stock" || product.availability === "discontinued") {
                return NextResponse.json(
                    { success: false, message: `Product "${product.name}" is currently unavailable` },
                    { status: 400 }
                );
            }

            const price = product.offerPrice || product.price;
            if (!price || price <= 0) {
                return NextResponse.json(
                    { success: false, message: `Product "${product.name}" has invalid pricing` },
                    { status: 400 }
                );
            }

            const itemTotal = price * item.quantity;
            totalAmount += itemTotal;

            // Structure according to your schema
            validatedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                name: product.name,
                image: product.images?.[0] || null,
                price: price,
                total: itemTotal
            });
        }

        if (notFoundProducts.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Products not found: ${notFoundProducts.join(', ')}`,
                    invalidProducts: notFoundProducts
                },
                { status: 400 }
            );
        }

        if (validatedItems.length === 0) {
            return NextResponse.json(
                { success: false, message: "No valid items found in cart" },
                { status: 400 }
            );
        }

        // Calculate delivery fee
        const deliveryFee = totalAmount > 500 ? 0 : 50;

        // Enhanced voucher validation and discount calculation
        let finalDiscount = 0;
        let appliedVoucher = null;

        if (promoCode) {
            console.log(`Processing voucher: ${promoCode}`);
            
            const voucher = await Voucher.findOne({ 
                code: promoCode.toUpperCase(),
                isActive: true 
            });

            if (voucher) {
                const now = new Date();
                const startDate = new Date(voucher.startDate);
                const endDate = new Date(voucher.endDate);

                // Check date validity
                if (now >= startDate && now <= endDate) {
                    
                    // Check overall usage limit
                    if (!voucher.usageLimit || voucher.usedCount < voucher.usageLimit) {
                        
                        // Check user-specific usage limit
                        const userUsageCount = voucher.usedBy.filter(usage => usage.userId === userId).length;
                      
                        if (userUsageCount < voucher.userUsageLimit) {
                            
                            // Check order amount limits
                            const minOrderValid = !voucher.minOrderAmount || totalAmount >= voucher.minOrderAmount;
                            const maxOrderValid = !voucher.maxOrderAmount || totalAmount <= voucher.maxOrderAmount;
                            
                            if (minOrderValid && maxOrderValid) {
                                
                                // Check category restrictions if applicable
                                let categoryValid = true;
                                if (voucher.applicableCategories.length > 0) {
                                    const productIds = validatedItems.map(item => item.productId);
                                    const products = await Product.find({ 
                                        _id: { $in: productIds } 
                                    }, 'category');
                                    
                                    const cartCategories = products.map(p => p.category);
                                    categoryValid = cartCategories.some(cat => 
                                        voucher.applicableCategories.includes(cat)
                                    );
                                    
                                    if (!categoryValid) {
                                        console.log(`Voucher not applicable - categories: ${cartCategories} vs required: ${voucher.applicableCategories}`);
                                    }
                                }

                                // Check brand restrictions if applicable
                                let brandValid = true;
                                if (voucher.applicableBrands.length > 0) {
                                    const productIds = validatedItems.map(item => item.productId);
                                    const products = await Product.find({ 
                                        _id: { $in: productIds } 
                                    }, 'brand');
                                    
                                    const cartBrands = products.map(p => p.brand);
                                    brandValid = cartBrands.some(brand => 
                                        voucher.applicableBrands.includes(brand)
                                    );
                                    
                                    if (!brandValid) {
                                        console.log(`Voucher not applicable - brands: ${cartBrands} vs required: ${voucher.applicableBrands}`);
                                    }
                                }

                                if (categoryValid && brandValid) {
                                    
                                    // Calculate discount
                                    if (voucher.discountType === 'percentage') {
                                        finalDiscount = (totalAmount * voucher.discountValue) / 100;
                                        if (voucher.maxDiscountAmount) {
                                            finalDiscount = Math.min(finalDiscount, voucher.maxDiscountAmount);
                                        }
                                    } else if (voucher.discountType === 'fixed_amount') {
                                        finalDiscount = voucher.discountValue;
                                    }

                                    finalDiscount = Math.min(finalDiscount, totalAmount);

                                    appliedVoucher = {
                                        code: voucher.code,
                                        title: voucher.title,
                                        description: voucher.description,
                                        discountType: voucher.discountType,
                                        discountValue: voucher.discountValue,
                                        appliedDiscount: finalDiscount
                                    };

                                    console.log(`Voucher successfully applied: ${voucher.code}, discount: ${finalDiscount}`);

                                } else {
                                    console.log('Voucher not applicable due to category/brand restrictions');
                                    return NextResponse.json({
                                        success: false,
                                        message: voucher.applicableCategories.length > 0 
                                            ? `This voucher is only applicable to: ${voucher.applicableCategories.join(', ')}`
                                            : `This voucher is only applicable to brands: ${voucher.applicableBrands.join(', ')}`
                                    }, { status: 400 });
                                }
                            } else {
                                const limitMessage = !minOrderValid 
                                    ? `Minimum order amount of ₹${voucher.minOrderAmount} required`
                                    : `Maximum order amount of ₹${voucher.maxOrderAmount} exceeded`;
                                
                                console.log(`Order amount validation failed: ${limitMessage}`);
                                return NextResponse.json({
                                    success: false,
                                    message: limitMessage
                                }, { status: 400 });
                            }
                        } else {
                            console.log(`User has exceeded usage limit for voucher`);
                            return NextResponse.json({
                                success: false,
                                message: "You have already used this voucher the maximum number of times"
                            }, { status: 400 });
                        }
                    } else {
                        console.log('Voucher has reached overall usage limit');
                        return NextResponse.json({
                            success: false,
                            message: "This voucher has reached its usage limit"
                        }, { status: 400 });
                    }
                } else {
                    console.log('Voucher is not within valid date range');
                    return NextResponse.json({
                        success: false,
                        message: now < startDate ? "This voucher is not yet active" : "This voucher has expired"
                    }, { status: 400 });
                }
            } else {
                console.log('Voucher not found or inactive');
                return NextResponse.json({
                    success: false,
                    message: "Invalid voucher code"
                }, { status: 400 });
            }
        } else if (discount) {
            // Fallback for provided discount
            finalDiscount = discount;
            console.log(`Using provided discount: ${finalDiscount}`);
        }

        // Calculate final amount
        const finalAmount = totalAmount + deliveryFee - finalDiscount;

        console.log(`Final calculation: Subtotal: ${totalAmount} + Delivery: ${deliveryFee} - Discount: ${finalDiscount} = Total: ${finalAmount}`);

        // Get user email info
        let userEmail = null;
        let userName = null;

        if (user.email) {
            userEmail = user.email;
            userName = user.name || user.firstName || address.fullName;
        } else if (user.emailAddresses && user.emailAddresses.length > 0) {
            userEmail = user.emailAddresses[0].emailAddress;
            userName = user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.firstName || address.fullName;
        }

        // Generate temporary order ID for tracking
        const tempOrderId = `temp_${userId}_${Date.now()}`;

        // 🚀 SEND TO INNGEST FOR COMPLETE ORDER CREATION (NO ORDER CREATION HERE)
        try {
            await inngest.send({
                id: `create-order-${tempOrderId}`, // Unique deduplication ID
                name: "order/create",
                data: {
                    tempOrderId,
                    userId,
                    items: validatedItems,
                    amount: finalAmount,
                    subtotal: totalAmount,
                    deliveryFee: deliveryFee,
                    discount: finalDiscount,
                    promoCode: promoCode || null,
                    appliedVoucher: appliedVoucher,
                    voucherCode: appliedVoucher?.code || null,
                    address,
                    status: "Order Placed",
                    paymentMethod: "COD",
                    payment: false,
                    date: Date.now(),
                    // User info for emails
                    userEmail: userEmail,
                    userName: userName
                },
            });

            console.log('✅ Order creation request sent to Inngest');

            // Return immediate response - order will be created by Inngest
            return NextResponse.json({
                success: true, 
                message: "Order is being processed",
                tempOrderId: tempOrderId,
                orderNumber: tempOrderId.slice(-8).toUpperCase(),
                amount: finalAmount,
                subtotal: totalAmount,
                deliveryFee: deliveryFee,
                discount: finalDiscount,
                appliedVoucher: appliedVoucher,
                items: validatedItems.length,
                status: "processing",
                emailSent: userEmail ? true : false
            });

        } catch (inngestError) {
            console.error('❌ Inngest error:', inngestError);
            return NextResponse.json({
                success: false,
                message: "Failed to process order. Please try again."
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Order processing error:", error);
        return NextResponse.json({
            success: false, 
            message: error.message || "Failed to process order"
        }, { status: 500 });
    }
}
