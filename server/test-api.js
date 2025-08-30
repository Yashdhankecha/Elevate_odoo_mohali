const mongoose = require('mongoose');
const JobPosting = require('./models/JobPosting');
const User = require('./models/User');

async function testJobsAPI() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/elevate_odoo_mohali');
    console.log('Connected to MongoDB');

    // Check job postings
    const jobs = await JobPosting.find({ isActive: true });
    console.log(`\n📊 Total active job postings: ${jobs.length}`);

    if (jobs.length > 0) {
      console.log('\n📋 Sample job postings:');
      jobs.slice(0, 3).forEach((job, index) => {
        console.log(`${index + 1}. ${job.title}`);
        console.log(`   Company: ${job.company}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Salary: ₹${job.package?.min/100000}-${job.package?.max/100000} LPA`);
        console.log(`   Applications: ${job.applicationCount}`);
        console.log('');
      });
    }

    // Check users
    const users = await User.find({});
    console.log(`\n👥 Total users: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - Verified: ${user.isVerified}`);
    });

    // Test the query that the API uses
    console.log('\n🔍 Testing API query...');
    const apiJobs = await JobPosting.find({ isActive: true })
      .populate('company', 'company.companyName company.industry company.logo')
      .sort({ postedAt: -1 })
      .limit(10);

    console.log(`API query returned ${apiJobs.length} jobs`);
    
    if (apiJobs.length > 0) {
      const sampleJob = apiJobs[0];
      console.log('\n📄 Sample API response format:');
      console.log({
        id: sampleJob._id,
        title: sampleJob.title,
        company: sampleJob.company?.company?.companyName || 'Company',
        companyLogo: sampleJob.company?.company?.logo || null,
        location: sampleJob.location,
        salary: sampleJob.package ? 
          `₹${sampleJob.package.min/100000}-${sampleJob.package.max/100000} LPA` : 
          'Not specified',
        applications: sampleJob.applicationCount
      });
    }

    mongoose.connection.close();
    console.log('\n✅ Test completed successfully');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testJobsAPI();
