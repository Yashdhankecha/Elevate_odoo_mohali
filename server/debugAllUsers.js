const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCGC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

const debugAllUsers = async () => {
  try {
    console.log('🔍 Debugging ALL users in your database...\n');

    // Get total count of all users
    const totalUsers = await User.countDocuments({});
    console.log(`📊 Total Users in Database: ${totalUsers}`);

    // Get count by role
    const studentCount = await User.countDocuments({ role: 'student' });
    const companyCount = await User.countDocuments({ role: 'company' });
    const tpoCount = await User.countDocuments({ role: 'tpo' });
    const superadminCount = await User.countDocuments({ role: 'superadmin' });

    console.log(`\n👥 Users by Role:`);
    console.log(`   Students: ${studentCount}`);
    console.log(`   Companies: ${companyCount}`);
    console.log(`   TPOs: ${tpoCount}`);
    console.log(`   Superadmins: ${superadminCount}`);

    // Check if there are users without role field
    const usersWithoutRole = await User.countDocuments({ role: { $exists: false } });
    const usersWithNullRole = await User.countDocuments({ role: null });
    const usersWithEmptyRole = await User.countDocuments({ role: '' });

    console.log(`\n⚠️  Users with Role Issues:`);
    console.log(`   No role field: ${usersWithoutRole}`);
    console.log(`   Role is null: ${usersWithNullRole}`);
    console.log(`   Role is empty string: ${usersWithEmptyRole}`);

    // Get sample users to see their structure
    console.log(`\n📋 Sample User Structures:`);
    
    const sampleUsers = await User.find().limit(5);
    sampleUsers.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Role: ${user.role || 'UNDEFINED'}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Name: ${user.name || user.companyName || 'N/A'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   All fields:`, Object.keys(user));
    });

    // Check for any users with different role values
    const uniqueRoles = await User.distinct('role');
    console.log(`\n🎭 Unique Role Values Found:`, uniqueRoles);

    // Count users with each unique role
    for (const role of uniqueRoles) {
      if (role) {
        const count = await User.countDocuments({ role: role });
        console.log(`   ${role}: ${count} users`);
      }
    }

    // Check for case sensitivity issues
    const studentsLower = await User.countDocuments({ role: 'student' });
    const studentsUpper = await User.countDocuments({ role: 'STUDENT' });
    const studentsMixed = await User.countDocuments({ role: 'Student' });

    console.log(`\n🔍 Case Sensitivity Check:`);
    console.log(`   role: 'student' → ${studentsLower}`);
    console.log(`   role: 'STUDENT' → ${studentsUpper}`);
    console.log(`   role: 'Student' → ${studentsMixed}`);

    // Check if there are users in different collections
    console.log(`\n🗄️  Database Collections Check:`);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   Collections found:`, collections.map(col => col.name));

  } catch (error) {
    console.error('❌ Error debugging users:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the debug
debugAllUsers();
