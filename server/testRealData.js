const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCGC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

const testRealData = async () => {
  try {
    console.log('🔍 Testing real data from your database...\n');

    // Test 1: Count students
    const studentCount = await User.countDocuments({ role: 'student' });
    console.log(`📊 Total Students: ${studentCount}`);

    // Test 2: Count companies
    const companyCount = await User.countDocuments({ role: 'company' });
    console.log(`🏢 Total Companies: ${companyCount}`);

    // Test 3: Count job postings from companies
    const companies = await User.find({ role: 'company' });
    let totalJobPostings = 0;
    
    companies.forEach(company => {
      if (company.jobPostings && Array.isArray(company.jobPostings)) {
        totalJobPostings += company.jobPostings.length;
      }
    });
    console.log(`💼 Total Job Postings: ${totalJobPostings}`);

    // Test 4: Count applications from job postings
    let totalApplications = 0;
    
    companies.forEach(company => {
      if (company.jobPostings && Array.isArray(company.jobPostings)) {
        company.jobPostings.forEach(job => {
          if (job.applications && Array.isArray(job.applications)) {
            totalApplications += job.applications.length;
          }
        });
      }
    });
    console.log(`📝 Total Applications: ${totalApplications}`);

    // Test 5: Show sample data structure
    console.log('\n📋 Sample Data Structure:');
    
    if (companies.length > 0) {
      const sampleCompany = companies[0];
      console.log(`Company: ${sampleCompany.companyName || sampleCompany.email}`);
      console.log(`Job Postings: ${sampleCompany.jobPostings ? sampleCompany.jobPostings.length : 0}`);
      
      if (sampleCompany.jobPostings && sampleCompany.jobPostings.length > 0) {
        const sampleJob = sampleCompany.jobPostings[0];
        console.log(`Sample Job: ${sampleJob.title || 'Untitled'}`);
        console.log(`Applications: ${sampleJob.applications ? sampleJob.applications.length : 0}`);
      }
    }

    if (studentCount > 0) {
      const sampleStudent = await User.findOne({ role: 'student' });
      console.log(`\nSample Student: ${sampleStudent.name || sampleStudent.email}`);
      console.log(`Branch: ${sampleStudent.branch || 'N/A'}`);
      console.log(`College: ${sampleStudent.collegeName || 'N/A'}`);
    }

    console.log('\n✅ Real data test completed successfully!');
    console.log('\n🎯 Your dashboard should now show:');
    console.log(`   Students: ${studentCount}`);
    console.log(`   Companies: ${companyCount}`);
    console.log(`   Job Postings: ${totalJobPostings}`);
    console.log(`   Applications: ${totalApplications}`);

  } catch (error) {
    console.error('❌ Error testing real data:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
testRealData();
