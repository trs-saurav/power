// lib/emailTemplates.js
export const generateOrderConfirmationHTML = (order, user) => {
    // Safe formatting functions with null/undefined checks
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return '₹0';
        }
        return `₹${Number(amount).toLocaleString()}`;
    };
    
    const formatDate = (date) => {
        if (!date) return 'N/A';
        try {
            const dateObj = typeof date === 'number' ? new Date(date) : new Date(date);
            return dateObj.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    // Safe access to order properties
    const safeOrder = {
        _id: order?._id || 'N/A',
        amount: order?.amount || 0,
        subtotal: order?.subtotal || order?.amount || 0,
        deliveryFee: order?.deliveryFee || 0,
        discount: order?.discount || 0,
        status: order?.status || 'Order Placed',
        paymentMethod: order?.paymentMethod || 'COD',
        payment: order?.payment || false,
        date: order?.date || Date.now(),
        items: Array.isArray(order?.items) ? order.items : [],
        courier: order?.courier || {},
        appliedVoucher: order?.appliedVoucher || null,
        promoCode: order?.promoCode || null
    };

    // Get user name from multiple sources
    const getUserName = () => {
        if (user?.name) return user.name;
        if (user?.firstName) {
            return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
        }
        return 'Valued Customer';
    };

    const safeUser = {
        name: getUserName()
    };

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #1f2937;
                    background-color: #f8fafc;
                    padding: 20px;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .header h1 {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    letter-spacing: -0.025em;
                }
                
                .header p {
                    font-size: 18px;
                    opacity: 0.9;
                    font-weight: 400;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .success-message {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .success-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 36px;
                }
                
                .success-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 8px;
                }
                
                .success-subtitle {
                    font-size: 16px;
                    color: #6b7280;
                    margin-bottom: 20px;
                }
                
                .order-id {
                    background: #f3f4f6;
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    padding: 16px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .order-id-label {
                    font-size: 14px;
                    color: #6b7280;
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                
                .order-id-value {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1f2937;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 2px;
                }
                
                .order-details {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 30px;
                }
                
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .detail-row:last-child {
                    border-bottom: none;
                }
                
                .detail-label {
                    font-size: 14px;
                    color: #6b7280;
                    font-weight: 500;
                }
                
                .detail-value {
                    font-size: 14px;
                    color: #1f2937;
                    font-weight: 600;
                }
                
                .items-section {
                    margin-bottom: 30px;
                }
                
                .section-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .item-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s ease;
                }
                
                .item-card:hover {
                    border-color: #d1d5db;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                
                .item-info {
                    flex: 1;
                }
                
                .item-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 4px;
                }
                
                .item-details {
                    font-size: 14px;
                    color: #6b7280;
                }
                
                .item-price {
                    font-size: 16px;
                    font-weight: 700;
                    color: #059669;
                }
                
                .order-summary {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 30px;
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                }
                
                .summary-label {
                    font-size: 14px;
                    color: #374151;
                    font-weight: 500;
                }
                
                .summary-value {
                    font-size: 14px;
                    color: #1f2937;
                    font-weight: 600;
                }
                
                .summary-total {
                    border-top: 2px solid #10b981;
                    padding-top: 12px;
                    margin-top: 8px;
                }
                
                .summary-total .summary-label,
                .summary-total .summary-value {
                    font-size: 18px;
                    font-weight: 700;
                    color: #059669;
                }
                
                .discount {
                    color: #dc2626 !important;
                }
                
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 12px;
                    background: #dbeafe;
                    color: #1e40af;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .cta-section {
                    text-align: center;
                    margin: 40px 0;
                }
                
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px 32px;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                
                .cta-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
                }
                
                .info-cards {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin: 30px 0;
                }
                
                .info-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                }
                
                .info-card-icon {
                    font-size: 32px;
                    margin-bottom: 8px;
                }
                
                .info-card-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 4px;
                }
                
                .info-card-text {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .footer {
                    background: #f9fafb;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                }
                
                .footer-content {
                    margin-bottom: 20px;
                }
                
                .footer h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 8px;
                }
                
                .footer p {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 4px;
                }
                
                .footer-divider {
                    height: 1px;
                    background: #e5e7eb;
                    margin: 20px 0;
                }
                
                .footer-small {
                    font-size: 12px;
                    color: #9ca3af;
                }
                
                @media (max-width: 600px) {
                    body {
                        padding: 10px;
                    }
                    
                    .header {
                        padding: 30px 20px;
                    }
                    
                    .content {
                        padding: 30px 20px;
                    }
                    
                    .footer {
                        padding: 20px;
                    }
                    
                    .info-cards {
                        grid-template-columns: 1fr;
                    }
                    
                    .item-card {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <h1>${process.env.COMPANY_NAME || 'Your Store'}</h1>
                    <p>Thank you for your order!</p>
                </div>

                <div class="content">
                    <!-- Success Message -->
                    <div class="success-message">
                        <div class="success-icon">✓</div>
                        <h2 class="success-title">Order Confirmed!</h2>
                        <p class="success-subtitle">Hi ${safeUser.name}, we've received your order and are getting it ready.</p>
                    </div>

                    <!-- Order ID -->
                    <div class="order-id">
                        <div class="order-id-label">Order Number</div>
                        <div class="order-id-value">#${String(safeOrder._id).slice(-8).toUpperCase()}</div>
                    </div>

                    <!-- Order Details -->
                    <div class="order-details">
                        <div class="detail-row">
                            <span class="detail-label">Order Date</span>
                            <span class="detail-value">${formatDate(safeOrder.date)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Payment Method</span>
                            <span class="detail-value">${safeOrder.paymentMethod}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Payment Status</span>
                            <span class="detail-value">${safeOrder.payment ? 'Paid' : 'Pending'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Order Status</span>
                            <span class="status-badge">${safeOrder.status}</span>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div class="items-section">
                        <h3 class="section-title">
                            <span>🛍️</span>
                            Your Items
                        </h3>
                        ${safeOrder.items.length > 0 ? safeOrder.items.map(item => {
                            const itemName = item?.name || 'Product';
                            const itemQuantity = item?.quantity || 1;
                            const itemPrice = item?.price || 0;
                            const itemTotal = item?.total || (itemPrice * itemQuantity);
                            
                            return `
                                <div class="item-card">
                                    <div class="item-info">
                                        <div class="item-name">${itemName}</div>
                                        <div class="item-details">Quantity: ${itemQuantity} × ${formatCurrency(itemPrice)}</div>
                                    </div>
                                    <div class="item-price">${formatCurrency(itemTotal)}</div>
                                </div>
                            `;
                        }).join('') : '<p style="text-align: center; color: #6b7280;">No items found</p>'}
                    </div>

                    <!-- Order Summary -->
                    <div class="order-summary">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal</span>
                            <span class="summary-value">${formatCurrency(safeOrder.subtotal)}</span>
                        </div>
                        
                        ${safeOrder.deliveryFee > 0 ? `
                            <div class="summary-row">
                                <span class="summary-label">Delivery Fee</span>
                                <span class="summary-value">${formatCurrency(safeOrder.deliveryFee)}</span>
                            </div>
                        ` : `
                            <div class="summary-row">
                                <span class="summary-label">Delivery Fee</span>
                                <span class="summary-value" style="color: #059669;">FREE</span>
                            </div>
                        `}
                        
                        ${safeOrder.discount > 0 ? `
                            <div class="summary-row">
                                <span class="summary-label">Discount</span>
                                <span class="summary-value discount">-${formatCurrency(safeOrder.discount)}</span>
                            </div>
                        ` : ''}
                        
                        ${safeOrder.appliedVoucher ? `
                            <div class="summary-row">
                                <span class="summary-label">Coupon (${safeOrder.appliedVoucher.code})</span>
                                <span class="summary-value discount">-${formatCurrency(safeOrder.appliedVoucher.appliedDiscount || 0)}</span>
                            </div>
                        ` : ''}
                        
                        <div class="summary-row summary-total">
                            <span class="summary-label">Total Amount</span>
                            <span class="summary-value">${formatCurrency(safeOrder.amount)}</span>
                        </div>
                    </div>

                    <!-- Info Cards -->
                    <div class="info-cards">
                        <div class="info-card">
                            <div class="info-card-icon">📦</div>
                            <div class="info-card-title">Processing</div>
                            <div class="info-card-text">We're preparing your order</div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-icon">🚚</div>
                            <div class="info-card-title">Delivery</div>
                            <div class="info-card-text">3-7 business days</div>
                        </div>
                    </div>

                    <!-- Tracking Info (if available) -->
                    ${safeOrder.courier?.trackingId ? `
                        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                            <h4 style="color: #1e40af; margin-bottom: 8px;">📍 Track Your Order</h4>
                            <p style="color: #1f2937; margin-bottom: 4px;"><strong>Courier:</strong> ${safeOrder.courier.name || 'N/A'}</p>
                            <p style="color: #1f2937; margin-bottom: 12px;"><strong>Tracking ID:</strong> <code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${safeOrder.courier.trackingId}</code></p>
                            ${safeOrder.courier.trackingUrl ? `
                                <a href="${safeOrder.courier.trackingUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: 600;">Track Package</a>
                            ` : ''}
                        </div>
                    ` : ''}

                    <!-- CTA -->
                    <div class="cta-section">
                        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/my-orders" class="cta-button">
                            View Order Details
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <div class="footer-content">
                        <h3>Need Help?</h3>
                        <p>📧 ${process.env.COMPANY_EMAIL || 'support@yourstore.com'}</p>
                        <p>📞 ${process.env.COMPANY_PHONE || '+1234567890'}</p>
                    </div>
                    
                    <div class="footer-divider"></div>
                    
                    <div class="footer-small">
                        This is an automated email. Please do not reply.<br>
                        You'll receive updates as your order progresses.
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Status update template (keeping the same modern style)
export const generateOrderStatusUpdateHTML = (order, user, oldStatus, newStatus) => {
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return '₹0';
        }
        return `₹${Number(amount).toLocaleString()}`;
    };
    
    const getStatusEmoji = (status) => {
        const statusEmojis = {
            'Order Placed': '📝',
            'Processing': '⚙️',
            'Packed': '📦',
            'Shipped': '🚚',
            'Out for Delivery': '🛵',
            'Delivered': '✅',
            'Cancelled': '❌',
            'Refunded': '💰'
        };
        return statusEmojis[status] || '📋';
    };

    const getUserName = () => {
        if (user?.name) return user.name;
        if (user?.firstName) {
            return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
        }
        return 'Valued Customer';
    };

    const safeOrder = {
        _id: order?._id || 'N/A',
        amount: order?.amount || 0,
        courier: order?.courier || {}
    };

    const safeUser = {
        name: getUserName()
    };

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Status Update</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: white;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #3b82f6;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .status-update {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    margin: 20px 0;
                }
                .btn {
                    background: #3b82f6;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    display: inline-block;
                    margin: 20px 0;
                    font-weight: 600;
                }
                .tracking-info {
                    background: #ecfdf5;
                    border: 1px solid #bbf7d0;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${process.env.COMPANY_NAME || 'Your Store'}</h1>
                    <p>Order Status Update</p>
                </div>

                <div class="status-update">
                    <h2>${getStatusEmoji(newStatus)} Order ${newStatus}</h2>
                    <p>Order #${String(safeOrder._id).slice(-8).toUpperCase()}</p>
                </div>

                <p>Hi ${safeUser.name},</p>
                <p>Great news! Your order status has been updated:</p>
                
                <p><strong>Previous Status:</strong> ${oldStatus || 'N/A'}</p>
                <p><strong>Current Status:</strong> ${newStatus || 'N/A'}</p>
                <p><strong>Order Total:</strong> ${formatCurrency(safeOrder.amount)}</p>

                ${safeOrder.courier?.trackingId ? `
                    <div class="tracking-info">
                        <h4>📍 Tracking Information</h4>
                        <p><strong>Courier:</strong> ${safeOrder.courier.name || 'N/A'}</p>
                        <p><strong>Tracking ID:</strong> <code>${safeOrder.courier.trackingId}</code></p>
                        ${safeOrder.courier.trackingUrl ? `
                            <a href="${safeOrder.courier.trackingUrl}" class="btn">Track Your Package</a>
                        ` : ''}
                    </div>
                ` : ''}

                <div style="text-align: center;">
                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/my-orders" class="btn">View Order Details</a>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p><strong>Need help?</strong></p>
                    <p>📧 ${process.env.COMPANY_EMAIL || 'support@yourstore.com'}</p>
                    <p>📞 ${process.env.COMPANY_PHONE || '+1234567890'}</p>
                    <br>
                    <p><small>This is an automated notification. Please do not reply to this email.</small></p>
                </div>
            </div>
        </body>
        </html>
    `;
};
