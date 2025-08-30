const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCGC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testTPOApproval = async () => {
  try {
    console.log('🔍 Testing TPO Approval System...\n');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ MongoDB connected successfully');

    const db = mongoose.connection.db;
    
    // Test 1: Check TPOs in users collection
    const usersCollection = db.collection('users');
    const tposInUsers = await usersCollection.find({ role: 'tpo' }).toArray();
    console.log(`📊 TPOs in users collection: ${tposInUsers.length}`);
    
    tposInUsers.forEach((tpo, index) => {
      console.log(`   TPO ${index + 1}: ${tpo.email} - Status: ${tpo.status || 'undefined'}`);
    });

    // Test 2: Check TPOs in tpos collection
    const tposCollection = db.collection('tpos');
    const tposInCollection = await tposCollection.find({}).toArray();
    console.log(`\n👨‍💼 TPOs in tpos collection: ${tposInCollection.length}`);
    
    tposInCollection.forEach((tpo, index) => {
      console.log(`   TPO ${index + 1}: ${tpo.email} - Status: ${tpo.status || 'undefined'}`);
    });

    // Test 3: Count pending TPOs
    const pendingUsersTPOs = await usersCollection.countDocuments({ role: 'tpo', status: 'pending' });
    const pendingCollectionTPOs = await tposCollection.countDocuments({ status: 'pending' });
    const totalPending = pendingUsersTPOs + pendingCollectionTPOs;
    
    console.log(`\n⏳ Pending TPOs:`);
    console.log(`   Users collection: ${pendingUsersTPOs}`);
    console.log(`   TPOs collection: ${pendingCollectionTPOs}`);
    console.log(`   Total: ${totalPending}`);

    // Test 4: Count active TPOs
    const activeUsersTPOs = await usersCollection.countDocuments({ role: 'tpo', status: 'active' });
    const activeCollectionTPOs = await tposCollection.countDocuments({ status: 'active' });
    const totalActive = activeUsersTPOs + activeCollectionTPOs;
    
    console.log(`\n✅ Active TPOs:`);
    console.log(`   Users collection: ${activeUsersTPOs}`);
    console.log(`   TPOs collection: ${activeCollectionTPOs}`);
    console.log(`   Total: ${totalActive}`);

    // Test 5: Count rejected TPOs
    const rejectedUsersTPOs = await usersCollection.countDocuments({ role: 'tpo', status: 'rejected' });
    const rejectedCollectionTPOs = await tposCollection.countDocuments({ status: 'rejected' });
    const totalRejected = rejectedUsersTPOs + rejectedCollectionTPOs;
    
    console.log(`\n❌ Rejected TPOs:`);
    console.log(`   Users collection: ${rejectedUsersTPOs}`);
    console.log(`   TPOs collection: ${rejectedCollectionTPOs}`);
    console.log(`   Total: ${totalRejected}`);

    console.log('\n🎯 Summary:');
    console.log(`   Total TPOs: ${tposInUsers.length + tposInCollection.length}`);
    console.log(`   Pending: ${totalPending}`);
    console.log(`   Active: ${totalActive}`);
    console.log(`   Rejected: ${totalRejected}`);

    console.log('\n✅ TPO Approval System test completed!');

  } catch (error) {
    console.error('❌ Error testing TPO approval system:', error);
    console.error('Error details:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
testTPOApproval();
