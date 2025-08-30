const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB for fixing super admin');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Fix super admin function
const fixSuperAdmin = async () => {
  try {
    // Find existing super admin
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    
    if (!existingSuperAdmin) {
      console.log('❌ No super admin found in the database');
      return;
    }

    console.log('🔍 Found existing super admin:');
    console.log('Email:', existingSuperAdmin.email);
    console.log('Name:', existingSuperAdmin.superadmin?.name);
    console.log('Is Verified:', existingSuperAdmin.isVerified);

    // Update super admin to be verified and set password to "321ewq"
    existingSuperAdmin.isVerified = true;
    existingSuperAdmin.password = '321ewq'; // This will be hashed by the pre-save hook
    existingSuperAdmin.emailVerificationOTP = undefined; // Clear any pending OTP

    await existingSuperAdmin.save();

    console.log('✅ Super admin fixed successfully!');
    console.log('Email:', existingSuperAdmin.email);
    console.log('Password: 321ewq');
    console.log('Name:', existingSuperAdmin.superadmin?.name);
    console.log('Role:', existingSuperAdmin.role);
    console.log('Is Verified:', existingSuperAdmin.isVerified);

  } catch (error) {
    console.error('❌ Error fixing super admin:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await fixSuperAdmin();
  
  // Close database connection
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
};

// Run the fixing
main().catch((error) => {
  console.error('❌ Fixing failed:', error);
  process.exit(1);
});
