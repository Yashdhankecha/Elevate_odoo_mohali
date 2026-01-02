const mongoose = require('mongoose');
const JobPosting = require('./models/JobPosting');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugJobs() {
  try {
    console.log('🔍 Debugging Jobs and Company Data...\n');

    // Get all jobs
    const jobs = await JobPosting.find({}).populate('company', 'company email');
    
    console.log(`📊 Found ${jobs.length} jobs in database\n`);

    if (jobs.length === 0) {
      console.log('❌ No jobs found in database');
      return;
    }

    // Check each job
    jobs.forEach((job, index) => {
      console.log(`\n📋 Job ${index + 1}:`);
      console.log(`   Title: ${job.title}`);
      console.log(`   Company ID: ${job.company?._id || 'NULL'}`);
      console.log(`   Company Object:`, job.company);
      
      if (job.company) {
        console.log(`   Company Name: ${job.company.company?.companyName || 'NULL'}`);
        console.log(`   Company Email: ${job.company.email || 'NULL'}`);
      } else {
        console.log(`   ❌ No company data found`);
      }
    });

    // Check companies
    console.log('\n🏢 Checking Companies...');
    const companies = await User.find({ role: 'company' }).select('company email');
    console.log(`Found ${companies.length} companies:`);
    
    companies.forEach((company, index) => {
      console.log(`   ${index + 1}. ${company.company?.companyName || 'No name'} (${company.email})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugJobs();
