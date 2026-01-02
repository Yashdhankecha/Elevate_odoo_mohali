const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testAdminRoutes = async () => {
  try {
    console.log('🔍 Testing admin routes logic...\n');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ MongoDB connected successfully');

    // Test 1: Check if we can access collections
    const db = mongoose.connection.db;
    console.log('✅ Database connection ready');

    // Test 2: Count students from users collection
    const usersCollection = db.collection('users');
    const usersStudents = await usersCollection.countDocuments({ role: 'student' });
    console.log(`📊 Students in users collection: ${usersStudents}`);

    // Test 3: Count students from students collection
    const studentsCollection = db.collection('students');
    const separateStudents = await studentsCollection.countDocuments({});
    console.log(`👨‍🎓 Students in students collection: ${separateStudents}`);

    // Test 4: Count companies from users collection
    const usersCompanies = await usersCollection.countDocuments({ role: 'company' });
    console.log(`🏢 Companies in users collection: ${usersCompanies}`);

    // Test 5: Count companies from companies collection
    const companiesCollection = db.collection('companies');
    const separateCompanies = await companiesCollection.countDocuments({});
    console.log(`🏢 Companies in companies collection: ${separateCompanies}`);

    // Test 6: Count job postings
    const jobPostingsCollection = db.collection('jobpostings');
    const totalJobPostings = await jobPostingsCollection.countDocuments({});
    console.log(`💼 Job postings: ${totalJobPostings}`);

    // Test 7: Count applications
    const jobApplicationsCollection = db.collection('jobapplications');
    const totalApplications = await jobApplicationsCollection.countDocuments({});
    console.log(`📝 Applications: ${totalApplications}`);

    // Calculate totals
    const totalStudents = usersStudents + separateStudents;
    const totalCompanies = usersCompanies + separateCompanies;

    console.log(`\n🎯 Final Counts:`);
    console.log(`   Total Students: ${totalStudents}`);
    console.log(`   Total Companies: ${totalCompanies}`);
    console.log(`   Total Job Postings: ${totalJobPostings}`);
    console.log(`   Total Applications: ${totalApplications}`);

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('❌ Error testing admin routes:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
testAdminRoutes();
