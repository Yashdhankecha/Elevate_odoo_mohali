const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function testDatabaseQueries() {
  try {
    console.log('\n🔍 Testing Database Queries...\n');

    // Test 1: Count total users
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total Users: ${totalUsers}`);

    // Test 2: Count users by role
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalTPOs = await User.countDocuments({ role: 'tpo' });
    const totalSuperadmins = await User.countDocuments({ role: 'superadmin' });
    
    console.log(`👨‍🎓 Students: ${totalStudents}`);
    console.log(`🏢 Companies: ${totalCompanies}`);
    console.log(`🏛️  TPOs: ${totalTPOs}`);
    console.log(`👑 Superadmins: ${totalSuperadmins}`);

    // Test 3: Count verified vs unverified users
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    
    console.log(`✅ Verified Users: ${verifiedUsers}`);
    console.log(`⏳ Unverified Users: ${unverifiedUsers}`);

    // Test 4: Get recent activities (last 5 users)
    const recentActivities = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('role email createdAt isVerified')
      .lean();
    
    console.log('\n📅 Recent Activities:');
    recentActivities.forEach((activity, index) => {
      console.log(`  ${index + 1}. ${activity.role.toUpperCase()} - ${activity.email} (${activity.isVerified ? 'Verified' : 'Unverified'}) - ${activity.createdAt}`);
    });

    // Test 5: Get pending approvals breakdown
    const pendingBreakdown = await User.aggregate([
      { $match: { isVerified: false } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    console.log('\n⏳ Pending Approvals Breakdown:');
    pendingBreakdown.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });

    // Test 6: Check if there are any users with missing fields
    const usersWithMissingFields = await User.find({
      $or: [
        { role: { $exists: false } },
        { isVerified: { $exists: false } },
        { email: { $exists: false } }
      ]
    }).select('_id email role isVerified');
    
    if (usersWithMissingFields.length > 0) {
      console.log('\n⚠️  Users with missing fields:');
      usersWithMissingFields.forEach(user => {
        console.log(`  ID: ${user._id}, Email: ${user.email}, Role: ${user.role}, Verified: ${user.isVerified}`);
      });
    } else {
      console.log('\n✅ All users have required fields');
    }

    console.log('\n🎯 Database queries test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing database queries:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testDatabaseQueries();

