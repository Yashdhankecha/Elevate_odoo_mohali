const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');
const User = require('../models/User');

// Sample job postings data
const sampleJobPostings = [
  {
    title: 'Frontend Developer',
    description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user-friendly web applications using React, JavaScript, and modern web technologies.',
    requirements: [
      'Strong knowledge of React.js and JavaScript',
      'Experience with HTML5, CSS3, and responsive design',
      'Familiarity with state management (Redux/Context API)',
      'Knowledge of modern build tools (Webpack, Babel)',
      'Understanding of RESTful APIs and GraphQL'
    ],
    responsibilities: [
      'Develop and maintain user-facing features',
      'Build reusable code and libraries for future use',
      'Optimize applications for maximum speed and scalability',
      'Collaborate with other team members and stakeholders'
    ],
    package: {
      min: 600000, // 6 LPA
      max: 1200000, // 12 LPA
      currency: 'INR'
    },
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    category: 'software-engineering',
    experience: {
      min: 1,
      max: 3
    },
    skills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'Git'],
    isActive: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    applicationCount: 15,
    views: 120
  },
  {
    title: 'Data Scientist',
    description: 'Join our data science team to work on cutting-edge machine learning projects. You will develop predictive models, analyze large datasets, and help drive data-driven decisions.',
    requirements: [
      'Strong background in statistics and mathematics',
      'Proficiency in Python and data science libraries',
      'Experience with machine learning algorithms',
      'Knowledge of SQL and database systems',
      'Familiarity with big data technologies'
    ],
    responsibilities: [
      'Develop and implement machine learning models',
      'Analyze complex datasets to extract insights',
      'Create data visualizations and reports',
      'Collaborate with cross-functional teams'
    ],
    package: {
      min: 800000, // 8 LPA
      max: 1800000, // 18 LPA
      currency: 'INR'
    },
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    category: 'data-science',
    experience: {
      min: 2,
      max: 5
    },
    skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'TensorFlow', 'Pandas'],
    isActive: true,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    applicationCount: 28,
    views: 200
  },
  {
    title: 'Product Manager',
    description: 'We are seeking an experienced Product Manager to lead product strategy and development. You will work closely with engineering, design, and business teams to deliver exceptional products.',
    requirements: [
      'Strong analytical and problem-solving skills',
      'Experience in product management or related field',
      'Excellent communication and leadership abilities',
      'Understanding of user experience and design principles',
      'Knowledge of agile development methodologies'
    ],
    responsibilities: [
      'Define product vision, strategy, and roadmap',
      'Gather and prioritize product requirements',
      'Work with cross-functional teams to deliver products',
      'Analyze market trends and competitive landscape'
    ],
    package: {
      min: 1000000, // 10 LPA
      max: 2500000, // 25 LPA
      currency: 'INR'
    },
    location: 'Delhi, NCR',
    type: 'full-time',
    category: 'product-management',
    experience: {
      min: 3,
      max: 7
    },
    skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Leadership', 'Communication'],
    isActive: true,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    applicationCount: 12,
    views: 85
  },
  {
    title: 'UI/UX Designer',
    description: 'Join our design team to create beautiful and intuitive user experiences. You will work on web and mobile applications, creating wireframes, prototypes, and final designs.',
    requirements: [
      'Strong portfolio demonstrating UI/UX design skills',
      'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
      'Understanding of user-centered design principles',
      'Experience with prototyping and user testing',
      'Knowledge of design systems and component libraries'
    ],
    responsibilities: [
      'Create user-centered designs by understanding business requirements',
      'Create user flows, wireframes, prototypes and mockups',
      'Translate requirements into style guides, design systems, design patterns and attractive user interfaces',
      'Create original graphic designs (e.g. images, sketches and tables)'
    ],
    package: {
      min: 500000, // 5 LPA
      max: 1200000, // 12 LPA
      currency: 'INR'
    },
    location: 'Remote',
    type: 'full-time',
    category: 'design',
    experience: {
      min: 1,
      max: 4
    },
    skills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research', 'Design Systems', 'Adobe Creative Suite'],
    isActive: true,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
    applicationCount: 22,
    views: 150
  },
  {
    title: 'Backend Developer',
    description: 'We are looking for a Backend Developer to build scalable and robust server-side applications. You will work with Node.js, databases, and cloud technologies.',
    requirements: [
      'Strong knowledge of Node.js and JavaScript',
      'Experience with databases (MongoDB, PostgreSQL)',
      'Understanding of RESTful APIs and microservices',
      'Knowledge of cloud platforms (AWS, Azure, GCP)',
      'Familiarity with Docker and containerization'
    ],
    responsibilities: [
      'Design and implement server-side logic',
      'Build and maintain APIs and microservices',
      'Optimize application performance and scalability',
      'Ensure data security and integrity'
    ],
    package: {
      min: 700000, // 7 LPA
      max: 1500000, // 15 LPA
      currency: 'INR'
    },
    location: 'Pune, Maharashtra',
    type: 'full-time',
    category: 'software-engineering',
    experience: {
      min: 2,
      max: 5
    },
    skills: ['Node.js', 'JavaScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'],
    isActive: true,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
    applicationCount: 18,
    views: 95
  },
  {
    title: 'Marketing Specialist',
    description: 'Join our marketing team to develop and execute digital marketing strategies. You will work on campaigns, content creation, and brand awareness initiatives.',
    requirements: [
      'Experience in digital marketing and campaign management',
      'Knowledge of social media platforms and marketing tools',
      'Strong analytical skills and data-driven approach',
      'Excellent written and verbal communication skills',
      'Understanding of SEO and content marketing'
    ],
    responsibilities: [
      'Develop and execute digital marketing campaigns',
      'Create engaging content for various platforms',
      'Analyze campaign performance and optimize strategies',
      'Manage social media presence and community engagement'
    ],
    package: {
      min: 400000, // 4 LPA
      max: 800000, // 8 LPA
      currency: 'INR'
    },
    location: 'Chennai, Tamil Nadu',
    type: 'full-time',
    category: 'marketing',
    experience: {
      min: 1,
      max: 3
    },
    skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'SEO', 'Analytics', 'Campaign Management'],
    isActive: true,
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
    applicationCount: 35,
    views: 180
  },
  {
    title: 'DevOps Engineer',
    description: 'We are seeking a DevOps Engineer to streamline our development and deployment processes. You will work on CI/CD pipelines, infrastructure automation, and cloud management.',
    requirements: [
      'Experience with CI/CD tools and practices',
      'Knowledge of cloud platforms (AWS, Azure, GCP)',
      'Familiarity with containerization (Docker, Kubernetes)',
      'Understanding of infrastructure as code',
      'Experience with monitoring and logging tools'
    ],
    responsibilities: [
      'Design and implement CI/CD pipelines',
      'Manage cloud infrastructure and resources',
      'Automate deployment and configuration processes',
      'Monitor system performance and ensure reliability'
    ],
    package: {
      min: 800000, // 8 LPA
      max: 1800000, // 18 LPA
      currency: 'INR'
    },
    location: 'Hyderabad, Telangana',
    type: 'full-time',
    category: 'software-engineering',
    experience: {
      min: 2,
      max: 6
    },
    skills: ['CI/CD', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
    isActive: true,
    deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
    applicationCount: 8,
    views: 65
  },
  {
    title: 'Sales Executive',
    description: 'Join our sales team to drive revenue growth and build strong customer relationships. You will be responsible for prospecting, closing deals, and maintaining client relationships.',
    requirements: [
      'Strong sales and negotiation skills',
      'Excellent communication and interpersonal abilities',
      'Experience in B2B sales or related field',
      'Ability to understand customer needs and provide solutions',
      'Self-motivated and target-driven approach'
    ],
    responsibilities: [
      'Identify and prospect potential customers',
      'Conduct sales presentations and product demonstrations',
      'Negotiate contracts and close deals',
      'Maintain relationships with existing clients'
    ],
    package: {
      min: 300000, // 3 LPA
      max: 600000, // 6 LPA
      currency: 'INR'
    },
    location: 'Kolkata, West Bengal',
    type: 'full-time',
    category: 'sales',
    experience: {
      min: 1,
      max: 3
    },
    skills: ['Sales', 'Negotiation', 'Customer Relationship', 'B2B Sales', 'Communication', 'CRM'],
    isActive: true,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    applicationCount: 42,
    views: 220
  }
];

