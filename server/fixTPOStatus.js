const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCGC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixTPOStatus = async () => {
  try {
    console.log('🔧 Fixing TPO Status Fields...\n');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ MongoDB connected successfully');

    const db = mongoose.connection.db;
    
    // Fix 1: Update TPOs in users collection
    const usersCollection = db.collection('users');
    const tposInUsers = await usersCollection.find({ role: 'tpo' }).toArray();
    console.log(`📊 Found ${tposInUsers.length} TPOs in users collection`);
    
    for (const tpo of tposInUsers) {
      if (!tpo.status) {
        await usersCollection.updateOne(
          { _id: tpo._id },
          { $set: { status: 'pending' } }
        );
        console.log(`   ✅ Updated TPO ${tpo.email} with status: pending`);
      } else {
        console.log(`   ℹ️  TPO ${tpo.email} already has status: ${tpo.status}`);
      }
    }

    // Fix 2: Update TPOs in tpos collection
    const tposCollection = db.collection('tpos');
    const tposInCollection = await tposCollection.find({}).toArray();
    console.log(`\n👨‍💼 Found ${tposInCollection.length} TPOs in tpos collection`);
    
    for (const tpo of tposInCollection) {
      if (!tpo.status) {
        await tposCollection.updateOne(
          { _id: tpo._id },
          { $set: { status: 'pending' } }
        );
        console.log(`   ✅ Updated TPO ${tpo.email} with status: pending`);
      } else {
        console.log(`   ℹ️  TPO ${tpo.email} already has status: ${tpo.status}`);
      }
    }

    // Fix 3: Set some TPOs as active for testing
    console.log('\n🔧 Setting some TPOs as active for testing...');
    
    // Set first TPO in users collection as active
    if (tposInUsers.length > 0) {
      await usersCollection.updateOne(
        { _id: tposInUsers[0]._id },
        { $set: { status: 'active' } }
      );
      console.log(`   ✅ Set TPO ${tposInUsers[0].email} as active`);
    }

    // Set first TPO in tpos collection as active
    if (tposInCollection.length > 0) {
      await tposCollection.updateOne(
        { _id: tposInCollection[0]._id },
        { $set: { status: 'active' } }
      );
      console.log(`   ✅ Set TPO ${tposInCollection[0].email} as active`);
    }

    console.log('\n🎯 Summary of fixes:');
    console.log(`   Users collection TPOs: ${tposInUsers.length}`);
    console.log(`   TPOs collection TPOs: ${tposInCollection.length}`);
    console.log(`   Total TPOs: ${tposInUsers.length + tposInCollection.length}`);

    console.log('\n✅ TPO Status Fix completed!');
    console.log('💡 Now you can test the approval system:');
    console.log('   1. Register a new TPO (should get status: pending)');
    console.log('   2. Check superadmin dashboard for pending TPOs');
    console.log('   3. Approve a TPO and see them get access');

  } catch (error) {
    console.error('❌ Error fixing TPO status:', error);
    console.error('Error details:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the fix
fixTPOStatus();
