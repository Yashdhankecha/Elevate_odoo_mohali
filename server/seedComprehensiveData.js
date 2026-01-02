const mongoose = require('mongoose');
const Student = require('./models/Student');
const Company = require('./models/Company');
const TPO = require('./models/TPO');
const SuperAdmin = require('./models/SuperAdmin');
const JobPosting = require('./models/JobPosting');
const JobApplication = require('./models/JobApplication');
const Interview = require('./models/Interview');
const Notification = require('./models/Notification');
const PracticeSession = require('./models/PracticeSession');
const SkillProgress = require('./models/SkillProgress');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC');
    console.log('✅ Connected to MongoDB for comprehensive data seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample TPOs data
const createTPOs = async () => {
  const tposData = [
    {
      name: 'Dr. Rajesh Kumar',
      email: 'tpo@cgc.edu.in',
      password: 'tpo123456',
      instituteName: 'Chandigarh Group of Colleges',
      contactNumber: '+91-9876543210',
      designation: 'Training & Placement Officer',
      department: 'Computer Science & Engineering',
      instituteType: 'college',
      address: {
        street: 'Landran Road',
        city: 'Mohali',
        state: 'Punjab',
        country: 'India',
        zipCode: '140307'
      },
      totalStudents: 1200,
      placedStudents: 850,
      averagePackage: 650000,
      highestPackage: 1500000,
      isVerified: true,
      status: 'active',
      placementStats: [
        {
          year: 2023,
          totalStudents: 300,
          placedStudents: 250,
          averagePackage: 600000,
          highestPackage: 1200000
        },
        {
          year: 2024,
          totalStudents: 350,
          placedStudents: 280,
          averagePackage: 650000,
          highestPackage: 1500000
        }
      ]
    },
    {
      name: 'Prof. Sunita Sharma',
      email: 'tpo@iitd.ac.in',
      password: 'tpo123456',
      instituteName: 'Indian Institute of Technology Delhi',
      contactNumber: '+91-9876543211',
      designation: 'Head of Training & Placement',
      department: 'Computer Science & Engineering',
      instituteType: 'university',
      address: {
        street: 'Hauz Khas',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        zipCode: '110016'
      },
      totalStudents: 2500,
      placedStudents: 2200,
      averagePackage: 1200000,
      highestPackage: 3500000,
      isVerified: true,
      status: 'active',
      placementStats: [
        {
          year: 2023,
          totalStudents: 600,
          placedStudents: 580,
          averagePackage: 1100000,
          highestPackage: 3000000
        },
        {
          year: 2024,
          totalStudents: 650,
          placedStudents: 620,
          averagePackage: 1200000,
          highestPackage: 3500000
        }
      ]
    }
  ];

  const createdTPOs = [];
  for (const tpoData of tposData) {
    const existingTPO = await TPO.findOne({ email: tpoData.email });
    if (!existingTPO) {
      const tpo = new TPO(tpoData);
      await tpo.save();
      createdTPOs.push(tpo);
      console.log(`✅ Created TPO: ${tpo.name} from ${tpo.instituteName}`);
    } else {
      createdTPOs.push(existingTPO);
      console.log(`⚠️  TPO already exists: ${existingTPO.name}`);
    }
  }

  return createdTPOs;
};

// Sample Companies data
const createCompanies = async () => {
  const companiesData = [
    {
      companyName: 'TechCorp Solutions',
      email: 'hr@techcorp.com',
      password: 'company123',
      contactNumber: '+91-9876543201',
      industry: 'Technology',
      companySize: 'large',
      website: 'https://techcorp.com',
      address: {
        street: 'IT Park Phase 1',
        city: 'Chandigarh',
        state: 'Punjab',
        country: 'India',
        zipCode: '160002'
      },
      description: 'Leading technology solutions provider specializing in enterprise software development and digital transformation.',
      isVerified: true,
      status: 'active'
    },
    {
      companyName: 'InnovateSoft Technologies',
      email: 'hr@innovatesoft.com',
      password: 'company123',
      contactNumber: '+91-9876543202',
      industry: 'Software Development',
      companySize: 'medium',
      website: 'https://innovatesoft.com',
      address: {
        street: 'Sector 17',
        city: 'Chandigarh',
        state: 'Punjab',
        country: 'India',
        zipCode: '160017'
      },
      description: 'Innovative software development company focused on cutting-edge technologies and modern development practices.',
      isVerified: true,
      status: 'active'
    },
    {
      companyName: 'DataFlow Analytics',
      email: 'hr@dataflow.com',
      password: 'company123',
      contactNumber: '+91-9876543203',
      industry: 'Data Analytics',
      companySize: 'startup',
      website: 'https://dataflow.com',
      address: {
        street: 'Cyber City',
        city: 'Gurgaon',
        state: 'Haryana',
        country: 'India',
        zipCode: '122002'
      },
      description: 'Data analytics startup providing AI-powered insights and machine learning solutions for businesses.',
      isVerified: true,
      status: 'active'
    },
    {
      companyName: 'CloudTech Services',
      email: 'hr@cloudtech.com',
      password: 'company123',
      contactNumber: '+91-9876543204',
      industry: 'Cloud Computing',
      companySize: 'enterprise',
      website: 'https://cloudtech.com',
      address: {
        street: 'Electronic City',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        zipCode: '560100'
      },
      description: 'Enterprise cloud computing services provider offering scalable and secure cloud infrastructure solutions.',
      isVerified: true,
      status: 'active'
    },
    {
      companyName: 'FinTech Innovations',
      email: 'hr@fintech.com',
      password: 'company123',
      contactNumber: '+91-9876543205',
      industry: 'Financial Technology',
      companySize: 'medium',
      website: 'https://fintech.com',
      address: {
        street: 'Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400051'
      },
      description: 'Financial technology company revolutionizing digital payments and banking solutions.',
      isVerified: true,
      status: 'active'
    }
  ];

  const createdCompanies = [];
  for (const companyData of companiesData) {
    const existingCompany = await Company.findOne({ email: companyData.email });
    if (!existingCompany) {
      const company = new Company(companyData);
      await company.save();
      createdCompanies.push(company);
      console.log(`✅ Created Company: ${company.companyName}`);
    } else {
      createdCompanies.push(existingCompany);
      console.log(`⚠️  Company already exists: ${existingCompany.companyName}`);
    }
  }

  return createdCompanies;
};

// Sample Students data
const createStudents = async () => {
  const studentsData = [
    {
      name: 'Amit Kumar',
      email: 'amit.kumar@student.com',
      password: 'student123',
      rollNumber: 'CS2024001',
      branch: 'Computer Science',
      graduationYear: 2025,
      collegeName: 'Chandigarh Group of Colleges',
      semester: 7,
      cgpa: 8.5,
      phoneNumber: '+91-9876543301',
      address: {
        street: 'Sector 15',
        city: 'Chandigarh',
        state: 'Punjab',
        country: 'India',
        zipCode: '160015'
      },
      skills: [
        { name: 'Java', proficiency: 'Advanced' },
        { name: 'Python', proficiency: 'Intermediate' },
        { name: 'React', proficiency: 'Advanced' },
        { name: 'Node.js', proficiency: 'Intermediate' },
        { name: 'MongoDB', proficiency: 'Intermediate' }
      ],
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          issueDate: new Date('2024-06-15'),
          certificateUrl: 'https://aws.amazon.com/certification'
        }
      ],
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce application with React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
          githubUrl: 'https://github.com/amitkumar/ecommerce',
          liveUrl: 'https://ecommerce.amitkumar.dev',
          duration: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-03-31')
          }
        }
      ],
      preferredLocations: ['Chandigarh', 'Delhi', 'Bangalore'],
      expectedPackage: { min: 600000, max: 1200000, currency: 'INR' },
      workMode: 'Hybrid',
      isVerified: true,
      verificationStatus: 'verified'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@student.com',
      password: 'student123',
      rollNumber: 'CS2024002',
      branch: 'Computer Science',
      graduationYear: 2025,
      collegeName: 'Chandigarh Group of Colleges',
      semester: 7,
      cgpa: 9.2,
      phoneNumber: '+91-9876543302',
      address: {
        street: 'Sector 22',
        city: 'Chandigarh',
        state: 'Punjab',
        country: 'India',
        zipCode: '160022'
      },
      skills: [
        { name: 'Python', proficiency: 'Expert' },
        { name: 'Machine Learning', proficiency: 'Advanced' },
        { name: 'Data Science', proficiency: 'Advanced' },
        { name: 'SQL', proficiency: 'Advanced' },
        { name: 'TensorFlow', proficiency: 'Intermediate' }
      ],
      certifications: [
        {
          name: 'Google Cloud Professional Data Engineer',
          issuer: 'Google Cloud',
          issueDate: new Date('2024-05-20'),
          certificateUrl: 'https://cloud.google.com/certification'
        }
      ],
      projects: [
        {
          title: 'AI Chatbot',
          description: 'Machine learning powered chatbot using NLP',
          technologies: ['Python', 'TensorFlow', 'NLTK', 'Flask'],
          githubUrl: 'https://github.com/priyasharma/chatbot',
          liveUrl: 'https://chatbot.priyasharma.dev',
          duration: {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-04-30')
          }
        }
      ],
      preferredLocations: ['Bangalore', 'Mumbai', 'Delhi'],
      expectedPackage: { min: 800000, max: 1500000, currency: 'INR' },
      workMode: 'Remote',
      isVerified: true,
      verificationStatus: 'verified'
    },
    {
      name: 'Rahul Singh',
      email: 'rahul.singh@student.com',
      password: 'student123',
      rollNumber: 'IT2024001',
      branch: 'Information Technology',
      graduationYear: 2025,
      collegeName: 'Chandigarh Group of Colleges',
      semester: 7,
      cgpa: 8.8,
      phoneNumber: '+91-9876543303',
      address: {
        street: 'Sector 35',
        city: 'Chandigarh',
        state: 'Punjab',
        country: 'India',
        zipCode: '160035'
      },
      skills: [
        { name: 'JavaScript', proficiency: 'Advanced' },
        { name: 'React', proficiency: 'Expert' },
        { name: 'Vue.js', proficiency: 'Advanced' },
        { name: 'CSS', proficiency: 'Expert' },
        { name: 'UI/UX Design', proficiency: 'Intermediate' }
      ],
      projects: [
        {
          title: 'Task Management App',
          description: 'Modern task management application with drag-and-drop functionality',
          technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
          githubUrl: 'https://github.com/rahulsingh/taskapp',
          liveUrl: 'https://taskapp.rahulsingh.dev',
          duration: {
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-05-31')
          }
        }
      ],
      preferredLocations: ['Chandigarh', 'Pune', 'Hyderabad'],
      expectedPackage: { min: 500000, max: 1000000, currency: 'INR' },
      workMode: 'On-site',
      isVerified: true,
      verificationStatus: 'verified'
    },
    {
      name: 'Sneha Patel',
      email: 'sneha.patel@student.com',
      password: 'student123',
      rollNumber: 'CS2024003',
      branch: 'Computer Science',
      graduationYear: 2025,
      collegeName: 'Chandigarh Group of Colleges',
      semester: 7,
      cgpa: 7.9,
      phoneNumber: '+91-9876543304',
      address: {
        street: 'Sector 45',
        city: 'Chandigarh',
        state: 'Punjab',
        country: 'India',
        zipCode: '160045'
      },
      skills: [
        { name: 'Java', proficiency: 'Advanced' },
        { name: 'Spring Boot', proficiency: 'Intermediate' },
        { name: 'MySQL', proficiency: 'Advanced' },
        { name: 'Git', proficiency: 'Advanced' },
        { name: 'Docker', proficiency: 'Beginner' }
      ],
      projects: [
        {
          title: 'Library Management System',
          description: 'Complete library management system with admin and user panels',
          technologies: ['Java', 'Spring Boot', 'MySQL', 'Thymeleaf'],
          githubUrl: 'https://github.com/snehapatel/library',
          duration: {
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-03-15')
          }
        }
      ],
      preferredLocations: ['Chandigarh', 'Delhi', 'Noida'],
      expectedPackage: { min: 400000, max: 800000, currency: 'INR' },
      workMode: 'Hybrid',
      isVerified: true,
      verificationStatus: 'verified'
    },
    {
      name: 'Vikram Joshi',
      email: 'vikram.joshi@student.com',
      password: 'student123',
      rollNumber: 'CS2024004',
      branch: 'Computer Science',
      graduationYear: 2025,
      collegeName: 'Chandigarh Group of Colleges',
      semester: 7,
      cgpa: 9.5,
      phoneNumber: '+91-9876543305',
      address: {
        street: 'Sector 8',
        city: 'Chandigarh',
        state: 'Punjab',
        country: 'India',
        zipCode: '160008'
      },
      skills: [
        { name: 'C++', proficiency: 'Expert' },
        { name: 'Data Structures', proficiency: 'Expert' },
        { name: 'Algorithms', proficiency: 'Expert' },
        { name: 'Competitive Programming', proficiency: 'Advanced' },
        { name: 'System Design', proficiency: 'Intermediate' }
      ],
      achievements: [
        {
          title: 'CodeChef 4 Star',
          description: 'Achieved 4-star rating on CodeChef platform',
          date: new Date('2024-03-15'),
          certificateUrl: 'https://codechef.com'
        }
      ],
      preferredLocations: ['Bangalore', 'Mumbai', 'Delhi'],
      expectedPackage: { min: 1000000, max: 2000000, currency: 'INR' },
      workMode: 'Any',
      isVerified: true,
      verificationStatus: 'verified'
    }
  ];

  const createdStudents = [];
  for (const studentData of studentsData) {
    const existingStudent = await Student.findOne({ email: studentData.email });
    if (!existingStudent) {
      const student = new Student(studentData);
      await student.save();
      createdStudents.push(student);
      console.log(`✅ Created Student: ${student.name} (${student.rollNumber})`);
    } else {
      createdStudents.push(existingStudent);
      console.log(`⚠️  Student already exists: ${existingStudent.name}`);
    }
  }

  return createdStudents;
};

