const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleJobPostings = [
  {
    title: 'Software Engineer - Full Stack',
    description: 'We are looking for a talented Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    category: 'software-engineering',
    package: {
      min: 800000, // 8 LPA
      max: 1500000, // 15 LPA
      currency: 'INR'
    },
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of experience in full-stack development',
      'Proficiency in JavaScript, React, Node.js',
      'Experience with databases (MongoDB, PostgreSQL)',
      'Knowledge of cloud platforms (AWS, Azure)'
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Troubleshoot and debug issues'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
    experience: {
      min: 3,
      max: 6
    },
    isActive: true,
    postedAt: new Date('2024-03-01'),
    deadline: new Date('2024-04-15')
  },
  {
    title: 'Data Scientist',
    description: 'Join our data science team to build machine learning models and drive data-driven decisions. You will work on cutting-edge AI/ML projects.',
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    category: 'data-science',
    package: {
      min: 1200000, // 12 LPA
      max: 2000000, // 20 LPA
      currency: 'INR'
    },
    requirements: [
      'Master\'s degree in Data Science, Statistics, or related field',
      '2+ years of experience in data science',
      'Proficiency in Python, R, SQL',
      'Experience with ML frameworks (TensorFlow, PyTorch)',
      'Strong statistical and analytical skills'
    ],
    responsibilities: [
      'Develop machine learning models',
      'Analyze large datasets',
      'Create data visualizations',
      'Present findings to stakeholders',
      'Collaborate with engineering teams'
    ],
    skills: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Tableau'],
    experience: {
      min: 2,
      max: 5
    },
    isActive: true,
    postedAt: new Date('2024-03-05'),
    deadline: new Date('2024-04-20')
  },
  {
    title: 'Product Manager',
    description: 'Lead product strategy and development for our flagship products. You will work closely with engineering, design, and business teams.',
    location: 'Delhi, NCR',
    type: 'full-time',
    category: 'product-management',
    package: {
      min: 1500000, // 15 LPA
      max: 2500000, // 25 LPA
      currency: 'INR'
    },
    requirements: [
      'Bachelor\'s degree in Business, Engineering, or related field',
      '4+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Excellent communication and leadership abilities',
      'Experience with agile methodologies'
    ],
    responsibilities: [
      'Define product vision and strategy',
      'Create product roadmaps',
      'Work with cross-functional teams',
      'Analyze market trends and competition',
      'Drive product launches and go-to-market strategies'
    ],
    skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Leadership'],
    experience: {
      min: 4,
      max: 8
    },
    isActive: true,
    postedAt: new Date('2024-03-10'),
    deadline: new Date('2024-04-25')
  },
  {
    title: 'UI/UX Designer',
    description: 'Create beautiful and intuitive user experiences for our digital products. You will work on user research, wireframing, and visual design.',
    location: 'Pune, Maharashtra',
    type: 'full-time',
    category: 'design',
    package: {
      min: 600000, // 6 LPA
      max: 1200000, // 12 LPA
      currency: 'INR'
    },
    requirements: [
      'Bachelor\'s degree in Design or related field',
      '2+ years of UI/UX design experience',
      'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
      'Understanding of user-centered design principles',
      'Portfolio showcasing previous work'
    ],
    responsibilities: [
      'Create user personas and journey maps',
      'Design wireframes and prototypes',
      'Conduct user research and usability testing',
      'Collaborate with developers and product managers',
      'Maintain design systems and style guides'
    ],
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    experience: {
      min: 2,
      max: 5
    },
    isActive: true,
    postedAt: new Date('2024-03-12'),
    deadline: new Date('2024-04-30')
  },
  {
    title: 'Marketing Specialist',
    description: 'Drive digital marketing campaigns and brand awareness. You will be responsible for content creation, social media management, and lead generation.',
    location: 'Hyderabad, Telangana',
    type: 'full-time',
    category: 'marketing',
    package: {
      min: 500000, // 5 LPA
      max: 1000000, // 10 LPA
      currency: 'INR'
    },
    requirements: [
      'Bachelor\'s degree in Marketing, Communications, or related field',
      '2+ years of digital marketing experience',
      'Experience with social media platforms and tools',
      'Knowledge of SEO and content marketing',
      'Strong writing and communication skills'
    ],
    responsibilities: [
      'Develop and execute marketing campaigns',
      'Manage social media presence',
      'Create engaging content for various channels',
      'Analyze campaign performance and optimize',
      'Collaborate with sales and product teams'
    ],
    skills: ['Social Media Marketing', 'Content Creation', 'SEO', 'Google Analytics', 'Email Marketing'],
    experience: {
      min: 2,
      max: 4
    },
    isActive: true,
    postedAt: new Date('2024-03-15'),
    deadline: new Date('2024-05-05')
  },
  {
    title: 'Sales Executive',
    description: 'Drive revenue growth through B2B sales. You will be responsible for prospecting, lead qualification, and closing deals.',
    location: 'Chennai, Tamil Nadu',
    type: 'full-time',
    category: 'sales',
    package: {
      min: 400000, // 4 LPA
      max: 800000, // 8 LPA
      currency: 'INR'
    },
    requirements: [
      'Bachelor\'s degree in Business, Marketing, or related field',
      '1+ years of B2B sales experience',
      'Strong negotiation and communication skills',
      'Experience with CRM systems',
      'Ability to work in a target-driven environment'
    ],
    responsibilities: [
      'Prospect and qualify leads',
      'Conduct product demonstrations',
      'Negotiate contracts and close deals',
      'Maintain relationships with existing clients',
      'Meet and exceed sales targets'
    ],
    skills: ['B2B Sales', 'CRM', 'Negotiation', 'Lead Generation', 'Client Relationship'],
    experience: {
      min: 1,
      max: 3
    },
    isActive: true,
    postedAt: new Date('2024-03-18'),
    deadline: new Date('2024-05-10')
  }
];

const seedJobPostings = async () => {
  try {
    console.log('🌱 Starting job postings data seeding...');

    // Clear existing job postings
    await JobPosting.deleteMany({});
    console.log('✅ Cleared existing job postings');

    // Get a sample company for job postings
    const companies = await User.find({ role: 'company' }).limit(1);
    if (companies.length === 0) {
      console.log('❌ No companies found. Please seed company data first.');
      return;
    }

    const companyId = companies[0]._id;

    // Create job postings with company reference
    const jobPostingsWithCompany = sampleJobPostings.map(job => ({
      ...job,
      company: companyId
    }));

    // Insert job postings
    const createdJobPostings = await JobPosting.insertMany(jobPostingsWithCompany);
    console.log(`✅ Created ${createdJobPostings.length} job postings`);

    console.log('🎉 Job postings data seeding completed successfully!');
    console.log('\n📊 Job Postings Statistics:');
    console.log(`- Total Job Postings: ${createdJobPostings.length}`);
    console.log(`- Active: ${createdJobPostings.filter(j => j.isActive).length}`);
    console.log(`- Full-time: ${createdJobPostings.filter(j => j.type === 'full-time').length}`);
    console.log(`- Software Engineering: ${createdJobPostings.filter(j => j.category === 'software-engineering').length}`);

  } catch (error) {
    console.error('❌ Error seeding job postings data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
seedJobPostings();
