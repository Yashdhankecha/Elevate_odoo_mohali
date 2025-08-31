const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');

// Sample internship job postings data
const sampleInternshipPostings = [
  {
    title: 'Software Engineering Intern',
    description: 'Join our engineering team for a 6-month internship program. You will work on real projects, learn modern technologies, and gain hands-on experience in software development.',
    requirements: [
      'Currently pursuing B.Tech in Computer Science or related field',
      'Strong programming fundamentals in Java/Python/JavaScript',
      'Basic understanding of data structures and algorithms',
      'Good problem-solving skills',
      'Ability to work in a team environment'
    ],
    responsibilities: [
      'Develop and maintain software applications',
      'Participate in code reviews and team meetings',
      'Learn and apply new technologies',
      'Contribute to project documentation'
    ],
    package: {
      min: 25000, // 25K per month
      max: 40000, // 40K per month
      currency: 'INR'
    },
    location: 'Mumbai, Maharashtra',
    type: 'internship',
    category: 'software-engineering',
    experience: {
      min: 0,
      max: 1
    },
    skills: ['Java', 'Python', 'JavaScript', 'Git', 'SQL'],
    isActive: true,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    applicationCount: 8,
    views: 45
  },
  {
    title: 'Data Science Intern',
    description: 'Exciting opportunity for data science enthusiasts to work on machine learning projects and data analysis. Perfect for students interested in AI/ML.',
    requirements: [
      'Currently pursuing B.Tech/M.Tech in Computer Science, Statistics, or related field',
      'Basic knowledge of Python and data science libraries',
      'Understanding of statistics and mathematics',
      'Interest in machine learning and data analysis',
      'Good analytical thinking'
    ],
    responsibilities: [
      'Assist in data collection and preprocessing',
      'Develop and test machine learning models',
      'Create data visualizations and reports',
      'Support the data science team in various projects'
    ],
    package: {
      min: 30000, // 30K per month
      max: 50000, // 50K per month
      currency: 'INR'
    },
    location: 'Bangalore, Karnataka',
    type: 'internship',
    category: 'data-science',
    experience: {
      min: 0,
      max: 1
    },
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'SQL'],
    isActive: true,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    applicationCount: 12,
    views: 78
  },
  {
    title: 'Marketing Intern',
    description: 'Join our marketing team to learn digital marketing strategies, social media management, and brand development. Great opportunity for marketing students.',
    requirements: [
      'Currently pursuing BBA/MBA in Marketing or related field',
      'Good communication and writing skills',
      'Basic knowledge of social media platforms',
      'Creative thinking and attention to detail',
      'Interest in digital marketing trends'
    ],
    responsibilities: [
      'Assist in social media content creation and management',
      'Support digital marketing campaigns',
      'Conduct market research and competitor analysis',
      'Help with event planning and execution'
    ],
    package: {
      min: 20000, // 20K per month
      max: 35000, // 35K per month
      currency: 'INR'
    },
    location: 'Delhi, NCR',
    type: 'internship',
    category: 'marketing',
    experience: {
      min: 0,
      max: 1
    },
    skills: ['Social Media Marketing', 'Content Creation', 'Market Research', 'Analytics', 'Communication'],
    isActive: true,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    applicationCount: 15,
    views: 92
  },
  {
    title: 'UI/UX Design Intern',
    description: 'Work with our design team to create beautiful and user-friendly interfaces. Learn design principles, prototyping, and user research.',
    requirements: [
      'Currently pursuing B.Des or related design field',
      'Basic knowledge of design tools (Figma, Sketch)',
      'Understanding of design principles and user experience',
      'Creative mindset and attention to detail',
      'Portfolio of design work (academic projects welcome)'
    ],
    responsibilities: [
      'Create wireframes and mockups for web/mobile applications',
      'Assist in user research and usability testing',
      'Support the design team in various projects',
      'Learn and apply design systems and guidelines'
    ],
    package: {
      min: 25000, // 25K per month
      max: 40000, // 40K per month
      currency: 'INR'
    },
    location: 'Remote',
    type: 'internship',
    category: 'design',
    experience: {
      min: 0,
      max: 1
    },
    skills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research', 'Adobe Creative Suite'],
    isActive: true,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    applicationCount: 6,
    views: 38
  }
];

