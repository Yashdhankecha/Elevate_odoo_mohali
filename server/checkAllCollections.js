const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkAllCollections = async () => {
  try {
    console.log('🔍 Checking ALL collections in your database...\n');

    // Wait for connection to be ready
    await mongoose.connection.asPromise();
    const db = mongoose.connection.db;
    
    // Check users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`📊 users collection: ${usersCount} documents`);

    // Check students collection
    const studentsCount = await db.collection('students').countDocuments();
    console.log(`👨‍🎓 students collection: ${studentsCount} documents`);

    // Check companies collection
    const companiesCount = await db.collection('companies').countDocuments();
    console.log(`🏢 companies collection: ${companiesCount} documents`);

    // Check tpos collection
    const tposCount = await db.collection('tpos').countDocuments();
    console.log(`👨‍💼 tpos collection: ${tposCount} documents`);

    // Check jobpostings collection
    const jobPostingsCount = await db.collection('jobpostings').countDocuments();
    console.log(`💼 jobpostings collection: ${jobPostingsCount} documents`);

    // Check applications collection
    const applicationsCount = await db.collection('applications').countDocuments();
    console.log(`📝 applications collection: ${applicationsCount} documents`);

    // Check jobs collection
    const jobsCount = await db.collection('jobs').countDocuments();
    console.log(`🔧 jobs collection: ${jobsCount} documents`);

    // Check jobapplications collection
    const jobApplicationsCount = await db.collection('jobapplications').countDocuments();
    console.log(`📋 jobapplications collection: ${jobApplicationsCount} documents`);

    // Calculate total users across all collections
    const totalUsers = usersCount + studentsCount + companiesCount + tposCount;
    console.log(`\n🎯 Total Users Across All Collections: ${totalUsers}`);

    // Show sample documents from each collection
    console.log(`\n📋 Sample Documents:`);
    
    if (studentsCount > 0) {
      const sampleStudent = await db.collection('students').findOne();
      console.log(`\n👨‍🎓 Sample Student:`);
      console.log(`   Fields:`, Object.keys(sampleStudent || {}));
    }

    if (companiesCount > 0) {
      const sampleCompany = await db.collection('companies').findOne();
      console.log(`\n🏢 Sample Company:`);
      console.log(`   Fields:`, Object.keys(sampleCompany || {}));
    }

    if (jobPostingsCount > 0) {
      const sampleJob = await db.collection('jobpostings').findOne();
      console.log(`\n💼 Sample Job Posting:`);
      console.log(`   Fields:`, Object.keys(sampleJob || {}));
    }

    if (applicationsCount > 0) {
      const sampleApp = await db.collection('applications').findOne();
      console.log(`\n📝 Sample Application:`);
      console.log(`   Fields:`, Object.keys(sampleApp || {}));
    }

  } catch (error) {
    console.error('❌ Error checking collections:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the check
checkAllCollections();
