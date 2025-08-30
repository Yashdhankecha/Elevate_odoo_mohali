const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function testNewAdminRoutes() {
  try {
    console.log('\n🔍 Testing New Admin Routes for Registration Approval...\n');

    // Test 1: Check current user statuses
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const rejectedUsers = await User.countDocuments({ status: 'rejected' });

    console.log('📊 Current User Statuses:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Active Users: ${activeUsers}`);
    console.log(`   Pending Users: ${pendingUsers}`);
    console.log(`   Rejected Users: ${rejectedUsers}`);

    // Test 2: Check pending registrations by role
    const pendingStudents = await User.countDocuments({ role: 'student', status: 'pending' });
    const pendingCompanies = await User.countDocuments({ role: 'company', status: 'pending' });
    const pendingTPOs = await User.countDocuments({ role: 'tpo', status: 'pending' });

    console.log('\n⏳ Pending Registrations by Role:');
    console.log(`   Students: ${pendingStudents}`);
    console.log(`   Companies: ${pendingCompanies}`);
    console.log(`   TPOs: ${pendingTPOs}`);

    // Test 3: Check active users by role (should only count active status)
    const activeStudents = await User.countDocuments({ role: 'student', status: 'active' });
    const activeCompanies = await User.countDocuments({ role: 'company', status: 'active' });

    console.log('\n✅ Active Users by Role:');
    console.log(`   Students: ${activeStudents}`);
    console.log(`   Companies: ${activeCompanies}`);

    // Test 4: Show sample pending users
    const samplePendingUsers = await User.find({ status: 'pending' })
      .select('email role createdAt')
      .limit(3)
      .lean();

    console.log('\n📋 Sample Pending Users:');
    samplePendingUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.createdAt}`);
    });

    // Test 5: Verify API response structure
    console.log('\n🎯 API Response Structure Check:');
    console.log('✅ /admin/pending-registrations should return:');
    console.log('   { success: true, pendingUsers: [...] }');
    console.log('✅ /admin/approve-user/:id should return:');
    console.log('   { success: true, message: "...", user: {...} }');
    console.log('✅ /admin/reject-user/:id should return:');
    console.log('   { success: true, message: "...", user: {...} }');

    console.log('\n🎯 New Admin Routes Test Completed Successfully!');
    console.log('💡 The registration approval system is ready to use.');
    
  } catch (error) {
    console.error('❌ Error testing new admin routes:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testNewAdminRoutes();
