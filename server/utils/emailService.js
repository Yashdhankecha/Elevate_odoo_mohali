const nodemailer = require('nodemailer');

const isEmailConfigured = () =>
  !!(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_FROM);

// Create transporter (lazy — only called when sending)
const createTransporter = () => {
  if (!isEmailConfigured()) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

// Verify transporter — only log on failure
const verifyTransporter = async (transporter) => {
  if (!transporter) return false;
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    return false;
  }
};

// ─── OTP Email ────────────────────────────────────────────────────────────────

const sendOTPEmail = async (email, username, otp) => {
  try {
    if (!isEmailConfigured()) {
      if (process.env.NODE_ENV !== 'production') console.log(`📧 [DEV] OTP for ${email}: ${otp}`);
      return true;
    }
    const transporter = createTransporter();
    if (!await verifyTransporter(transporter)) return false;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification - Elevate Placement Tracker',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8f9fa;border-radius:10px;">
          <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#007bff;margin:0;">🚀 Elevate Placement Tracker</h1>
            <p style="color:#6c757d;margin:10px 0;">Email Verification</p>
          </div>
          <div style="background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color:#333;margin-bottom:20px;">Hello ${username}!</h2>
            <p style="color:#555;line-height:1.6;margin-bottom:25px;">
              Thank you for registering with Elevate Placement Tracker. Use the code below to verify your email:
            </p>
            <div style="background:#007bff;color:#fff;padding:20px;border-radius:8px;text-align:center;margin:25px 0;">
              <h1 style="margin:0;font-size:32px;letter-spacing:5px;">${otp}</h1>
            </div>
            <p style="color:#555;line-height:1.6;">This code expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email.</p>
            <p style="color:#6c757d;font-size:14px;margin-top:30px;">Best regards,<br>Elevate Placement Tracker Team</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📧 [DEV] OTP for ${email}: ${otp}`);
      return true;
    }
    return false;
  }
};

// ─── Password Reset Email ─────────────────────────────────────────────────────

const sendPasswordResetEmail = async (email, username, resetToken) => {
  try {
    if (!isEmailConfigured()) {
      if (process.env.NODE_ENV !== 'production') console.log(`🔑 [DEV] Reset token for ${email}: ${resetToken}`);
      return true;
    }
    const transporter = createTransporter();
    if (!await verifyTransporter(transporter)) return false;

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset - Elevate Placement Tracker',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8f9fa;border-radius:10px;">
          <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#007bff;margin:0;">🚀 Elevate Placement Tracker</h1>
            <p style="color:#6c757d;margin:10px 0;">Password Reset Request</p>
          </div>
          <div style="background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color:#333;margin-bottom:20px;">Hello ${username}!</h2>
            <p style="color:#555;line-height:1.6;margin-bottom:25px;">You requested a password reset. Click the button below:</p>
            <div style="text-align:center;margin:25px 0;">
              <a href="${resetUrl}" style="background:#007bff;color:#fff;padding:15px 30px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;">Reset Password</a>
            </div>
            <p style="color:#555;line-height:1.6;">If the button doesn't work, copy this link into your browser:</p>
            <p style="color:#007bff;word-break:break-all;font-family:monospace;background:#f8f9fa;padding:10px;border-radius:4px;">${resetUrl}</p>
            <p style="color:#555;margin-top:20px;">This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email.</p>
            <p style="color:#6c757d;font-size:14px;margin-top:30px;">Best regards,<br>Elevate Placement Tracker Team</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔑 [DEV] Reset token for ${email}: ${resetToken}`);
      return true;
    }
    return false;
  }
};

// ─── Application Status Update Email ─────────────────────────────────────────

