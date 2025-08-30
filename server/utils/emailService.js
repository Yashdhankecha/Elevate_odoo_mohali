const nodemailer = require('nodemailer');

// Check if email configuration is available
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_FROM;
};

// Create transporter for sending emails
const createTransporter = () => {
  if (!isEmailConfigured()) {
    console.log('⚠️  Email configuration not found. Email service will be disabled.');
    return null;
  }

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
  if (!transporter) return false;
  
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
    
    // Check if email is configured
    if (!isEmailConfigured()) {
      console.log('⚠️  Email not configured. OTP will be logged to console instead.');
      console.log('📧 OTP for', email, ':', otp);
      console.log('📧 Username:', username);
      return true; // Return true to indicate "success" for development
    }
    
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
      subject: 'Email Verification - Elevate Placement Tracker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; margin: 0;">🚀 Elevate Placement Tracker</h1>
            <p style="color: #6c757d; margin: 10px 0;">Email Verification</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${username}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering with Elevate Placement Tracker. To complete your registration, 
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
                Elevate Placement Tracker Team
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
    
    // For development, if email fails, log the OTP and continue
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Email failed, but continuing in development mode');
      console.log('📧 OTP for', email, ':', otp);
      console.log('📧 Username:', username);
      return true;
    }
    
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, username, resetToken) => {
  try {
    console.log('📧 Attempting to send password reset email to:', email);
    
    // Check if email is configured
    if (!isEmailConfigured()) {
      console.log('⚠️  Email not configured. Reset token will be logged to console instead.');
      console.log('🔑 Reset token for', email, ':', resetToken);
      console.log('📧 Username:', username);
      return true; // Return true to indicate "success" for development
    }
    
    const transporter = createTransporter();
    
    // Verify transporter before sending
    const isVerified = await verifyTransporter(transporter);
    if (!isVerified) {
      console.error('❌ Transporter verification failed, cannot send email');
      return false;
    }
    
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset - Elevate Placement Tracker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; margin: 0;">🚀 Elevate Placement Tracker</h1>
            <p style="color: #6c757d; margin: 10px 0;">Password Reset Request</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${username}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              You requested a password reset for your account. Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              If you didn't request this password reset, please ignore this email. 
              This link will expire in <strong>1 hour</strong>.
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            
            <p style="color: #007bff; word-break: break-all; font-family: monospace; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6c757d; font-size: 14px;">
                Best regards,<br>
                Elevate Placement Tracker Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log('📤 Sending password reset email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    console.log('📧 Email response:', info);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    
    // For development, if email fails, log the reset token and continue
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Email failed, but continuing in development mode');
      console.log('🔑 Reset token for', email, ':', resetToken);
      console.log('📧 Username:', username);
      return true;
    }
    
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail
};
