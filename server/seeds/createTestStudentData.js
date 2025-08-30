const mongoose = require('mongoose');
const User = require('../models/User');
const JobApplication = require('../models/JobApplication');
const JobPosting = require('../models/JobPosting');
const PracticeSession = require('../models/PracticeSession');
const SkillProgress = require('../models/SkillProgress');

async function createTestStudentData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/elevate_odoo_mohali');
    console.log('Connected to MongoDB');

    // Find the test student
    const testStudent = await User.findOne({ email: 'test@student.com' });
    if (!testStudent) {
      console.log('Test student not found. Please create test student first.');
      mongoose.connection.close();
      return;
    }

    // Find company users
    const companyUsers = await User.find({ role: 'company' });
    if (companyUsers.length === 0) {
      console.log('No company users found. Please create company users first.');
      mongoose.connection.close();
      return;
    }

    console.log('Found test student:', testStudent.email);
    console.log('Found company users:', companyUsers.length);

    // Get all job postings
    const jobPostings = await JobPosting.find({ isActive: true });
    if (jobPostings.length === 0) {
      console.log('No job postings found. Please seed job postings first.');
      mongoose.connection.close();
      return;
    }

    // Clear existing data for test student
    await JobApplication.deleteMany({ student: testStudent._id });
    await PracticeSession.deleteMany({ student: testStudent._id });
    await SkillProgress.deleteMany({ student: testStudent._id });

    console.log('Cleared existing data for test student');

    // 1. Create Job Applications
    const jobApplications = [
      {
        student: testStudent._id,
        jobPosting: jobPostings[0]._id,
        company: companyUsers[0]._id,
        status: 'applied',
        appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        resume: 'https://example.com/resume1.pdf',
        coverLetter: 'I am excited to apply for the Frontend Developer position. I have strong experience with React and modern web technologies.',
        notes: 'Strong candidate with good React skills',
        timeline: [
          {
            action: 'Applied',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            description: 'Application submitted successfully'
          }
        ]
      },
      {
        student: testStudent._id,
        jobPosting: jobPostings[1]._id,
        company: companyUsers[0]._id,
        status: 'test_scheduled',
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        testDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        resume: 'https://example.com/resume2.pdf',
        coverLetter: 'I am passionate about data science and machine learning. I have completed several projects in this field.',
        notes: 'Test scheduled for next week',
        timeline: [
          {
            action: 'Applied',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            description: 'Application submitted successfully'
          },
          {
            action: 'Test Scheduled',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            description: 'Technical test scheduled'
          }
        ]
      },
      {
        student: testStudent._id,
        jobPosting: jobPostings[2]._id,
        company: companyUsers[0]._id,
        status: 'interview_scheduled',
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        resume: 'https://example.com/resume3.pdf',
        coverLetter: 'I have strong leadership skills and experience in product management. I am excited about this opportunity.',
        notes: 'Interview scheduled for next week',
        timeline: [
          {
            action: 'Applied',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            description: 'Application submitted successfully'
          },
          {
            action: 'Interview Scheduled',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            description: 'Technical interview scheduled'
          }
        ]
      },
      {
        student: testStudent._id,
        jobPosting: jobPostings[3]._id,
        company: companyUsers[0]._id,
        status: 'rejected',
        appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        resume: 'https://example.com/resume4.pdf',
        coverLetter: 'I have a strong background in UI/UX design and have worked on various design projects.',
        notes: 'Rejected due to insufficient experience',
        timeline: [
          {
            action: 'Applied',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            description: 'Application submitted successfully'
          },
          {
            action: 'Rejected',
            date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            description: 'Application rejected'
          }
        ]
      },
      {
        student: testStudent._id,
        jobPosting: jobPostings[4]._id,
        company: companyUsers[0]._id,
        status: 'applied',
        appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        resume: 'https://example.com/resume5.pdf',
        coverLetter: 'I am experienced in backend development with Node.js and databases. I am excited about this opportunity.',
        notes: 'Application under review',
        timeline: [
          {
            action: 'Applied',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            description: 'Application submitted successfully'
          }
        ]
      }
    ];

    await JobApplication.insertMany(jobApplications);
    console.log('Created 5 job applications');

    // 2. Create Practice Sessions
    const practiceSessions = [
      {
        student: testStudent._id,
        topic: 'React Hooks',
        category: 'web-development',
        difficulty: 'medium',
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        timeSpent: 45,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        student: testStudent._id,
        topic: 'System Design',
        category: 'system-design',
        difficulty: 'hard',
        score: 78,
        totalQuestions: 5,
        correctAnswers: 4,
        timeSpent: 60,
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        student: testStudent._id,
        topic: 'JavaScript ES6',
        category: 'web-development',
        difficulty: 'medium',
        score: 92,
        totalQuestions: 8,
        correctAnswers: 7,
        timeSpent: 30,
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        student: testStudent._id,
        topic: 'Data Structures',
        category: 'data-structures',
        difficulty: 'medium',
        score: 88,
        totalQuestions: 12,
        correctAnswers: 10,
        timeSpent: 50,
        completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        student: testStudent._id,
        topic: 'Node.js',
        category: 'web-development',
        difficulty: 'medium',
        score: 75,
        totalQuestions: 6,
        correctAnswers: 4,
        timeSpent: 40,
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        student: testStudent._id,
        topic: 'Algorithms',
        category: 'algorithms',
        difficulty: 'hard',
        score: 82,
        totalQuestions: 8,
        correctAnswers: 6,
        timeSpent: 55,
        completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      },
      {
        student: testStudent._id,
        topic: 'CSS Grid',
        category: 'web-development',
        difficulty: 'easy',
        score: 95,
        totalQuestions: 5,
        correctAnswers: 5,
        timeSpent: 25,
        completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        student: testStudent._id,
        topic: 'Database Design',
        category: 'database',
        difficulty: 'medium',
        score: 80,
        totalQuestions: 7,
        correctAnswers: 5,
        timeSpent: 45,
        completedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000)
      }
    ];

    await PracticeSession.insertMany(practiceSessions);
    console.log('Created 8 practice sessions');

    // 3. Create Skill Progress
    const skillProgress = [
      {
        student: testStudent._id,
        skill: 'React.js',
        category: 'technical',
        proficiency: 85,
        targetProficiency: 90,
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Strong React skills with hooks and context API'
      },
      {
        student: testStudent._id,
        skill: 'JavaScript',
        category: 'technical',
        proficiency: 90,
        targetProficiency: 95,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: 'Advanced JavaScript with ES6+ features'
      },
      {
        student: testStudent._id,
        skill: 'Node.js',
        category: 'technical',
        proficiency: 70,
        targetProficiency: 85,
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: 'Intermediate Node.js with Express framework'
      },
      {
        student: testStudent._id,
        skill: 'MongoDB',
        category: 'technical',
        proficiency: 65,
        targetProficiency: 80,
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notes: 'Basic MongoDB operations and queries'
      },
      {
        student: testStudent._id,
        skill: 'CSS',
        category: 'technical',
        proficiency: 88,
        targetProficiency: 90,
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Advanced CSS with Grid and Flexbox'
      },
      {
        student: testStudent._id,
        skill: 'Python',
        category: 'technical',
        proficiency: 40,
        targetProficiency: 70,
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        notes: 'Basic Python programming skills'
      },
      {
        student: testStudent._id,
        skill: 'Data Structures',
        category: 'technical',
        proficiency: 75,
        targetProficiency: 85,
        lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        notes: 'Good understanding of arrays, linked lists, trees'
      },
      {
        student: testStudent._id,
        skill: 'Communication',
        category: 'soft-skills',
        proficiency: 80,
        targetProficiency: 90,
        lastUpdated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        notes: 'Good verbal and written communication skills'
      }
    ];

    await SkillProgress.insertMany(skillProgress);
    console.log('Created 8 skill progress records');

    // 4. Update Job Postings with application counts
    for (let i = 0; i < jobPostings.length; i++) {
      const applicationsCount = jobApplications.filter(app => 
        app.jobPosting.toString() === jobPostings[i]._id.toString()
      ).length;
      
      await JobPosting.findByIdAndUpdate(jobPostings[i]._id, {
        applicationCount: applicationsCount
      });
    }

    console.log('Updated job postings with application counts');

    // 5. Update test student profile with additional information
    await User.findByIdAndUpdate(testStudent._id, {
      profile: {
        firstName: 'Test',
        lastName: 'Student',
        phone: '+91-9876543210',
        dateOfBirth: new Date('2000-05-15'),
        gender: 'Male',
        address: {
          street: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        education: {
          degree: 'Bachelor of Technology',
          field: 'Computer Science',
          institution: 'Test University',
          graduationYear: 2024,
          gpa: 8.5
        },
        experience: {
          totalYears: 1,
          internships: [
            {
              company: 'Tech Corp',
              position: 'Frontend Intern',
              duration: '3 months',
              description: 'Worked on React.js projects'
            }
          ]
        },
        skills: ['React.js', 'JavaScript', 'Node.js', 'MongoDB', 'CSS', 'HTML'],
        languages: ['English', 'Hindi'],
        linkedin: 'https://linkedin.com/in/teststudent',
        github: 'https://github.com/teststudent',
        portfolio: 'https://teststudent.dev'
      }
    });

    console.log('Updated test student profile');

    console.log('\n✅ Successfully seeded all dummy data for test@student.com');
    console.log('\n📊 Data Summary:');
    console.log('- 5 Job Applications (various statuses)');
    console.log('- 8 Practice Sessions (coding & interview)');
    console.log('- 8 Skill Progress Records');
    console.log('- Updated job posting application counts');
    console.log('- Enhanced student profile');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding student data:', error);
    mongoose.connection.close();
  }
}

createTestStudentData();
