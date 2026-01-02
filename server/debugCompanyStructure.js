const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

const debugCompanyStructure = async () => {
  try {
    console.log('🔍 Debugging company data structure...\n');

    // Get all companies
    const companies = await User.find({ role: 'company' });
    console.log(`Found ${companies.length} companies\n`);

    // Examine each company's structure
    companies.forEach((company, index) => {
      console.log(`🏢 Company ${index + 1}:`);
      console.log(`   Name: ${company.companyName || 'N/A'}`);
      console.log(`   Email: ${company.email}`);
      console.log(`   jobPostings field exists: ${company.jobPostings !== undefined}`);
      console.log(`   jobPostings type: ${typeof company.jobPostings}`);
      console.log(`   jobPostings is array: ${Array.isArray(company.jobPostings)}`);
      
      if (company.jobPostings && Array.isArray(company.jobPostings)) {
        console.log(`   jobPostings length: ${company.jobPostings.length}`);
        if (company.jobPostings.length > 0) {
          console.log(`   First job posting:`, JSON.stringify(company.jobPostings[0], null, 2));
        }
      } else {
        console.log(`   jobPostings value: ${company.jobPostings}`);
      }
      
      // Check all fields that might contain job data
      const possibleJobFields = ['jobs', 'jobPostings', 'postings', 'openings', 'vacancies'];
      possibleJobFields.forEach(field => {
        if (company[field] !== undefined) {
          console.log(`   ${field} field exists: ${company[field] !== undefined}`);
          console.log(`   ${field} value:`, company[field]);
        }
      });
      
      console.log('   All fields:', Object.keys(company));
      console.log('');
    });

    // Check if there are any documents with job-related data
    console.log('🔍 Searching for any job-related data...');
    const allUsers = await User.find({});
    const usersWithJobs = allUsers.filter(user => {
      return user.jobPostings || user.jobs || user.postings || user.openings || user.vacancies;
    });
    
    if (usersWithJobs.length > 0) {
      console.log(`Found ${usersWithJobs.length} users with job data:`);
      usersWithJobs.forEach(user => {
        console.log(`   ${user.role}: ${user.email || user.name || user.companyName}`);
        console.log(`   Fields with job data:`, Object.keys(user).filter(key => 
          ['jobPostings', 'jobs', 'postings', 'openings', 'vacancies'].includes(key)
        ));
      });
    } else {
      console.log('No users found with job-related data');
    }

  } catch (error) {
    console.error('❌ Error debugging company structure:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the debug
debugCompanyStructure();