async function seedInternshipData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/elevate_odoo_mohali');
    console.log('Connected to MongoDB');

    // Get company users
    const companies = await User.find({ role: 'company' });
    if (companies.length === 0) {
      console.log('No company users found. Creating sample companies...');
      
      const sampleCompanies = [
        {
          email: 'tech@company1.com',
          password: 'password123',
          role: 'company',
          company: {
            companyName: 'TechCorp Solutions',
            industry: 'Technology',
            logo: 'https://via.placeholder.com/150',
            description: 'Leading technology solutions provider'
          }
        },
        {
          email: 'data@company2.com',
          password: 'password123',
          role: 'company',
          company: {
            companyName: 'DataFlow Analytics',
            industry: 'Data Science',
            logo: 'https://via.placeholder.com/150',
            description: 'Data analytics and machine learning company'
          }
        },
        {
          email: 'marketing@company3.com',
          password: 'password123',
          role: 'company',
          company: {
            companyName: 'BrandBoost Marketing',
            industry: 'Marketing',
            logo: 'https://via.placeholder.com/150',
            description: 'Digital marketing and brand development agency'
          }
        }
      ];

      await User.insertMany(sampleCompanies);
      console.log('Created sample companies');
    }

    const updatedCompanies = await User.find({ role: 'company' });

    // Add company references to internship postings
    const internshipPostingsWithCompany = sampleInternshipPostings.map((job, index) => ({
      ...job,
      company: updatedCompanies[index % updatedCompanies.length]._id
    }));

    // Insert internship job postings
    const insertedInternships = await JobPosting.insertMany(internshipPostingsWithCompany);
    console.log(`Successfully seeded ${insertedInternships.length} internship postings`);

    // Get students from a TPO institute
    const students = await User.find({ 
      role: 'student',
      'student.collegeName': 'Chandigarh University' // Assuming this is the TPO institute
    });

    if (students.length === 0) {
      console.log('No students found. Creating sample students...');
      
      const sampleStudents = [
        {
          name: 'Rahul Kumar',
          email: 'rahul@student.com',
          password: 'password123',
          role: 'student',
          student: {
            rollNumber: 'CU2023001',
            branch: 'Computer Science',
            cgpa: 8.5,
            collegeName: 'Chandigarh University',
            graduationYear: 2024,
            skills: ['Java', 'Python', 'JavaScript'],
            isPlaced: false
          }
        },
        {
          name: 'Priya Sharma',
          email: 'priya@student.com',
          password: 'password123',
          role: 'student',
          student: {
            rollNumber: 'CU2023002',
            branch: 'Data Science',
            cgpa: 8.8,
            collegeName: 'Chandigarh University',
            graduationYear: 2024,
            skills: ['Python', 'Machine Learning', 'Statistics'],
            isPlaced: false
          }
        },
        {
          name: 'Amit Singh',
          email: 'amit@student.com',
          password: 'password123',
          role: 'student',
          student: {
            rollNumber: 'CU2023003',
            branch: 'Marketing',
            cgpa: 8.2,
            collegeName: 'Chandigarh University',
            graduationYear: 2024,
            skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
            isPlaced: false
          }
        }
      ];

      await User.insertMany(sampleStudents);
      console.log('Created sample students');
    }

    const updatedStudents = await User.find({ 
      role: 'student',
      'student.collegeName': 'Chandigarh University'
    });

    // Create sample job applications for internships
    const sampleApplications = [];
    
    for (let i = 0; i < insertedInternships.length; i++) {
      const internship = insertedInternships[i];
      const student = updatedStudents[i % updatedStudents.length];
      
      // Create 2-3 applications per internship
      for (let j = 0; j < Math.min(3, updatedStudents.length); j++) {
        const applicant = updatedStudents[(i + j) % updatedStudents.length];
        
        sampleApplications.push({
          student: applicant._id,
          jobPosting: internship._id,
          company: internship.company,
          status: ['applied', 'test_scheduled', 'interview_scheduled', 'offer_received'][Math.floor(Math.random() * 4)],
          appliedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          testDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
          interviewDate: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000) : null,
          notes: `Application for ${internship.title} internship`,
          timeline: [
            {
              action: 'Applied',
              date: new Date(),
              description: 'Application submitted successfully'
            }
          ]
        });
      }
    }

    // Insert job applications
    const insertedApplications = await JobApplication.insertMany(sampleApplications);
    console.log(`Successfully seeded ${insertedApplications.length} internship applications`);

    // Display summary
    console.log('\n=== Internship Data Seeding Summary ===');
    console.log(`Internship Postings: ${insertedInternships.length}`);
    console.log(`Applications: ${insertedApplications.length}`);
    console.log(`Companies: ${updatedCompanies.length}`);
    console.log(`Students: ${updatedStudents.length}`);

    console.log('\nSample internship postings:');
    insertedInternships.forEach((internship, index) => {
      console.log(`${index + 1}. ${internship.title} - ${internship.type} - ₹${internship.package.min/1000}-${internship.package.max/1000}K/month`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Error seeding internship data:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedInternshipData();
