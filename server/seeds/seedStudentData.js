const mongoose = require('mongoose');
const User = require('../models/User');
const JobApplication = require('../models/JobApplication');
const JobPosting = require('../models/JobPosting');
const PracticeSession = require('../models/PracticeSession');
const SkillProgress = require('../models/SkillProgress');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB for seeding student data');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create sample companies and job postings
const createSampleCompanies = async () => {
  const companies = [
    {
      email: 'hr@google.com',
      password: 'password123',
      role: 'company',
      isVerified: true,
      company: {
        companyName: 'Google',
        contactNumber: '+1-650-253-0000',
        industry: 'Technology',
        companySize: 'enterprise',
        website: 'https://google.com',
        address: {
          street: '1600 Amphitheatre Parkway',
          city: 'Mountain View',
          state: 'CA',
          country: 'USA',
          zipCode: '94043'
        },
        description: 'Google is a multinational technology company specializing in Internet-related services and products.'
      }
    },
    {
      email: 'hr@microsoft.com',
      password: 'password123',
      role: 'company',
      isVerified: true,
      company: {
        companyName: 'Microsoft',
        contactNumber: '+1-425-882-8080',
        industry: 'Technology',
        companySize: 'enterprise',
        website: 'https://microsoft.com',
        address: {
          street: 'One Microsoft Way',
          city: 'Redmond',
          state: 'WA',
          country: 'USA',
          zipCode: '98052'
        },
        description: 'Microsoft is a multinational technology company that develops, manufactures, licenses, supports, and sells computer software.'
      }
    },
    {
      email: 'hr@amazon.com',
      password: 'password123',
      role: 'company',
      isVerified: true,
      company: {
        companyName: 'Amazon',
        contactNumber: '+1-206-266-1000',
        industry: 'E-commerce',
        companySize: 'enterprise',
        website: 'https://amazon.com',
        address: {
          street: '410 Terry Avenue North',
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          zipCode: '98109'
        },
        description: 'Amazon is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.'
      }
    }
  ];

  const createdCompanies = [];
  for (const companyData of companies) {
    const existingCompany = await User.findOne({ email: companyData.email });
    if (!existingCompany) {
      const company = new User(companyData);
      await company.save();
      createdCompanies.push(company);
      console.log(`✅ Created company: ${company.company.companyName}`);
    } else {
      createdCompanies.push(existingCompany);
      console.log(`⚠️  Company already exists: ${existingCompany.company.companyName}`);
    }
  }

  return createdCompanies;
};

// Create sample job postings
const createSampleJobPostings = async (companies) => {
  const jobPostings = [
    {
      company: companies[0]._id, // Google
      title: 'Software Engineer Intern',
      description: 'Join Google as a Software Engineer Intern and work on cutting-edge technology projects.',
      requirements: ['Strong programming skills', 'Knowledge of data structures and algorithms', 'Currently pursuing Computer Science degree'],
      responsibilities: ['Develop software solutions', 'Collaborate with team members', 'Participate in code reviews'],
      package: { min: 800000, max: 1200000, currency: 'INR' },
      location: 'Bangalore, India',
      type: 'internship',
      category: 'software-engineering',
      experience: { min: 0, max: 2 },
      skills: ['Java', 'Python', 'JavaScript', 'Data Structures', 'Algorithms']
    },
    {
      company: companies[1]._id, // Microsoft
      title: 'Product Manager Intern',
      description: 'Work on exciting product management projects at Microsoft.',
      requirements: ['Strong analytical skills', 'Excellent communication', 'Currently pursuing MBA or related degree'],
      responsibilities: ['Define product requirements', 'Work with development teams', 'Analyze market trends'],
      package: { min: 1000000, max: 1500000, currency: 'INR' },
      location: 'Hyderabad, India',
      type: 'internship',
      category: 'product-management',
      experience: { min: 0, max: 2 },
      skills: ['Product Management', 'Analytics', 'Communication', 'Leadership']
    },
    {
      company: companies[2]._id, // Amazon
      title: 'Data Scientist Intern',
      description: 'Join Amazon\'s data science team and work on machine learning projects.',
      requirements: ['Strong mathematical background', 'Experience with ML algorithms', 'Currently pursuing Computer Science or Statistics degree'],
      responsibilities: ['Develop ML models', 'Analyze large datasets', 'Present findings to stakeholders'],
      package: { min: 900000, max: 1300000, currency: 'INR' },
      location: 'Mumbai, India',
      type: 'internship',
      category: 'data-science',
      experience: { min: 0, max: 2 },
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'R']
    }
  ];

  const createdJobPostings = [];
  for (const jobData of jobPostings) {
    const jobPosting = new JobPosting(jobData);
    await jobPosting.save();
    createdJobPostings.push(jobPosting);
    console.log(`✅ Created job posting: ${jobPosting.title} at ${companies.find(c => c._id.equals(jobPosting.company))?.company.companyName}`);
  }

  return createdJobPostings;
};

