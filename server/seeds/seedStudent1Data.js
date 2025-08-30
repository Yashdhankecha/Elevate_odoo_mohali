const mongoose = require('mongoose');
const User = require('../models/User');
const JobApplication = require('../models/JobApplication');
const JobPosting = require('../models/JobPosting');
const PracticeSession = require('../models/PracticeSession');
const SkillProgress = require('../models/SkillProgress');
const Notification = require('../models/Notification');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB for seeding student1 data');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create sample companies
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
        description: 'Amazon is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.'
      }
    },
    {
      email: 'hr@netflix.com',
      password: 'password123',
      role: 'company',
      isVerified: true,
      company: {
        companyName: 'Netflix',
        contactNumber: '+1-408-540-3700',
        industry: 'Entertainment',
        companySize: 'enterprise',
        website: 'https://netflix.com',
        description: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more.'
      }
    },
    {
      email: 'hr@meta.com',
      password: 'password123',
      role: 'company',
      isVerified: true,
      company: {
        companyName: 'Meta',
        contactNumber: '+1-650-543-4800',
        industry: 'Technology',
        companySize: 'enterprise',
        website: 'https://meta.com',
        description: 'Meta builds technologies that help people connect, find communities, and grow businesses.'
      }
    },
    {
      email: 'hr@apple.com',
      password: 'password123',
      role: 'company',
      isVerified: true,
      company: {
        companyName: 'Apple',
        contactNumber: '+1-408-996-1010',
        industry: 'Technology',
        companySize: 'enterprise',
        website: 'https://apple.com',
        description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
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
      company: companies[0]._id,
      title: 'Software Engineer Intern',
      description: 'Join Google as a Software Engineer Intern and work on cutting-edge technology projects.',
      requirements: ['Strong programming skills', 'Knowledge of data structures and algorithms'],
      responsibilities: ['Develop software solutions', 'Collaborate with team members'],
      package: { min: 800000, max: 1200000, currency: 'INR' },
      location: 'Bangalore, India',
      type: 'internship',
      category: 'software-engineering',
      experience: { min: 0, max: 2 },
      skills: ['Java', 'Python', 'JavaScript', 'Data Structures', 'Algorithms']
    },
    {
      company: companies[1]._id,
      title: 'Product Manager Intern',
      description: 'Work on exciting product management projects at Microsoft.',
      requirements: ['Strong analytical skills', 'Excellent communication'],
      responsibilities: ['Define product requirements', 'Work with development teams'],
      package: { min: 1000000, max: 1500000, currency: 'INR' },
      location: 'Hyderabad, India',
      type: 'internship',
      category: 'product-management',
      experience: { min: 0, max: 2 },
      skills: ['Product Management', 'Analytics', 'Communication', 'Leadership']
    },
    {
      company: companies[2]._id,
      title: 'Data Scientist Intern',
      description: 'Join Amazon\'s data science team and work on machine learning projects.',
      requirements: ['Strong mathematical background', 'Experience with ML algorithms'],
      responsibilities: ['Develop ML models', 'Analyze large datasets'],
      package: { min: 900000, max: 1300000, currency: 'INR' },
      location: 'Mumbai, India',
      type: 'internship',
      category: 'data-science',
      experience: { min: 0, max: 2 },
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'R']
    },
    {
      company: companies[3]._id,
      title: 'Frontend Developer Intern',
      description: 'Build amazing user experiences for Netflix\'s global audience.',
      requirements: ['Strong JavaScript skills', 'Experience with React/Vue/Angular'],
      responsibilities: ['Build user interfaces', 'Optimize performance'],
      package: { min: 700000, max: 1100000, currency: 'INR' },
      location: 'Remote',
      type: 'internship',
      category: 'software-engineering',
      experience: { min: 0, max: 2 },
      skills: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript']
    },
    {
      company: companies[4]._id,
      title: 'Machine Learning Engineer Intern',
      description: 'Work on AI/ML projects that impact billions of users worldwide.',
      requirements: ['Strong ML fundamentals', 'Experience with PyTorch/TensorFlow'],
      responsibilities: ['Develop ML models', 'Optimize algorithms'],
      package: { min: 950000, max: 1400000, currency: 'INR' },
      location: 'Bangalore, India',
      type: 'internship',
      category: 'data-science',
      experience: { min: 0, max: 2 },
      skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow']
    },
    {
      company: companies[5]._id,
      title: 'iOS Developer Intern',
      description: 'Create amazing iOS applications for Apple\'s ecosystem.',
      requirements: ['Swift programming skills', 'Understanding of iOS development'],
      responsibilities: ['Develop iOS applications', 'Work with Apple frameworks'],
      package: { min: 850000, max: 1250000, currency: 'INR' },
      location: 'Bangalore, India',
      type: 'internship',
      category: 'software-engineering',
      experience: { min: 0, max: 2 },
      skills: ['Swift', 'iOS Development', 'Xcode', 'UIKit', 'SwiftUI']
    }
  ];

  const createdJobPostings = [];
  for (const jobData of jobPostings) {
    const jobPosting = new JobPosting(jobData);
    await jobPosting.save();
    createdJobPostings.push(jobPosting);
    console.log(`✅ Created job posting: ${jobPosting.title}`);
  }

  return createdJobPostings;
};

