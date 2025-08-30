const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedSampleData = async () => {
  try {
    console.log('🌱 Starting to seed sample data...');

    // Find some existing users to use as references
    const students = await User.find({ role: 'student', status: 'active' }).limit(5);
    const companies = await User.find({ role: 'company', status: 'active' }).limit(3);

    if (students.length === 0) {
      console.log('❌ No active students found. Please create some students first.');
      return;
    }

    if (companies.length === 0) {
      console.log('❌ No active companies found. Please create some companies first.');
      return;
    }

    console.log(`📊 Found ${students.length} students and ${companies.length} companies`);

    // Create sample jobs
    const sampleJobs = [
      {
        title: 'Frontend Developer',
        company: companies[0]._id,
        description: 'We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences.',
        requirements: ['React', 'JavaScript', 'CSS', 'HTML', '2+ years experience'],
        location: 'Mumbai, India',
        type: 'full-time',
        salary: { min: 600000, max: 1200000, currency: 'INR' },
        status: 'active',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        tags: ['React', 'Frontend', 'JavaScript', 'Web Development']
      },
      {
        title: 'Data Scientist',
        company: companies[0]._id,
        description: 'Join our data team to analyze complex datasets and drive business decisions through insights.',
        requirements: ['Python', 'Machine Learning', 'Statistics', 'SQL', '3+ years experience'],
        location: 'Delhi, India',
        type: 'full-time',
        salary: { min: 800000, max: 1500000, currency: 'INR' },
        status: 'active',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        tags: ['Python', 'Machine Learning', 'Data Science', 'Analytics']
      },
      {
        title: 'Marketing Intern',
        company: companies[1] ? companies[1]._id : companies[0]._id,
        description: 'Great opportunity for marketing students to gain real-world experience in digital marketing.',
        requirements: ['Marketing knowledge', 'Social media skills', 'Creative thinking', 'Student status'],
        location: 'Remote',
        type: 'internship',
        salary: { min: 15000, max: 25000, currency: 'INR' },
        status: 'active',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        tags: ['Marketing', 'Internship', 'Digital Marketing', 'Remote']
      },
      {
        title: 'Backend Developer',
        company: companies[2] ? companies[2]._id : companies[0]._id,
        description: 'Build scalable backend systems and APIs using modern technologies.',
        requirements: ['Node.js', 'MongoDB', 'Express', 'REST APIs', '2+ years experience'],
        location: 'Bangalore, India',
        type: 'full-time',
        salary: { min: 700000, max: 1400000, currency: 'INR' },
        status: 'active',
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
        tags: ['Node.js', 'Backend', 'MongoDB', 'API Development']
      }
    ];

    // Clear existing jobs and applications
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Cleared existing jobs and applications');

    // Insert sample jobs
    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Created ${createdJobs.length} sample jobs`);

    // Create sample applications
    const sampleApplications = [];
    
    // Create applications for each job
    for (let i = 0; i < createdJobs.length; i++) {
      const job = createdJobs[i];
      const numApplications = Math.floor(Math.random() * 3) + 1; // 1-3 applications per job
      
      for (let j = 0; j < numApplications; j++) {
        const student = students[Math.floor(Math.random() * students.length)];
        
        sampleApplications.push({
          job: job._id,
          applicant: student._id,
          company: job.company,
          status: ['pending', 'reviewing', 'shortlisted'][Math.floor(Math.random() * 3)],
          coverLetter: `I am excited to apply for the ${job.title} position. I believe my skills and experience make me a great fit for this role. I am passionate about ${job.tags[0]} and eager to contribute to your team.`,
          appliedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
        });
      }
    }

    // Insert sample applications
    const createdApplications = await Application.insertMany(sampleApplications);
    console.log(`✅ Created ${createdApplications.length} sample applications`);

    // Update jobs with application references
    for (let i = 0; i < createdJobs.length; i++) {
      const job = createdJobs[i];
      const jobApplications = createdApplications.filter(app => app.job.toString() === job._id.toString());
      await Job.findByIdAndUpdate(job._id, { applications: jobApplications.map(app => app._id) });
    }

    console.log('🔗 Linked applications to jobs');

    // Display summary
    const finalJobCount = await Job.countDocuments();
    const finalApplicationCount = await Application.countDocuments();
    
    console.log('\n📊 Sample Data Summary:');
    console.log(`   Jobs: ${finalJobCount}`);
    console.log(`   Applications: ${finalApplicationCount}`);
    console.log('\n✅ Sample data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeding
seedSampleData();