const sendStatusUpdateEmail = async (email, studentName, companyName, jobTitle, newStatus) => {
  try {
    if (!isEmailConfigured()) return true;
    const transporter = createTransporter();
    if (!await verifyTransporter(transporter)) return false;

    const formattedStatus = newStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Application Update - ${companyName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8f9fa;border-radius:10px;">
          <h1 style="color:#007bff;text-align:center;">🚀 Elevate Placement Tracker</h1>
          <div style="background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color:#333;">Hello ${studentName}!</h2>
            <p style="color:#555;line-height:1.6;">Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated.</p>
            <div style="background:#f8f9fa;border-left:4px solid #007bff;padding:15px;margin:25px 0;">
              <p style="margin:0;color:#333;">New Status: <strong style="color:#007bff;font-size:18px;">${formattedStatus}</strong></p>
            </div>
            <p style="color:#555;">Log in to your dashboard to view details and any next steps.</p>
            <p style="color:#6c757d;font-size:14px;margin-top:30px;">Best regards,<br>Elevate Placement Tracker Team</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending status update email:', error.message);
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  }
};

// ─── Round Cleared Email ──────────────────────────────────────────────────────

const sendRoundClearedEmail = async (email, studentName, companyName, jobTitle, roundName, roundNumber) => {
  try {
    if (!isEmailConfigured()) return true;
    const transporter = createTransporter();
    if (!await verifyTransporter(transporter)) return false;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Congratulations! Round Cleared - ${companyName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8f9fa;border-radius:10px;">
          <h1 style="color:#28a745;text-align:center;">🎉 Congratulations!</h1>
          <div style="background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color:#333;">Hello ${studentName}!</h2>
            <p style="color:#555;line-height:1.6;">You've successfully cleared a selection round for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
            <div style="background:#f8f9fa;border-left:4px solid #28a745;padding:15px;margin:25px 0;">
              <p style="margin:0;color:#333;">Cleared: <strong style="color:#28a745;font-size:18px;">${roundName || `Round ${roundNumber}`}</strong></p>
            </div>
            <p style="color:#555;">Check your dashboard for details on your next round.</p>
            <p style="color:#6c757d;font-size:14px;margin-top:30px;">Best regards,<br>Elevate Placement Tracker Team</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending round cleared email:', error.message);
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  }
};

// ─── Drive Approved — Company Email ──────────────────────────────────────────

const sendDriveApprovedEmailToCompany = async (companyEmail, companyName, jobTitle, instituteName) => {
  try {
    if (!isEmailConfigured()) return true;
    const transporter = createTransporter();
    if (!await verifyTransporter(transporter)) return false;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: companyEmail,
      subject: `Drive Approved — ${instituteName} has accepted your request`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8f9fa;border-radius:10px;">
          <h1 style="color:#007bff;text-align:center;">🎉 Elevate Placement Tracker</h1>
          <div style="background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color:#333;">Hello ${companyName}!</h2>
            <p style="color:#555;line-height:1.6;">Great news! <strong>${instituteName}</strong> has <strong style="color:#28a745;">approved</strong> your on-campus drive request for:</p>
            <div style="background:#f0fff4;border-left:4px solid #28a745;padding:15px;margin:25px 0;border-radius:4px;">
              <p style="margin:0;color:#333;font-size:18px;font-weight:bold;">${jobTitle}</p>
            </div>
            <p style="color:#555;line-height:1.6;">Your job posting is now <strong>live</strong> and students from ${instituteName} can view and apply for this role on the Elevate platform.</p>
            <p style="color:#555;line-height:1.6;">Log in to your dashboard to track applications and manage the recruitment process.</p>
            <p style="color:#6c757d;font-size:14px;margin-top:30px;">Best regards,<br>Elevate Placement Tracker Team</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending drive approval email to company:', error.message);
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  }
};

// ─── Drive Approved — Students Bulk Email ────────────────────────────────────

const sendDriveApprovedEmailToStudents = async (studentEmails, companyName, jobTitle, instituteName) => {
  if (!studentEmails || studentEmails.length === 0) return true;
  try {
    if (!isEmailConfigured()) return true;
    const transporter = createTransporter();
    if (!await verifyTransporter(transporter)) return false;

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    // Send in batches of 50 to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < studentEmails.length; i += batchSize) {
      const batch = studentEmails.slice(i, i + batchSize);
      await Promise.all(batch.map(email =>
        transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `New On-Campus Drive — ${companyName} is visiting ${instituteName}!`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8f9fa;border-radius:10px;">
              <h1 style="color:#007bff;text-align:center;">🚀 Elevate Placement Tracker</h1>
              <div style="background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color:#333;">Exciting Opportunity!</h2>
                <p style="color:#555;line-height:1.6;">Your Training & Placement Office at <strong>${instituteName}</strong> has approved a new on-campus drive:</p>
                <div style="background:#eff6ff;border-left:4px solid #007bff;padding:15px;margin:25px 0;border-radius:4px;">
                  <p style="margin:0 0 6px;color:#333;font-size:18px;font-weight:bold;">${companyName}</p>
                  <p style="margin:0;color:#555;font-size:14px;">${jobTitle}</p>
                </div>
                <p style="color:#555;line-height:1.6;">Log in to the Elevate platform to view eligibility criteria, job details, and apply before the deadline.</p>
                <div style="text-align:center;margin:30px 0;">
                  <a href="${clientUrl}" style="background:#007bff;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:15px;">View on Platform</a>
                </div>
                <p style="color:#6c757d;font-size:13px;margin-top:20px;">Best regards,<br>Elevate Placement Tracker Team</p>
              </div>
            </div>
          `,
        }).catch(err => console.error(`Failed to send to ${email}:`, err.message))
      ));
    }
    return true;
  } catch (error) {
    console.error('❌ Error sending drive approval emails to students:', error.message);
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  }
};

module.exports = { sendOTPEmail, sendPasswordResetEmail, sendStatusUpdateEmail, sendRoundClearedEmail, sendDriveApprovedEmailToCompany, sendDriveApprovedEmailToStudents };