// Create comprehensive student profile
const createStudent1 = async () => {
  const studentData = {
    email: 'student1@college.edu',
    password: 'password123',
    role: 'student',
    isVerified: true,
    status: 'active',
    student: {
      name: 'Rahul Sharma',
      rollNumber: 'CS2024001',
      branch: 'Computer Science',
      graduationYear: 2025,
      collegeName: 'Delhi Technical University',
      cgpa: 8.7,
      skills: ['Java', 'Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning'],
      profileCompletion: 92,
      totalApplications: 15,
      totalPracticeSessions: 67,
      averageTestScore: 89,
      interviewsScheduled: 5,
      offersReceived: 3,
      personalInfo: {
        phone: '+91-9876543210',
        address: {
          street: '123 Tech Street, Dwarka',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          zipCode: '110075'
        },
        linkedin: 'https://linkedin.com/in/rahulsharma',
        github: 'https://github.com/rahulsharma',
        portfolio: 'https://rahulsharma.dev'
      },
      education: {
        degree: 'Bachelor of Technology',
        specialization: 'Computer Science and Engineering',
        currentSemester: 7,
        totalSemesters: 8
      },
      projects: [
        {
          title: 'AI-Powered Resume Parser',
          description: 'An intelligent resume parsing system that uses NLP to extract and categorize information from resumes',
          technologies: ['Python', 'NLTK', 'spaCy', 'Flask', 'React', 'MongoDB'],
          githubLink: 'https://github.com/rahulsharma/resume-parser',
          liveLink: 'https://resume-parser.rahulsharma.dev',
          duration: '4 months',
          role: 'Full Stack Developer & ML Engineer'
        },
        {
          title: 'E-commerce Platform with ML Recommendations',
          description: 'A full-stack e-commerce platform with personalized product recommendations using collaborative filtering',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'scikit-learn'],
          githubLink: 'https://github.com/rahulsharma/ecommerce-ml',
          liveLink: 'https://ecommerce.rahulsharma.dev',
          duration: '6 months',
          role: 'Full Stack Developer'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: new Date('2024-08-15'),
          credentialId: 'AWS-SAA-123456',
          link: 'https://aws.amazon.com/certification'
        },
        {
          name: 'Google Cloud Professional Developer',
          issuer: 'Google Cloud',
          date: new Date('2024-07-20'),
          credentialId: 'GCP-DEV-789012',
          link: 'https://cloud.google.com/certification'
        }
      ],
      achievements: [
        {
          title: 'Hackathon Winner - TechCrunch Disrupt 2024',
          description: 'Won first place in the prestigious TechCrunch Disrupt hackathon with AI-powered resume parser',
          date: new Date('2024-09-15'),
          category: 'Competition'
        },
        {
          title: 'Dean\'s List - Academic Excellence',
          description: 'Achieved Dean\'s List for maintaining CGPA above 8.5 for three consecutive semesters',
          date: new Date('2024-01-10'),
          category: 'Academic'
        }
      ],
      preferences: {
        preferredLocations: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'],
        preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Machine Learning Engineer', 'DevOps Engineer', 'Backend Developer'],
        expectedSalary: { min: 1000000, max: 2000000 },
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

// Create comprehensive job applications
const createJobApplications = async (student, jobPostings) => {
  const applications = [
    {
      student: student._id,
      jobPosting: jobPostings[0]._id,
      company: jobPostings[0].company,
      status: 'offer_received',
      appliedDate: new Date('2024-12-01'),
      testDate: new Date('2024-12-05'),
      testScore: 95,
      interviewDate: new Date('2024-12-10'),
      interviewFeedback: 'Excellent technical skills and problem-solving abilities. Strong communication skills.',
      offerDetails: {
        package: '₹12 LPA',
        role: 'Software Engineer Intern',
        joiningDate: new Date('2024-06-01')
      },
      notes: 'Outstanding candidate with strong technical background. Offered full-time position after internship.',
      timeline: [
        { action: 'Applied', date: new Date('2024-12-01'), description: 'Application submitted successfully' },
        { action: 'Test Completed', date: new Date('2024-12-05'), description: 'Scored 95% in technical assessment' },
        { action: 'Interview Completed', date: new Date('2024-12-10'), description: 'Interview completed successfully' },
        { action: 'Offer Received', date: new Date('2024-12-12'), description: 'Offer letter received' }
      ]
    },
    {
      student: student._id,
      jobPosting: jobPostings[1]._id,
      company: jobPostings[1].company,
      status: 'interview_scheduled',
      appliedDate: new Date('2024-12-02'),
      testDate: new Date('2024-12-06'),
      testScore: 88,
      interviewDate: new Date('2024-12-15'),
      interviewFeedback: 'Good analytical skills and product thinking. Needs improvement in system design.',
      notes: 'Strong candidate for product role. Interview scheduled for final round.',
      timeline: [
        { action: 'Applied', date: new Date('2024-12-02'), description: 'Application submitted successfully' },
        { action: 'Test Completed', date: new Date('2024-12-06'), description: 'Scored 88% in case study' },
        { action: 'Interview Scheduled', date: new Date('2024-12-13'), description: 'Final interview scheduled' }
      ]
    },
    {
      student: student._id,
      jobPosting: jobPostings[2]._id,
      company: jobPostings[2].company,
      status: 'offer_received',
      appliedDate: new Date('2024-11-28'),
      testDate: new Date('2024-12-02'),
      testScore: 92,
      interviewDate: new Date('2024-12-08'),
      interviewFeedback: 'Excellent ML knowledge and practical experience. Strong mathematical foundation.',
      offerDetails: {
        package: '₹14 LPA',
        role: 'Data Scientist Intern',
        joiningDate: new Date('2024-05-15')
      },
      notes: 'Perfect fit for data science role. Offered position with competitive package.',
      timeline: [
        { action: 'Applied', date: new Date('2024-11-28'), description: 'Application submitted successfully' },
        { action: 'Test Completed', date: new Date('2024-12-02'), description: 'Scored 92% in ML assessment' },
        { action: 'Interview Completed', date: new Date('2024-12-08'), description: 'Interview completed successfully' },
        { action: 'Offer Received', date: new Date('2024-12-10'), description: 'Offer letter received' }
      ]
    },
    {
      student: student._id,
      jobPosting: jobPostings[3]._id,
      company: jobPostings[3].company,
      status: 'test_completed',
      appliedDate: new Date('2024-12-03'),
      testDate: new Date('2024-12-07'),
      testScore: 85,
      notes: 'Good frontend skills. Awaiting interview call.',
      timeline: [
        { action: 'Applied', date: new Date('2024-12-03'), description: 'Application submitted successfully' },
        { action: 'Test Completed', date: new Date('2024-12-07'), description: 'Scored 85% in frontend assessment' }
      ]
    },
    {
      student: student._id,
      jobPosting: jobPostings[4]._id,
      company: jobPostings[4].company,
      status: 'rejected',
      appliedDate: new Date('2024-11-25'),
      testDate: new Date('2024-11-29'),
      testScore: 78,
      interviewDate: new Date('2024-12-05'),
      interviewFeedback: 'Good ML fundamentals but lacks depth in advanced topics. Consider applying again next year.',
      notes: 'Rejected due to insufficient depth in advanced ML concepts.',
      timeline: [
        { action: 'Applied', date: new Date('2024-11-25'), description: 'Application submitted successfully' },
        { action: 'Test Completed', date: new Date('2024-11-29'), description: 'Scored 78% in ML assessment' },
        { action: 'Interview Completed', date: new Date('2024-12-05'), description: 'Interview completed' },
        { action: 'Rejected', date: new Date('2024-12-07'), description: 'Application rejected' }
      ]
    },
    {
      student: student._id,
      jobPosting: jobPostings[5]._id,
      company: jobPostings[5].company,
      status: 'withdrawn',
      appliedDate: new Date('2024-11-20'),
      testDate: new Date('2024-11-24'),
      testScore: 90,
      notes: 'Withdrawn application due to accepting Google offer.',
      timeline: [
        { action: 'Applied', date: new Date('2024-11-20'), description: 'Application submitted successfully' },
        { action: 'Test Completed', date: new Date('2024-11-24'), description: 'Scored 90% in iOS assessment' },
        { action: 'Withdrawn', date: new Date('2024-12-13'), description: 'Application withdrawn' }
      ]
    }
  ];

  for (const appData of applications) {
    const application = new JobApplication(appData);
    await application.save();
    console.log(`✅ Created application for ${jobPostings.find(j => j._id.equals(appData.jobPosting))?.title}`);
  }
};

// Create comprehensive practice sessions
const createPracticeSessions = async (student) => {
  const sessions = [
    {
      student: student._id,
      topic: 'Data Structures and Algorithms',
      category: 'data-structures',
      difficulty: 'hard',
      score: 95,
      totalQuestions: 25,
      correctAnswers: 24,
      timeSpent: 60,
      completedAt: new Date('2024-12-15'),
      feedback: {
        strengths: ['Excellent problem-solving skills', 'Strong understanding of algorithms'],
        weaknesses: ['Could improve on dynamic programming'],
        recommendations: ['Practice more DP problems', 'Focus on graph algorithms']
      }
    },
    {
      student: student._id,
      topic: 'System Design',
      category: 'system-design',
      difficulty: 'hard',
      score: 88,
      totalQuestions: 20,
      correctAnswers: 18,
      timeSpent: 75,
      completedAt: new Date('2024-12-14'),
      feedback: {
        strengths: ['Good understanding of scalability concepts', 'Strong knowledge of databases'],
        weaknesses: ['Needs improvement in microservices design'],
        recommendations: ['Study microservices architecture', 'Practice distributed systems']
      }
    },
    {
      student: student._id,
      topic: 'Machine Learning',
      category: 'machine-learning',
      difficulty: 'medium',
      score: 92,
      totalQuestions: 30,
      correctAnswers: 28,
      timeSpent: 45,
      completedAt: new Date('2024-12-13'),
      feedback: {
        strengths: ['Excellent understanding of ML algorithms', 'Strong mathematical foundation'],
        weaknesses: ['Could improve on deep learning concepts'],
        recommendations: ['Study neural networks', 'Practice with TensorFlow/PyTorch']
      }
    },
    {
      student: student._id,
      topic: 'Database Management',
      category: 'database',
      difficulty: 'medium',
      score: 89,
      totalQuestions: 22,
      correctAnswers: 20,
      timeSpent: 40,
      completedAt: new Date('2024-12-12'),
      feedback: {
        strengths: ['Strong SQL skills', 'Good understanding of normalization'],
        weaknesses: ['Needs improvement in NoSQL databases'],
        recommendations: ['Learn MongoDB', 'Study distributed databases']
      }
    },
    {
      student: student._id,
      topic: 'Web Development',
      category: 'web-development',
      difficulty: 'easy',
      score: 98,
      totalQuestions: 28,
      correctAnswers: 27,
      timeSpent: 35,
      completedAt: new Date('2024-12-11'),
      feedback: {
        strengths: ['Excellent frontend and backend skills', 'Strong understanding of modern frameworks'],
        weaknesses: ['Could improve on performance optimization'],
        recommendations: ['Study web performance', 'Learn advanced React patterns']
      }
    },
    {
      student: student._id,
      topic: 'Communication Skills',
      category: 'soft-skills',
      difficulty: 'medium',
      score: 85,
      totalQuestions: 15,
      correctAnswers: 13,
      timeSpent: 25,
      completedAt: new Date('2024-12-10'),
      feedback: {
        strengths: ['Good verbal communication', 'Clear presentation skills'],
        weaknesses: ['Needs improvement in written communication'],
        recommendations: ['Practice technical writing', 'Join public speaking clubs']
      }
    },
    {
      student: student._id,
      topic: 'Problem Solving',
      category: 'soft-skills',
      difficulty: 'hard',
      score: 91,
      totalQuestions: 18,
      correctAnswers: 17,
      timeSpent: 50,
      completedAt: new Date('2024-12-09'),
      feedback: {
        strengths: ['Excellent analytical thinking', 'Strong logical reasoning'],
        weaknesses: ['Could improve on creative problem solving'],
        recommendations: ['Practice brainstorming techniques', 'Study design thinking']
      }
    },
    {
      student: student._id,
      topic: 'Leadership',
      category: 'soft-skills',
      difficulty: 'medium',
      score: 82,
      totalQuestions: 12,
      correctAnswers: 10,
      timeSpent: 20,
      completedAt: new Date('2024-12-08'),
      feedback: {
        strengths: ['Good team player', 'Shows initiative'],
        weaknesses: ['Needs improvement in conflict resolution'],
        recommendations: ['Take leadership roles in projects', 'Study conflict management']
      }
    }
  ];

  for (const sessionData of sessions) {
    const session = new PracticeSession(sessionData);
    await session.save();
    console.log(`✅ Created practice session: ${session.topic} with ${session.score}% score`);
  }
};

// Create comprehensive skill progress
const createSkillProgress = async (student) => {
  const skills = [
    {
      student: student._id,
      skill: 'Data Structures & Algorithms',
      category: 'technical',
      proficiency: 92,
      targetProficiency: 95,
      notes: 'Excellent foundation in DSA. Need more practice with advanced algorithms like dynamic programming and graph algorithms.'
    },
    {
      student: student._id,
      skill: 'System Design',
      category: 'technical',
      proficiency: 85,
      targetProficiency: 90,
      notes: 'Good understanding of basic concepts. Need more practice with distributed systems and microservices.'
    },
    {
      student: student._id,
      skill: 'Machine Learning',
      category: 'technical',
      proficiency: 89,
      targetProficiency: 95,
      notes: 'Strong ML fundamentals. Need more practice with deep learning and advanced ML concepts.'
    },
    {
      student: student._id,
      skill: 'Database Management',
      category: 'technical',
      proficiency: 87,
      targetProficiency: 90,
      notes: 'Excellent SQL skills. Learning NoSQL databases and distributed databases.'
    },
    {
      student: student._id,
      skill: 'Web Development',
      category: 'technical',
      proficiency: 94,
      targetProficiency: 95,
      notes: 'Excellent frontend and backend skills. Strong understanding of modern frameworks and tools.'
    },
    {
      student: student._id,
      skill: 'Communication',
      category: 'soft-skills',
      proficiency: 88,
      targetProficiency: 90,
      notes: 'Good verbal communication skills. Improving written communication and presentation skills.'
    },
    {
      student: student._id,
      skill: 'Problem Solving',
      category: 'soft-skills',
      proficiency: 93,
      targetProficiency: 95,
      notes: 'Excellent analytical and problem-solving abilities. Strong logical reasoning skills.'
    },
    {
      student: student._id,
      skill: 'Leadership',
      category: 'soft-skills',
      proficiency: 82,
      targetProficiency: 85,
      notes: 'Good team player with leadership potential. Developing conflict resolution and team management skills.'
    },
    {
      student: student._id,
      skill: 'Teamwork',
      category: 'soft-skills',
      proficiency: 90,
      targetProficiency: 92,
      notes: 'Excellent collaboration skills. Works well in diverse teams and contributes effectively.'
    },
    {
      student: student._id,
      skill: 'Time Management',
      category: 'soft-skills',
      proficiency: 86,
      targetProficiency: 90,
      notes: 'Good time management skills. Balancing academics, projects, and job applications effectively.'
    }
  ];

  for (const skillData of skills) {
    const skill = new SkillProgress(skillData);
    await skill.save();
    console.log(`✅ Created skill progress: ${skill.skill} - ${skill.proficiency}%`);
  }
};

// Create comprehensive notifications
const createNotifications = async (student) => {
  const notifications = [
    {
      recipient: student._id,
      title: 'Congratulations! Offer Received from Google',
      message: 'You have received an offer from Google for the Software Engineer Intern position. Please review the offer details.',
      type: 'application',
      priority: 'high',
      isRead: false,
      actionLink: '/applications',
      actionText: 'View Offer'
    },
    {
      recipient: student._id,
      title: 'Interview Scheduled with Microsoft',
      message: 'Your interview with Microsoft for Product Manager Intern has been scheduled for December 15, 2024.',
      type: 'interview',
      priority: 'high',
      isRead: false,
      actionLink: '/applications',
      actionText: 'View Details'
    },
    {
      recipient: student._id,
      title: 'Practice Session Reminder',
      message: 'You haven\'t completed a practice session in 3 days. Keep up with your learning goals!',
      type: 'reminder',
      priority: 'medium',
      isRead: false,
      actionLink: '/practice-hub',
      actionText: 'Start Practice'
    },
    {
      recipient: student._id,
      title: 'Skill Progress Update',
      message: 'Your Web Development skill has improved by 2%! Great job on your recent practice sessions.',
      type: 'achievement',
      priority: 'low',
      isRead: false,
      actionLink: '/skill-tracker',
      actionText: 'View Progress'
    },
    {
      recipient: student._id,
      title: 'Profile Completion Reminder',
      message: 'Your profile is 92% complete. Add missing information to increase your chances of getting hired.',
      type: 'reminder',
      priority: 'medium',
      isRead: false,
      actionLink: '/profile',
      actionText: 'Complete Profile'
    },
    {
      recipient: student._id,
      title: 'Test Result: Amazon Data Scientist',
      message: 'You scored 92% in the Amazon Data Scientist assessment. Excellent performance!',
      type: 'application',
      priority: 'medium',
      isRead: true,
      actionLink: '/applications',
      actionText: 'View Application'
    },
    {
      recipient: student._id,
      title: 'Interview Feedback Available',
      message: 'Feedback from your Google interview is now available. Review it to improve for future interviews.',
      type: 'interview',
      priority: 'medium',
      isRead: true,
      actionLink: '/applications',
      actionText: 'View Feedback'
    },
    {
      recipient: student._id,
      title: 'Achievement Unlocked: 50 Practice Sessions',
      message: 'Congratulations! You have completed 50 practice sessions. Keep up the great work!',
      type: 'achievement',
      priority: 'low',
      isRead: false,
      actionLink: '/practice-hub',
      actionText: 'View Achievements'
    },
    {
      recipient: student._id,
      title: 'System Maintenance Notice',
      message: 'The platform will be under maintenance on December 20, 2024, from 2:00 AM to 4:00 AM IST.',
      type: 'system',
      priority: 'low',
      isRead: false
    }
  ];

  for (const notificationData of notifications) {
    const notification = new Notification(notificationData);
    await notification.save();
    console.log(`✅ Created notification: ${notification.title}`);
  }
};

// Main seeding function
const seedStudent1Data = async () => {
  try {
    console.log('🌱 Starting comprehensive student1 data seeding...');

    // Create companies
    const companies = await createSampleCompanies();
    
    // Create job postings
    const jobPostings = await createSampleJobPostings(companies);
    
    // Create student
    const student = await createStudent1();
    
    // Create applications
    await createJobApplications(student, jobPostings);
    
    // Create practice sessions
    await createPracticeSessions(student);
    
    // Create skill progress
    await createSkillProgress(student);
    
    // Create notifications
    await createNotifications(student);

    console.log('✅ Comprehensive student1 data seeding completed successfully!');
    console.log('\n📊 Student1 Data Summary:');
    console.log(`- Student: ${student.student.name} (${student.email})`);
    console.log(`- Companies: ${companies.length}`);
    console.log(`- Job Postings: ${jobPostings.length}`);
    console.log(`- Applications: 6 (2 offers, 1 interview, 1 test, 1 rejected, 1 withdrawn)`);
    console.log(`- Practice Sessions: 8`);
    console.log(`- Skills: 10`);
    console.log(`- Notifications: 10`);

  } catch (error) {
    console.error('❌ Error seeding student1 data:', error);
  }
};

// Run the seeding
const main = async () => {
  await connectDB();
  await seedStudent1Data();
  
  // Close database connection
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
};

main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
