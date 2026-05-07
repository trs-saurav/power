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

export const sendPasswordResetEmail = async (userEmail, userName, resetUrl) => {
  try {
    const mailOptions = {
      from: {
        name: process.env.COMPANY_NAME || 'Your Store',
        address: process.env.SMTP_USER
      },
      to: userEmail,
      subject: `Password Reset Request - ${process.env.COMPANY_NAME || 'Your Store'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
            .container { background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .content { color: #333; line-height: 1.6; }
            .reset-button { display: inline-block; background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            
            <div class="content">
              <p>Hi ${userName || 'there'},</p>
              
              <p>We received a request to reset the password for your account associated with this email address.</p>
              
              <p style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset Your Password</a>
              </p>
              
              <p><strong>Or copy this link:</strong><br/>
              <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all;">${resetUrl}</a></p>
              
              <div class="warning">
                <strong>⚠️ Security Note:</strong> This link will expire in 24 hours. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </div>
              
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              
              <p>Best regards,<br/>
              <strong>${process.env.COMPANY_NAME || 'Your Store'}</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>${process.env.NEXTAUTH_URL || 'http://localhost:3000'}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hi ${userName || 'there'},
        
        We received a request to reset the password for your account. 
        
        Please visit the following link to reset your password:
        ${resetUrl}
        
        This link will expire in 24 hours.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        ${process.env.COMPANY_NAME || 'Your Store'}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};
