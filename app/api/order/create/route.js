import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/user";
import Order from "@/models/order";
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

        // Validate products and calculate amount
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

        // Create order using your existing schema structure
        const orderData = {
            userId: userId,
            items: validatedItems,
            amount: finalAmount,
            subtotal: totalAmount,
            deliveryFee: deliveryFee,
            discount: finalDiscount,
            promoCode: promoCode || null,
            appliedVoucher: appliedVoucher,
            address: address,
            status: "Order Placed",
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        console.log('Order created successfully:', savedOrder._id);

        // Update voucher usage with user tracking (after successful order creation)
        if (appliedVoucher) {
            try {
                await Voucher.findOneAndUpdate(
                    { code: appliedVoucher.code },
                    {
                        $inc: { usedCount: 1 },
                        $push: {
                            usedBy: {
                                userId: userId,
                                usedAt: new Date(),
                                orderAmount: totalAmount,
                                discountApplied: finalDiscount
                            }
                        }
                    }
                );
                console.log('Voucher usage tracking updated successfully');
            } catch (voucherUpdateError) {
                console.error('Error updating voucher usage tracking:', voucherUpdateError);
                // Log error but don't fail the order
            }
        }

        // Send to Inngest
        try {
            await inngest.send({
                name: "order/created",
                data: {
                    userId,
                    orderId: savedOrder._id.toString(),
                    items: validatedItems,
                    amount: finalAmount,
                    subtotal: totalAmount,
                    deliveryFee: deliveryFee,
                    discount: finalDiscount,
                    promoCode: promoCode || null,
                    appliedVoucher: appliedVoucher,
                    address,
                    date: Date.now()
                },
            });
            console.log('Inngest event sent successfully');
        } catch (inngestError) {
            console.error('Inngest error:', inngestError);
            // Don't fail order if Inngest fails
        }

        // Clear user cart
        try {
            await User.findByIdAndUpdate(userId, {
                $unset: { cartItems: 1 }
            });
            console.log('User cart cleared successfully');
        } catch (cartError) {
            console.error('Cart clear error:', cartError);
            // Don't fail order if cart clearing fails
        }

        return NextResponse.json({
            success: true, 
            message: "Order placed successfully",
            orderId: savedOrder._id,
            orderNumber: savedOrder._id.toString().slice(-8).toUpperCase(),
            amount: finalAmount,
            subtotal: totalAmount,
            deliveryFee: deliveryFee,
            discount: finalDiscount,
            appliedVoucher: appliedVoucher,
            items: validatedItems.length
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({
            success: false, 
            message: error.message || "Failed to create order"
        }, { status: 500 });
    }
}
