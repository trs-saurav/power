import transporter from '@/config/nodemailer.js';
import { generateOrderConfirmationHTML, generateOrderStatusUpdateHTML } from './emailTemplates.js';

export const sendOrderConfirmationEmail = async (order, userEmail, userName = null) => {
  try {
    const user = { name: userName, email: userEmail };
    
    const mailOptions = {
      from: {
        name: process.env.COMPANY_NAME || 'Your Store',
        address: process.env.SMTP_USER
      },
      to: userEmail,
      subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
      html: generateOrderConfirmationHTML(order, user),
      text: `
        Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}
        
        Hi ${userName || 'Valued Customer'},
        
        Thank you for your order! We've received your order and are processing it now.
        
        Order Total: ₹${order.amount.toLocaleString()}
        Status: ${order.status}
        
        You can track your order at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/my-orders
        
        Best regards,
        ${process.env.COMPANY_NAME || 'Your Store'}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// 🔥 FIXED: Updated function signature to match your API calls
export const sendOrderStatusUpdateEmail = async (order, user, oldStatus, newStatus) => {
  try {
    // Extract email and name from user object
    const userEmail = user.email;
    const userName = user.name || user.firstName || 'Valued Customer';
    
    console.log('📧 Email service - preparing email for:', userEmail);
    console.log('📧 Status change:', oldStatus, '→', newStatus);
    
    // Validate email address
    if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
      throw new Error(`Invalid email address: ${userEmail}`);
    }
    
    const mailOptions = {
      from: {
        name: process.env.COMPANY_NAME || 'Your Store',
        address: process.env.SMTP_USER
      },
      to: userEmail.trim(), // Ensure no whitespace
      subject: `Order Update - #${order._id.toString().slice(-8).toUpperCase()} is now ${newStatus}`,
      html: generateOrderStatusUpdateHTML(order, user, oldStatus, newStatus),
      text: `
        Order Status Update - #${order._id.toString().slice(-8).toUpperCase()}
        
        Hi ${userName},
        
        Your order status has been updated to: ${newStatus}
        Previous status was: ${oldStatus}
        
        Order Total: ₹${order.amount.toLocaleString()}
        
        Track your order: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/my-orders
        
        Best regards,
        ${process.env.COMPANY_NAME || 'Your Store'}
      `
    };

    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order status update email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
    return { success: false, error: error.message };
  }
};

// 🆕 ALTERNATIVE: If you want to keep the old signature for backward compatibility
export const sendOrderStatusUpdateEmailLegacy = async (order, userEmail, userName, oldStatus, newStatus) => {
  try {
    const user = { name: userName, email: userEmail };
    return await sendOrderStatusUpdateEmail(order, user, oldStatus, newStatus);
  } catch (error) {
    console.error('Error in legacy email function:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: {
        name: process.env.COMPANY_NAME || 'Your Store',
        address: process.env.SMTP_USER
      },
      to: userEmail,
      subject: `Welcome to ${process.env.COMPANY_NAME || 'Your Store'}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .welcome { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="welcome">
            <h1>Welcome to ${process.env.COMPANY_NAME || 'Your Store'}! 🎉</h1>
            <p>Hi ${userName || 'there'},</p>
            <p>Welcome to our family! We're excited to have you on board.</p>
            <p>Start exploring our amazing products and enjoy shopping with us!</p>
          </div>
          <p style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Start Shopping</a>
          </p>
        </body>
        </html>
      `,
      text: `Welcome to ${process.env.COMPANY_NAME || 'Your Store'}! Hi ${userName || 'there'}, welcome to our family!`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};