// Create sample student
const createSampleStudent = async () => {
  const studentData = {
    email: 'alex.johnson@student.com',
    password: 'password123',
    role: 'student',
    isVerified: true,
    student: {
      name: 'Alex Johnson',
      rollNumber: 'CS2024001',
      branch: 'Computer Science',
      graduationYear: 2025,
      collegeName: 'Tech University',
      cgpa: 8.5,
      skills: ['Java', 'Python', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
      profileCompletion: 85,
      totalApplications: 12,
      totalPracticeSessions: 47,
      averageTestScore: 92,
      interviewsScheduled: 3,
      offersReceived: 2,
      personalInfo: {
        phone: '+91-9876543210',
        address: {
          street: '123 Tech Street',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560001'
        },
        linkedin: 'https://linkedin.com/in/alexjohnson',
        github: 'https://github.com/alexjohnson',
        portfolio: 'https://alexjohnson.dev'
      },
      education: {
        degree: 'Bachelor of Technology',
        specialization: 'Computer Science and Engineering',
        currentSemester: 7,
        totalSemesters: 8
      },
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'A full-stack e-commerce platform built with React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
          githubLink: 'https://github.com/alexjohnson/ecommerce',
          liveLink: 'https://ecommerce.alexjohnson.dev',
          duration: '3 months',
          role: 'Full Stack Developer'
        },
        {
          title: 'Machine Learning Chatbot',
          description: 'An AI-powered chatbot using natural language processing',
          technologies: ['Python', 'TensorFlow', 'NLTK', 'Flask'],
          githubLink: 'https://github.com/alexjohnson/chatbot',
          liveLink: 'https://chatbot.alexjohnson.dev',
          duration: '2 months',
          role: 'ML Engineer'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          date: new Date('2024-06-15'),
          credentialId: 'AWS-DEV-123456',
          link: 'https://aws.amazon.com/certification'
        },
        {
          name: 'Google Cloud Professional Developer',
          issuer: 'Google Cloud',
          date: new Date('2024-05-20'),
          credentialId: 'GCP-DEV-789012',
          link: 'https://cloud.google.com/certification'
        }
      ],
      achievements: [
        {
          title: 'Hackathon Winner',
          description: 'Won first place in Tech University Hackathon 2024',
          date: new Date('2024-03-15'),
          category: 'Competition'
        },
        {
          title: 'Dean\'s List',
          description: 'Achieved Dean\'s List for academic excellence',
          date: new Date('2024-01-10'),
          category: 'Academic'
        }
      ],
      preferences: {
        preferredLocations: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'],
        preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Developer'],
        expectedSalary: { min: 800000, max: 1500000 },
        workType: 'full-time'
      }
    }
  };

  const existingStudent = await User.findOne({ email: studentData.email });
  if (!existingStudent) {
    const student = new User(studentData);
    await student.save();
    console.log(`✅ Created student: ${student.student.name}`);
    return student;
  } else {
    console.log(`⚠️  Student already exists: ${existingStudent.student.name}`);
    return existingStudent;
  }
};

// Create sample job applications
const createSampleApplications = async (student, jobPostings) => {
  const applications = [
    {
      student: student._id,
      jobPosting: jobPostings[0]._id, // Google
      company: jobPostings[0].company,
      status: 'interview_scheduled',
      appliedDate: new Date('2024-12-10'),
      testDate: new Date('2024-12-15'),
      testScore: 95,
      interviewDate: new Date('2024-12-20'),
      notes: 'Strong candidate, excellent technical skills'
    },
    {
      student: student._id,
      jobPosting: jobPostings[1]._id, // Microsoft
      company: jobPostings[1].company,
      status: 'test_completed',
      appliedDate: new Date('2024-12-08'),
      testDate: new Date('2024-12-12'),
      testScore: 88,
      notes: 'Good performance in technical round'
    },
    {
      student: student._id,
      jobPosting: jobPostings[2]._id, // Amazon
      company: jobPostings[2].company,
      status: 'offer_received',
      appliedDate: new Date('2024-12-05'),
      testDate: new Date('2024-12-10'),
      testScore: 92,
      interviewDate: new Date('2024-12-15'),
      offerDetails: {
        package: '₹12 LPA',
        role: 'Data Scientist Intern',
        joiningDate: new Date('2024-06-01')
      },
      notes: 'Excellent candidate, offered position'
    }
  ];

  for (const appData of applications) {
    const application = new JobApplication(appData);
    await application.save();
    console.log(`✅ Created application for ${jobPostings.find(j => j._id.equals(appData.jobPosting))?.title}`);
  }
};