// Sample Job Postings data
const createJobPostings = async (companies) => {
  const jobPostingsData = [
    {
      company: companies[0]._id, // TechCorp Solutions
      title: 'Software Engineer - Full Stack',
      description: 'We are looking for a talented Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
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
      package: { min: 800000, max: 1500000, currency: 'INR' },
      location: 'Chandigarh, Punjab',
      type: 'full-time',
      category: 'software-engineering',
      experience: { min: 3, max: 6 },
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
      isActive: true,
      postedAt: new Date('2024-12-01'),
      deadline: new Date('2024-12-31')
    },
    {
      company: companies[1]._id, // InnovateSoft Technologies
      title: 'Frontend Developer',
      description: 'Join our frontend team to create beautiful and responsive user interfaces. You will work with modern technologies and collaborate with designers and backend developers.',
      requirements: [
        '2+ years of frontend development experience',
        'Proficient in HTML, CSS, JavaScript',
        'Experience with React or Vue.js',
        'Knowledge of responsive design principles',
        'Familiarity with version control systems'
      ],
      responsibilities: [
        'Create responsive user interfaces',
        'Collaborate with UI/UX designers',
        'Optimize applications for maximum speed',
        'Ensure cross-browser compatibility',
        'Participate in code reviews'
      ],
      package: { min: 600000, max: 1200000, currency: 'INR' },
      location: 'Chandigarh, Punjab',
      type: 'full-time',
      category: 'software-engineering',
      experience: { min: 2, max: 4 },
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js'],
      isActive: true,
      postedAt: new Date('2024-12-05'),
      deadline: new Date('2025-01-05')
    },
    {
      company: companies[2]._id, // DataFlow Analytics
      title: 'Data Scientist',
      description: 'Join our data science team to build machine learning models and drive data-driven decisions. You will work on cutting-edge AI/ML projects.',
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
      package: { min: 1200000, max: 2000000, currency: 'INR' },
      location: 'Gurgaon, Haryana',
      type: 'full-time',
      category: 'data-science',
      experience: { min: 2, max: 5 },
      skills: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch'],
      isActive: true,
      postedAt: new Date('2024-12-10'),
      deadline: new Date('2025-01-10')
    },
    {
      company: companies[3]._id, // CloudTech Services
      title: 'DevOps Engineer',
      description: 'Help us build and maintain our cloud infrastructure. You will work on automation, monitoring, and ensuring our systems are scalable and reliable.',
      requirements: [
        '3+ years of DevOps experience',
        'Experience with AWS, Docker, Kubernetes',
        'Knowledge of CI/CD pipelines',
        'Scripting skills (Python, Bash)',
        'Experience with monitoring tools'
      ],
      responsibilities: [
        'Build and maintain cloud infrastructure',
        'Automate deployment processes',
        'Monitor system performance',
        'Ensure system security',
        'Collaborate with development teams'
      ],
      package: { min: 1000000, max: 1800000, currency: 'INR' },
      location: 'Bangalore, Karnataka',
      type: 'full-time',
      category: 'software-engineering',
      experience: { min: 3, max: 6 },
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Python'],
      isActive: true,
      postedAt: new Date('2024-12-15'),
      deadline: new Date('2025-01-15')
    },
    {
      company: companies[4]._id, // FinTech Innovations
      title: 'Backend Developer',
      description: 'Join our backend team to build scalable and secure financial applications. You will work on payment processing and banking solutions.',
      requirements: [
        '3+ years of backend development experience',
        'Proficiency in Java, Spring Boot',
        'Experience with microservices architecture',
        'Knowledge of databases (PostgreSQL, Redis)',
        'Understanding of financial systems'
      ],
      responsibilities: [
        'Develop backend services',
        'Design and implement APIs',
        'Ensure system security',
        'Optimize database performance',
        'Work with payment gateways'
      ],
      package: { min: 900000, max: 1600000, currency: 'INR' },
      location: 'Mumbai, Maharashtra',
      type: 'full-time',
      category: 'software-engineering',
      experience: { min: 3, max: 5 },
      skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Redis'],
      isActive: true,
      postedAt: new Date('2024-12-20'),
      deadline: new Date('2025-01-20')
    }
  ];

  const createdJobPostings = [];
  for (const jobData of jobPostingsData) {
    const jobPosting = new JobPosting(jobData);
    await jobPosting.save();
    createdJobPostings.push(jobPosting);
    const company = companies.find(c => c._id.equals(jobData.company));
    console.log(`✅ Created Job Posting: ${jobPosting.title} at ${company.companyName}`);
  }

  return createdJobPostings;
};