async function seedJobPostings() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/elevate_odoo_mohali');
    console.log('Connected to MongoDB');

    // Clear existing job postings
    await JobPosting.deleteMany({});
    console.log('Cleared existing job postings');

    // Get a company user to associate with job postings
    const companyUser = await User.findOne({ role: 'company' });
    if (!companyUser) {
      console.log('No company user found. Creating a sample company...');
      // Create a sample company if none exists
      const sampleCompany = new User({
        email: 'sample@company.com',
        password: 'password123',
        role: 'company',
        company: {
          companyName: 'Sample Tech Company',
          industry: 'Technology',
          logo: 'https://via.placeholder.com/150',
          description: 'A leading technology company'
        }
      });
      await sampleCompany.save();
      console.log('Created sample company user');
    }

    const company = companyUser || await User.findOne({ role: 'company' });

    // Add company reference to job postings
    const jobPostingsWithCompany = sampleJobPostings.map(job => ({
      ...job,
      company: company._id
    }));

    // Insert job postings
    const insertedJobs = await JobPosting.insertMany(jobPostingsWithCompany);
    console.log(`Successfully seeded ${insertedJobs.length} job postings`);

    // Display sample of inserted jobs
    console.log('\nSample job postings:');
    insertedJobs.slice(0, 3).forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.location} - ₹${job.package.min/100000}-${job.package.max/100000} LPA`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding job postings:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedJobPostings();
