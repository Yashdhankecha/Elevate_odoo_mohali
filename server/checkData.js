const mongoose = require('mongoose');
const User = require('./models/User');
const JobPosting = require('./models/JobPosting');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkData() {
  try {
    console.log('🔍 Checking Database Data...\n');

    // Check companies
    const companies = await User.find({ role: 'company' });
    console.log(`🏢 Found ${companies.length} companies:`);
    companies.forEach((company, index) => {
      console.log(`   ${index + 1}. ${company.company?.companyName || 'No name'} (${company.email})`);
    });

    // Check jobs
    const jobs = await JobPosting.find({});
    console.log(`\n📋 Found ${jobs.length} jobs:`);
    jobs.forEach((job, index) => {
      console.log(`   ${index + 1}. ${job.title} (Company: ${job.company})`);
    });

    // Check TPO users
    const tpos = await User.find({ role: 'tpo' });
    console.log(`\n👨‍🏫 Found ${tpos.length} TPO users:`);
    tpos.forEach((tpo, index) => {
      console.log(`   ${index + 1}. ${tpo.tpo?.name || 'No name'} (${tpo.email})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkData();
