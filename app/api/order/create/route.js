import { auth } from "@/auth";
import connectDB from "@/config/db";
import User from "@/models/user";
import Product from "@/models/product";
import Voucher from "@/models/voucher";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;
        const body = await request.json();
        const { items, address, promoCode, discount, subtotal } = body;

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

        let finalDiscount = 0;
        let appliedVoucher = null;

        if (promoCode) {
            const voucher = await Voucher.findOne({ 
                code: promoCode.toUpperCase(),
                isActive: true 
            });

            if (voucher) {
                const now = new Date();
                const startDate = new Date(voucher.startDate);
                const endDate = new Date(voucher.endDate);

                if (now >= startDate && now <= endDate) {
                    if (!voucher.usageLimit || voucher.usedCount < voucher.usageLimit) {
                        const userUsageCount = voucher.usedBy.filter(usage => usage.userId === userId).length;
                      
                        if (userUsageCount < voucher.userUsageLimit) {
                            const minOrderValid = !voucher.minOrderAmount || totalAmount >= voucher.minOrderAmount;
                            const maxOrderValid = !voucher.maxOrderAmount || totalAmount <= voucher.maxOrderAmount;
                            
                            if (minOrderValid && maxOrderValid) {
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
                                    appliedDiscount: finalDiscount
                                };
                            }
                        }
                    }
                }
            }
        } else if (discount) {
            finalDiscount = discount;
        }

        const finalAmount = totalAmount + deliveryFee - finalDiscount;
        const userEmail = user.email;
        const userName = user.name || address.fullName;
        const tempOrderId = `temp_${userId}_${Date.now()}`;

        try {
            await inngest.send({
                id: `create-order-${tempOrderId}`,
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
                    address,
                    status: "Order Placed",
                    paymentMethod: "COD",
                    payment: false,
                    date: Date.now(),
                    userEmail: userEmail,
                    userName: userName
                },
            });

            return NextResponse.json({
                success: true, 
                message: "Order is being processed",
                tempOrderId: tempOrderId,
                amount: finalAmount,
                subtotal: totalAmount,
                deliveryFee: deliveryFee,
                discount: finalDiscount,
                appliedVoucher: appliedVoucher,
                status: "processing"
            });

        } catch (inngestError) {
            console.error('Inngest error:', inngestError);
            return NextResponse.json({ success: false, message: "Failed to process order" }, { status: 500 });
        }

    } catch (error) {
        console.error("Order processing error:", error);
        return NextResponse.json({ success: false, message: error.message || "Failed to process order" }, { status: 500 });
    }
}