// Create sample practice sessions
const createSamplePracticeSessions = async (student) => {
  const sessions = [
    {
      student: student._id,
      topic: 'Data Structures and Algorithms',
      category: 'data-structures',
      difficulty: 'medium',
      score: 95,
      totalQuestions: 20,
      correctAnswers: 19,
      timeSpent: 45,
      completedAt: new Date('2024-12-15')
    },
    {
      student: student._id,
      topic: 'System Design',
      category: 'system-design',
      difficulty: 'hard',
      score: 88,
      totalQuestions: 15,
      correctAnswers: 13,
      timeSpent: 60,
      completedAt: new Date('2024-12-14')
    },
    {
      student: student._id,
      topic: 'Database Management',
      category: 'database',
      difficulty: 'medium',
      score: 92,
      totalQuestions: 18,
      correctAnswers: 17,
      timeSpent: 35,
      completedAt: new Date('2024-12-13')
    },
    {
      student: student._id,
      topic: 'Web Development',
      category: 'web-development',
      difficulty: 'easy',
      score: 98,
      totalQuestions: 25,
      correctAnswers: 24,
      timeSpent: 30,
      completedAt: new Date('2024-12-12')
    },
    {
      student: student._id,
      topic: 'Communication Skills',
      category: 'soft-skills',
      difficulty: 'medium',
      score: 85,
      totalQuestions: 12,
      correctAnswers: 10,
      timeSpent: 20,
      completedAt: new Date('2024-12-11')
    }
  ];

  for (const sessionData of sessions) {
    const session = new PracticeSession(sessionData);
    await session.save();
    console.log(`✅ Created practice session: ${session.topic} with ${session.score}% score`);
  }
};

// Create sample skill progress
const createSampleSkillProgress = async (student) => {
  const skills = [
    {
      student: student._id,
      skill: 'Data Structures & Algorithms',
      category: 'technical',
      proficiency: 85,
      targetProficiency: 90,
      notes: 'Strong foundation, need more practice with advanced algorithms'
    },
    {
      student: student._id,
      skill: 'System Design',
      category: 'technical',
      proficiency: 72,
      targetProficiency: 85,
      notes: 'Good understanding of basic concepts, need more real-world practice'
    },
    {
      student: student._id,
      skill: 'Database Management',
      category: 'technical',
      proficiency: 78,
      targetProficiency: 85,
      notes: 'Solid SQL skills, learning NoSQL databases'
    },
    {
      student: student._id,
      skill: 'Web Development',
      category: 'technical',
      proficiency: 91,
      targetProficiency: 95,
      notes: 'Excellent frontend and backend skills'
    },
    {
      student: student._id,
      skill: 'Communication',
      category: 'soft-skills',
      proficiency: 88,
      targetProficiency: 90,
      notes: 'Good verbal communication, improving written skills'
    },
    {
      student: student._id,
      skill: 'Problem Solving',
      category: 'soft-skills',
      proficiency: 93,
      targetProficiency: 95,
      notes: 'Excellent analytical and problem-solving abilities'
    },
    {
      student: student._id,
      skill: 'Leadership',
      category: 'soft-skills',
      proficiency: 76,
      targetProficiency: 85,
      notes: 'Good team player, developing leadership skills'
    },
    {
      student: student._id,
      skill: 'Teamwork',
      category: 'soft-skills',
      proficiency: 85,
      targetProficiency: 90,
      notes: 'Collaborates well with team members'
    }
  ];

  for (const skillData of skills) {
    const skill = new SkillProgress(skillData);
    await skill.save();
    console.log(`✅ Created skill progress: ${skill.skill} - ${skill.proficiency}%`);
  }
};

// Main seeding function
const seedStudentData = async () => {
  try {
    console.log('🌱 Starting student data seeding...');

    // Create companies
    const companies = await createSampleCompanies();
    
    // Create job postings
    const jobPostings = await createSampleJobPostings(companies);
    
    // Create student
    const student = await createSampleStudent();
    
    // Create applications
    await createSampleApplications(student, jobPostings);
    
    // Create practice sessions
    await createSamplePracticeSessions(student);
    
    // Create skill progress
    await createSampleSkillProgress(student);

    console.log('✅ Student data seeding completed successfully!');
    console.log('\n📊 Sample Data Summary:');
    console.log(`- Companies: ${companies.length}`);
    console.log(`- Job Postings: ${jobPostings.length}`);
    console.log(`- Student: ${student.student.name}`);
    console.log(`- Applications: 3`);
    console.log(`- Practice Sessions: 5`);
    console.log(`- Skills: 8`);

  } catch (error) {
    console.error('❌ Error seeding student data:', error);
  }
};

// Run the seeding
const main = async () => {
  await connectDB();
  await seedStudentData();
  
  // Close database connection
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
};

main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
