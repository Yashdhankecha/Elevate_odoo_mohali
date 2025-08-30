const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB for updating super admin permissions');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Update super admin permissions function
const updateSuperAdminPermissions = async () => {
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
    console.log('Current Permissions:', existingSuperAdmin.superadmin?.permissions);

    // Update super admin permissions
    existingSuperAdmin.superadmin.permissions = [
      'admin_approval', 
      'company_approval', 
      'institution_management', 
      'system_settings'
    ];

    await existingSuperAdmin.save();

    console.log('✅ Super admin permissions updated successfully!');
    console.log('Email:', existingSuperAdmin.email);
    console.log('Name:', existingSuperAdmin.superadmin.name);
    console.log('New Permissions:', existingSuperAdmin.superadmin.permissions);
    console.log('Removed: user_management, security');

  } catch (error) {
    console.error('❌ Error updating super admin permissions:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await updateSuperAdminPermissions();
  
  // Close database connection
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
};

// Run the update
main().catch((error) => {
  console.error('❌ Update failed:', error);
  process.exit(1);
});
