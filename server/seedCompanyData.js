const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Job = require('./models/Job');
const Interview = require('./models/Interview');

// Sample company data
const sampleCompany = {
  email: 'hr@techcorp.com',
  password: 'password123',
  role: 'company',
  status: 'active',
  isVerified: true,
  company: {
    companyName: 'TechCorp Solutions',
    contactNumber: '+91-9876543210',
    industry: 'Technology',
    companySize: 'medium',
    website: 'https://techcorp.com',
    description: 'Leading technology solutions provider specializing in software development and digital transformation.',
    location: 'Bangalore, India'
  }
};

// Sample jobs data
const sampleJobs = [
  {
    title: 'Software Engineer Intern',
    department: 'Engineering',
    description: 'We are looking for a talented software engineer intern to join our team. You will work on real projects and learn from experienced developers.',
    requirements: ['React', 'Node.js', 'JavaScript', 'Git'],
    location: 'Bangalore, India',
    salary: '₹8-12 LPA',
    type: 'internship',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'Active'
  },
  {
    title: 'Data Analyst',
    department: 'Data Science',
    description: 'Join our data science team to analyze and interpret complex data sets. Help us make data-driven decisions.',
    requirements: ['Python', 'SQL', 'Tableau', 'Statistics'],
    location: 'Mumbai, India',
    salary: '₹10-15 LPA',
    type: 'full-time',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    status: 'Active'
  },
  {
    title: 'Product Manager Trainee',
    department: 'Product',
    description: 'Learn product management from industry experts. Work on real products and understand the complete product lifecycle.',
    requirements: ['Analytics', 'Communication', 'Leadership'],
    location: 'Delhi, India',
    salary: '₹12-18 LPA',
    type: 'full-time',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    status: 'Draft'
  },
  {
    title: 'Frontend Developer',
    department: 'Engineering',
    description: 'Build beautiful and responsive user interfaces. Work with modern frameworks and create amazing user experiences.',
    requirements: ['React', 'TypeScript', 'CSS', 'UI/UX'],
    location: 'Hyderabad, India',
    salary: '₹15-25 LPA',
    type: 'full-time',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    status: 'Active'
  }
];

// Sample interviews data
const sampleInterviews = [
  {
    candidate: 'Priya Sharma',
    role: 'Software Engineer',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    time: '10:00',
    type: 'Technical',
    status: 'Scheduled',
    interviewer: 'John Doe',
    location: 'Conference Room A',
    duration: '60',
    notes: 'Focus on React and Node.js skills'
  },
  {
    candidate: 'Arjun Patel',
    role: 'Data Analyst',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    time: '14:00',
    type: 'HR Round',
    status: 'Scheduled',
    interviewer: 'Sarah Johnson',
    location: 'Virtual Meeting',
    duration: '45',
    notes: 'Discuss career goals and company culture'
  },
  {
    candidate: 'Kavya Reddy',
    role: 'Product Manager',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    time: '11:30',
    type: 'Technical',
    status: 'Completed',
    interviewer: 'Mike Wilson',
    location: 'Conference Room B',
    duration: '90',
    notes: 'Case study discussion completed'
  }
];

async function seedCompanyData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCGC');
    console.log('✅ Connected to MongoDB');

    // Check if company already exists
    let company = await User.findOne({ email: sampleCompany.email });
    
    if (!company) {
      // Create company
      company = new User(sampleCompany);
      await company.save();
      console.log('✅ Company created:', company.company.companyName);
    } else {
      console.log('✅ Company already exists:', company.company.companyName);
    }

    // Clear existing jobs and interviews for this company
    await Job.deleteMany({ company: company._id });
    await Interview.deleteMany({ company: company._id });
    console.log('✅ Cleared existing jobs and interviews');

    // Create jobs
    const createdJobs = [];
    for (const jobData of sampleJobs) {
      const job = new Job({
        ...jobData,
        company: company._id
      });
      await job.save();
      createdJobs.push(job);
      console.log('✅ Job created:', job.title);
    }

    // Create interviews
    for (const interviewData of sampleInterviews) {
      const interview = new Interview({
        ...interviewData,
        company: company._id
      });
      await interview.save();
      console.log('✅ Interview created:', interview.candidate);
    }

    console.log('\n🎉 Company data seeded successfully!');
    console.log(`Company: ${company.company.companyName}`);
    console.log(`Jobs created: ${createdJobs.length}`);
    console.log(`Interviews created: ${sampleInterviews.length}`);
    console.log(`\nCompany ID: ${company._id}`);
    console.log(`Company Email: ${company.email}`);
    console.log(`Company Password: password123`);

  } catch (error) {
    console.error('❌ Error seeding company data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the seeding function
seedCompanyData();
