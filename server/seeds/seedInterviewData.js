const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleInterviews = [
  {
    candidate: 'Rahul Sharma',
    role: 'Software Engineer',
    date: new Date('2024-03-15'),
    time: '10:00',
    type: 'Technical',
    status: 'Scheduled',
    interviewer: 'John Smith',
    location: 'Conference Room A',
    duration: '60',
    notes: 'Frontend development focus',
    result: 'Not Evaluated'
  },
  {
    candidate: 'Priya Patel',
    role: 'Data Scientist',
    date: new Date('2024-03-16'),
    time: '14:30',
    type: 'Technical',
    status: 'Completed',
    interviewer: 'Sarah Johnson',
    location: 'Conference Room B',
    duration: '90',
    notes: 'Machine learning algorithms discussion',
    feedback: 'Strong technical skills, good problem-solving approach',
    rating: 4,
    result: 'Passed'
  },
  {
    candidate: 'Amit Kumar',
    role: 'Product Manager',
    date: new Date('2024-03-17'),
    time: '11:00',
    type: 'HR Round',
    status: 'Scheduled',
    interviewer: 'Mike Wilson',
    location: 'Conference Room C',
    duration: '45',
    notes: 'Leadership and communication skills assessment',
    result: 'Not Evaluated'
  },
  {
    candidate: 'Neha Singh',
    role: 'UI/UX Designer',
    date: new Date('2024-03-14'),
    time: '15:00',
    type: 'Managerial',
    status: 'Completed',
    interviewer: 'Lisa Chen',
    location: 'Conference Room A',
    duration: '60',
    notes: 'Portfolio review and design thinking',
    feedback: 'Excellent design sense, needs improvement in user research',
    rating: 3,
    result: 'On Hold'
  },
  {
    candidate: 'Vikram Malhotra',
    role: 'DevOps Engineer',
    date: new Date('2024-03-18'),
    time: '09:30',
    type: 'Technical',
    status: 'In Progress',
    interviewer: 'David Brown',
    location: 'Conference Room B',
    duration: '60',
    notes: 'Infrastructure and deployment discussion',
    result: 'Not Evaluated'
  },
  {
    candidate: 'Anjali Gupta',
    role: 'Marketing Specialist',
    date: new Date('2024-03-19'),
    time: '13:00',
    type: 'Final',
    status: 'Scheduled',
    interviewer: 'Emily Davis',
    location: 'Conference Room C',
    duration: '60',
    notes: 'Final round with senior management',
    result: 'Not Evaluated'
  },
  {
    candidate: 'Rajesh Verma',
    role: 'Sales Executive',
    date: new Date('2024-03-13'),
    time: '16:00',
    type: 'HR Round',
    status: 'Completed',
    interviewer: 'Tom Anderson',
    location: 'Conference Room A',
    duration: '45',
    notes: 'Sales experience and target achievement discussion',
    feedback: 'Good communication skills, needs training on CRM tools',
    rating: 3,
    result: 'Passed'
  },
  {
    candidate: 'Sneha Reddy',
    role: 'Business Analyst',
    date: new Date('2024-03-20'),
    time: '10:30',
    type: 'Technical',
    status: 'Scheduled',
    interviewer: 'Jennifer Lee',
    location: 'Conference Room B',
    duration: '60',
    notes: 'Requirements gathering and analysis skills',
    result: 'Not Evaluated'
  }
];

const seedInterviews = async () => {
  try {
    console.log('🌱 Starting interview data seeding...');

    // Clear existing interviews
    await Interview.deleteMany({});
    console.log('✅ Cleared existing interviews');

    // Get a sample company for interviews
    const companies = await User.find({ role: 'company' }).limit(1);
    if (companies.length === 0) {
      console.log('❌ No companies found. Please seed company data first.');
      return;
    }

    const companyId = companies[0]._id;

    // Create interviews with company reference
    const interviewsWithCompany = sampleInterviews.map(interview => ({
      ...interview,
      company: companyId
    }));

    // Insert interviews
    const createdInterviews = await Interview.insertMany(interviewsWithCompany);
    console.log(`✅ Created ${createdInterviews.length} interviews`);

    console.log('🎉 Interview data seeding completed successfully!');
    console.log('\n📊 Interview Statistics:');
    console.log(`- Total Interviews: ${createdInterviews.length}`);
    console.log(`- Scheduled: ${createdInterviews.filter(i => i.status === 'Scheduled').length}`);
    console.log(`- Completed: ${createdInterviews.filter(i => i.status === 'Completed').length}`);
    console.log(`- In Progress: ${createdInterviews.filter(i => i.status === 'In Progress').length}`);

  } catch (error) {
    console.error('❌ Error seeding interview data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
seedInterviews();
