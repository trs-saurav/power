import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // Best practice for Gmail
      to: process.env.COMPANY_EMAIL || 'powerele9@gmail.com',
      replyTo: email,
      subject: `New Technical Consultation Request from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'N/A'}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #1e40af; padding: 24px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Inquiry Received</h2>
          </div>
          <div style="padding: 32px; color: #333333; line-height: 1.6;">
            <p style="margin-top: 0; font-size: 16px;">You have a new consultation request from your website.</p>
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 24px 0;" />
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #666666; width: 100px;"><strong>Client Name:</strong></td>
                <td style="padding: 8px 0; color: #111111;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #111111;"><a href="mailto:${email}" style="color: #1e40af; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #111111;">${phone || 'Not provided'}</td>
              </tr>
            </table>
            <div style="margin-top: 32px; background-color: #f8fafc; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; font-size: 14px; color: #666666; text-transform: uppercase;">Project Details:</h3>
              <p style="margin-bottom: 0; color: #111111; white-space: pre-line;">${message}</p>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
            Sent from Power Electronics Corporate Portal
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
