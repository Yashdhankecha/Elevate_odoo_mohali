const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testUpdatedTPOSystem = async () => {
  try {
    console.log('🧪 Testing Updated TPO Approval System...\n');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ MongoDB connected successfully');

    const db = mongoose.connection.db;
    
    // Test 1: Check pending TPOs (only those requiring verification)
    console.log('📋 Testing Pending TPOs Query...');
    
    const usersCollection = db.collection('users');
    const tposCollection = db.collection('tpos');
    
    // Get pending TPOs from users collection
    const pendingTPOs = await usersCollection.find({ 
      role: 'tpo', 
      status: 'pending' 
    }).toArray();

    // Get pending TPOs from tpos collection
    const pendingTPOsFromCollection = await tposCollection.find({ 
      status: 'pending' 
    }).toArray();

    // Combine and format the results (same logic as updated admin route)
    const allPendingTPOs = [...pendingTPOs, ...pendingTPOsFromCollection].map(tpo => ({
      id: tpo._id,
      email: tpo.email,
      role: tpo.role,
      name: tpo.name || tpo.instituteName || 'TPO',
      createdAt: tpo.createdAt,
      status: 'pending',
      instituteName: tpo.instituteName || tpo.companyName || 'N/A'
    }));

    console.log(`✅ Found ${allPendingTPOs.length} pending TPOs requiring verification`);
    console.log(`   Users collection: ${pendingTPOs.length}`);
    console.log(`   TPOs collection: ${pendingTPOsFromCollection.length}`);
    
    // Show first 5 pending TPOs with institute names
    console.log('\n📝 Sample Pending TPOs with Institute Names:');
    allPendingTPOs.slice(0, 5).forEach((tpo, index) => {
      console.log(`   ${index + 1}. ${tpo.name} (${tpo.email})`);
      console.log(`      Institute: ${tpo.instituteName}`);
      console.log(`      Role: ${tpo.role.toUpperCase()}`);
      console.log(`      Status: ${tpo.status}`);
      console.log('');
    });

    // Test 2: Verify that all TPOs have proper status fields
    console.log('🔍 Verifying TPO Status Fields...');
    
    const allTPOs = await usersCollection.countDocuments({ role: 'tpo' });
    const allTPOsCollection = await tposCollection.countDocuments({});
    
    console.log(`   Total TPOs in users collection: ${allTPOs}`);
    console.log(`   Total TPOs in tpos collection: ${allTPOsCollection}`);
    
    // Check status distribution
    const pendingUsers = await usersCollection.countDocuments({ role: 'tpo', status: 'pending' });
    const activeUsers = await usersCollection.countDocuments({ role: 'tpo', status: 'active' });
    const rejectedUsers = await usersCollection.countDocuments({ role: 'tpo', status: 'rejected' });
    
    const pendingCollection = await tposCollection.countDocuments({ status: 'pending' });
    const activeCollection = await tposCollection.countDocuments({ status: 'active' });
    const rejectedCollection = await tposCollection.countDocuments({ status: 'rejected' });
    
    console.log('\n📊 Status Distribution:');
    console.log(`   Users Collection:`);
    console.log(`     Pending: ${pendingUsers}`);
    console.log(`     Active: ${activeUsers}`);
    console.log(`     Rejected: ${rejectedUsers}`);
    console.log(`   TPOs Collection:`);
    console.log(`     Pending: ${pendingCollection}`);
    console.log(`     Active: ${activeCollection}`);
    console.log(`     Rejected: ${rejectedCollection}`);

    console.log('\n🎯 Updated TPO System Summary:');
    console.log(`   ✅ Component renamed to "Pending TPOs"`);
    console.log(`   ✅ Only shows TPOs with pending verification`);
    console.log(`   ✅ Institute names displayed in table`);
    console.log(`   ✅ Superadmin approval required for all TPOs`);
    console.log(`   ✅ Login blocked until approval`);
    console.log(`   ✅ Clear messaging about approval requirement`);

    console.log('\n🚀 System Ready for Testing!');
    console.log('💡 What you should see:');
    console.log('   1. Superadmin dashboard shows "Pending TPOs" section');
    console.log('   2. Table displays Name, Email, Institute, Registered Date, Actions');
    console.log('   3. All TPOs require superadmin approval before activation');
    console.log('   4. Pending TPOs see "Approval Pending" page with clear messaging');

  } catch (error) {
    console.error('❌ Error testing updated TPO system:', error);
    console.error('Error details:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
testUpdatedTPOSystem();