// Sample Job Applications data
const createJobApplications = async (students, jobPostings) => {
  const applicationStatuses = ['applied', 'test_scheduled', 'test_completed', 'interview_scheduled', 'interview_completed', 'offer_received', 'rejected'];
  
  const applications = [];
  
  // Create applications for each student
  for (const student of students) {
    // Each student applies to 2-3 random jobs
    const numApplications = Math.floor(Math.random() * 2) + 2;
    const selectedJobs = jobPostings.sort(() => 0.5 - Math.random()).slice(0, numApplications);
    
    for (const job of selectedJobs) {
      const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
      const appliedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      const applicationData = {
        student: student._id,
        jobPosting: job._id,
        company: job.company,
        status: status,
        appliedDate: appliedDate,
        coverLetter: `I am excited to apply for the ${job.title} position. I believe my skills and experience make me a strong candidate for this role.`,
        resume: `resume_${student.rollNumber}.pdf`,
        notes: status === 'offer_received' ? 'Excellent candidate, offered position' : 
               status === 'rejected' ? 'Thank you for your application. We have decided to move forward with other candidates.' : 
               'Application under review'
      };

      // Add test and interview data for some applications
      if (['test_scheduled', 'test_completed', 'interview_scheduled', 'interview_completed', 'offer_received'].includes(status)) {
        applicationData.testDate = new Date(appliedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        applicationData.testScore = Math.floor(Math.random() * 30) + 70; // 70-100
      }

      if (['interview_scheduled', 'interview_completed', 'offer_received'].includes(status)) {
        applicationData.interviewDate = new Date(appliedDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      }

      if (status === 'offer_received') {
        applicationData.offerDetails = {
          package: `${Math.floor(Math.random() * 5) + 8} LPA`,
          role: job.title,
          joiningDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
      }

      const application = new JobApplication(applicationData);
      await application.save();
      applications.push(application);
    }
  }

  console.log(`✅ Created ${applications.length} job applications`);
  return applications;
};

// Sample Practice Sessions data
const createPracticeSessions = async (students) => {
  const topics = [
    'Data Structures and Algorithms',
    'System Design',
    'Database Management',
    'Web Development',
    'Communication Skills',
    'Algorithm Design',
    'Machine Learning Basics',
    'Advanced Algorithms'
  ];

  const categories = [
    'data-structures',
    'system-design',
    'database',
    'web-development',
    'soft-skills',
    'algorithms',
    'machine-learning',
    'algorithms'
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  for (const student of students) {
    // Each student has 5-8 practice sessions
    const numSessions = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < numSessions; i++) {
      const topicIndex = Math.floor(Math.random() * topics.length);
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const totalQuestions = Math.floor(Math.random() * 15) + 10; // 10-25 questions
      const correctAnswers = Math.floor(totalQuestions * (0.7 + Math.random() * 0.25)); // 70-95% accuracy
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const timeSpent = Math.floor(Math.random() * 30) + 20; // 20-50 minutes

      const sessionData = {
        student: student._id,
        topic: topics[topicIndex],
        category: categories[topicIndex],
        difficulty: difficulty,
        score: score,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        timeSpent: timeSpent,
        completedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Last 60 days
      };

      const session = new PracticeSession(sessionData);
      await session.save();
    }
  }

  console.log(`✅ Created practice sessions for ${students.length} students`);
};

// Sample Skill Progress data
const createSkillProgress = async (students) => {
  const skills = [
    'Data Structures & Algorithms',
    'System Design',
    'Database Management',
    'Web Development',
    'Communication',
    'Problem Solving',
    'Leadership',
    'Teamwork',
    'Time Management',
    'Technical Writing'
  ];

  const categories = [
    'technical',
    'technical',
    'technical',
    'technical',
    'soft-skills',
    'soft-skills',
    'soft-skills',
    'soft-skills',
    'soft-skills',
    'soft-skills'
  ];

  for (const student of students) {
    // Each student has progress for 6-8 skills
    const numSkills = Math.floor(Math.random() * 3) + 6;
    const selectedSkills = skills.sort(() => 0.5 - Math.random()).slice(0, numSkills);
    
    for (const skill of selectedSkills) {
      const skillIndex = skills.indexOf(skill);
      const proficiency = Math.floor(Math.random() * 30) + 60; // 60-90%
      const targetProficiency = Math.min(proficiency + Math.floor(Math.random() * 15) + 5, 100);

      const skillData = {
        student: student._id,
        skill: skill,
        category: categories[skillIndex],
        proficiency: proficiency,
        targetProficiency: targetProficiency,
        notes: `Current level: ${proficiency}%. Target: ${targetProficiency}%. ${proficiency < 70 ? 'Needs more practice.' : 'Good progress!'}`
      };

      const skillProgress = new SkillProgress(skillData);
      await skillProgress.save();
    }
  }

  console.log(`✅ Created skill progress for ${students.length} students`);
};

// Sample Notifications data
const createNotifications = async (students, companies, tpos) => {
  const notificationTypes = [
    'application',
    'interview',
    'job',
    'system',
    'achievement',
    'reminder',
    'approval',
    'admin'
  ];

  const notifications = [];

  // Create notifications for students
  for (const student of students) {
    const numNotifications = Math.floor(Math.random() * 5) + 3; // 3-7 notifications per student
    
    for (let i = 0; i < numNotifications; i++) {
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const isRead = Math.random() > 0.3; // 70% chance of being read
      
      let title, message;
      switch (type) {
        case 'application':
          title = 'Application Submitted';
          message = 'Your job application has been successfully submitted and is under review.';
          break;
        case 'interview':
          title = 'Interview Scheduled';
          message = 'Your interview has been scheduled. Please check your email for details.';
          break;
        case 'job':
          title = 'New Job Opportunity';
          message = 'A new job posting matching your profile has been added.';
          break;
        case 'system':
          title = 'Application Status Update';
          message = 'Your application status has been updated. Please check your dashboard.';
          break;
        case 'achievement':
          title = 'Congratulations!';
          message = 'You have received a job offer. Please review the details and respond.';
          break;
        case 'reminder':
          title = 'Application Deadline Reminder';
          message = 'The deadline for your pending applications is approaching.';
          break;
        case 'approval':
          title = 'Placement Update';
          message = 'New placement opportunities are available for your batch.';
          break;
        case 'admin':
          title = 'Skill Development Reminder';
          message = 'Don\'t forget to practice your skills and take mock tests.';
          break;
      }

      const notificationData = {
        recipient: student._id,
        type: type,
        title: title,
        message: message,
        isRead: isRead,
        priority: Math.random() > 0.7 ? 'high' : 'medium'
      };

      const notification = new Notification(notificationData);
      await notification.save();
      notifications.push(notification);
    }
  }

  // Create notifications for companies
  for (const company of companies) {
    const numNotifications = Math.floor(Math.random() * 3) + 2; // 2-4 notifications per company
    
    for (let i = 0; i < numNotifications; i++) {
      const type = 'application';
      const isRead = Math.random() > 0.4; // 60% chance of being read
      
      const notificationData = {
        recipient: company._id,
        type: type,
        title: 'New Application Received',
        message: 'A new application has been received for one of your job postings.',
        isRead: isRead,
        priority: 'medium'
      };

      const notification = new Notification(notificationData);
      await notification.save();
      notifications.push(notification);
    }
  }

  console.log(`✅ Created ${notifications.length} notifications`);
  return notifications;
};

// Main seeding function
const seedComprehensiveData = async () => {
  try {
    console.log('🌱 Starting comprehensive data seeding...');
    console.log('='.repeat(60));

    // Create TPOs
    console.log('\n📚 Creating TPOs...');
    const tpos = await createTPOs();

    // Create Companies
    console.log('\n🏢 Creating Companies...');
    const companies = await createCompanies();

    // Create Students
    console.log('\n👨‍🎓 Creating Students...');
    const students = await createStudents();

    // Create Job Postings
    console.log('\n💼 Creating Job Postings...');
    const jobPostings = await createJobPostings(companies);

    // Create Job Applications
    console.log('\n📝 Creating Job Applications...');
    const applications = await createJobApplications(students, jobPostings);

    // Create Practice Sessions
    console.log('\n🎯 Creating Practice Sessions...');
    await createPracticeSessions(students);

    // Create Skill Progress
    console.log('\n📈 Creating Skill Progress...');
    await createSkillProgress(students);

    // Create Notifications
    console.log('\n🔔 Creating Notifications...');
    const notifications = await createNotifications(students, companies, tpos);

    console.log('\n' + '='.repeat(60));
    console.log('✅ COMPREHENSIVE DATA SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    
    console.log('\n📊 DATA SUMMARY:');
    console.log(`- TPOs: ${tpos.length}`);
    console.log(`- Companies: ${companies.length}`);
    console.log(`- Students: ${students.length}`);
    console.log(`- Job Postings: ${jobPostings.length}`);
    console.log(`- Job Applications: ${applications.length}`);
    console.log(`- Notifications: ${notifications.length}`);
    console.log(`- Practice Sessions: ~${students.length * 6} (estimated)`);
    console.log(`- Skill Progress Records: ~${students.length * 7} (estimated)`);

    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('\n👨‍🏫 TPOs:');
    tpos.forEach(tpo => {
      console.log(`  ${tpo.name} (${tpo.instituteName}): ${tpo.email} / tpo123456`);
    });

    console.log('\n🏢 Companies:');
    companies.forEach(company => {
      console.log(`  ${company.companyName}: ${company.email} / company123`);
    });

    console.log('\n👨‍🎓 Students:');
    students.forEach(student => {
      console.log(`  ${student.name} (${student.rollNumber}): ${student.email} / student123`);
    });

    console.log('\n🎉 Your database is now populated with comprehensive interrelated data!');
    console.log('🚀 You can now test all features of the placement tracking system.');

  } catch (error) {
    console.error('❌ Error seeding comprehensive data:', error);
  }
};

// Run the seeding
const main = async () => {
  await connectDB();
  await seedComprehensiveData();
  
  // Close database connection
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  process.exit(0);
};

main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
