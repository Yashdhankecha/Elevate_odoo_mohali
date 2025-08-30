const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed super admin function
const seedSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️  Super admin already exists in the database');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Name:', existingSuperAdmin.superadmin?.name);
      return;
    }

    // Create super admin user
    const superAdminData = {
      email: 'superadmin@elevate.com',
      password: '321ewq',
      role: 'superadmin',
      isVerified: true,
      superadmin: {
        name: 'Super Administrator',
        contactNumber: '+91-9876543210',
        systemAccess: true,
        permissions: ['admin_approval', 'company_approval', 'institution_management', 'system_settings']
      }
    };

    const superAdmin = new User(superAdminData);
    await superAdmin.save();

    console.log('✅ Super admin created successfully!');
    console.log('Email:', superAdmin.email);
    console.log('Password: 321ewq');
    console.log('Name:', superAdmin.superadmin.name);
    console.log('Role:', superAdmin.role);

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedSuperAdmin();
  
  // Close database connection
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
};

// Run the seeding
main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
