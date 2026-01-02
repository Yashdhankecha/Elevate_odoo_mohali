const mongoose = require('mongoose');
const SuperAdmin = require('./models/SuperAdmin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo_mohali');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create superadmin user
const createSuperAdmin = async () => {
  try {
    console.log('🚀 Creating superadmin user...');
    
    // Check if superadmin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email: 'superadmin@elevate.com' });
    if (existingSuperAdmin) {
      console.log('⚠️ Superadmin with email superadmin@elevate.com already exists');
      console.log('Superadmin ID:', existingSuperAdmin._id);
      console.log('Name:', existingSuperAdmin.name);
      return;
    }
    
    // Create new superadmin
    const superAdminData = {
      name: 'Super Administrator',
      email: 'superadmin@elevate.com',
      password: '321ewq',
      status: 'active',
      isVerified: true,
      permissions: {
        canManageUsers: true,
        canManageTPOs: true,
        canManageCompanies: true,
        canManageStudents: true,
        canManageSystem: true
      },
      systemSettings: {
        allowStudentRegistration: true,
        allowCompanyRegistration: true,
        allowTPORegistration: true,
        requireEmailVerification: true,
        requireAdminApproval: true
      }
    };
    
    const superAdmin = new SuperAdmin(superAdminData);
    await superAdmin.save();
    
    console.log('✅ Superadmin created successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('🔑 Password: 321ewq');
    console.log('🆔 ID:', superAdmin._id);
    console.log('📊 Status:', superAdmin.status);
    console.log('✅ Verified:', superAdmin.isVerified);
    
    console.log('\n🎉 Superadmin user is ready to use!');
    console.log('You can now login with:');
    console.log('Email: superadmin@elevate.com');
    console.log('Password: 321ewq');
    
  } catch (error) {
    console.error('❌ Error creating superadmin:', error);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await createSuperAdmin();
  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB');
};

// Run if this file is executed directly
if (require.main === module) {
  runScript();
}

module.exports = { createSuperAdmin };

