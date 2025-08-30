const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  console.log('🔧 Creating email transporter...');
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('🔑 Email Pass:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  console.log('📤 Email From:', process.env.EMAIL_FROM);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug output
    logger: true  // Log to console
  });
  
  return transporter;
};

// Verify transporter configuration
const verifyTransporter = async (transporter) => {
  try {
    console.log('🔍 Verifying transporter configuration...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Transporter verification failed:', error);
    return false;
  }
};

// Send OTP verification email
const sendOTPEmail = async (email, username, otp) => {
  try {
    console.log('📧 Attempting to send OTP email to:', email);
    
    const transporter = createTransporter();
    
    // Verify transporter before sending
    const isVerified = await verifyTransporter(transporter);
    if (!isVerified) {
      console.error('❌ Transporter verification failed, cannot send email');
      return false;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification - MERN Auth System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; margin: 0;">🔐 MERN Auth System</h1>
            <p style="color: #6c757d; margin: 10px 0;">Email Verification</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${username}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering with our platform. To complete your registration, 
              please use the following verification code:
            </p>
            
            <div style="background-color: #007bff; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, 
              please ignore this email.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6c757d; font-size: 14px;">
                Best regards,<br>
                MERN Auth System Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log('📤 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully:', info.messageId);
    console.log('📧 Email response:', info);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, username, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request - MERN Auth System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc3545; margin: 0;">🔐 MERN Auth System</h1>
            <p style="color: #6c757d; margin: 10px 0;">Password Reset Request</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${username}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" style="background-color: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            
            <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; color: #007bff;">
              ${resetLink}
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, 
              please ignore this email and your password will remain unchanged.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6c757d; font-size: 14px;">
                Best regards,<br>
                MERN Auth System Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail
};
