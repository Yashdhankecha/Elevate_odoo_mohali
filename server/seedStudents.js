const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the User model
const User = require('./models/User');

// Sample data for realistic student profiles
const branches = [
  'Computer Science', 'Information Technology', 'Electronics & Communication', 
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'
];

const states = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal',
  'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'Odisha'
];

const skills = [
  { name: 'JavaScript', proficiency: 'Advanced' },
  { name: 'Python', proficiency: 'Intermediate' },
  { name: 'Java', proficiency: 'Advanced' },
  { name: 'React.js', proficiency: 'Intermediate' },
  { name: 'Node.js', proficiency: 'Intermediate' },
  { name: 'MongoDB', proficiency: 'Beginner' },
  { name: 'SQL', proficiency: 'Advanced' },
  { name: 'Data Structures', proficiency: 'Advanced' },
  { name: 'Algorithms', proficiency: 'Intermediate' },
  { name: 'Machine Learning', proficiency: 'Beginner' },
  { name: 'AWS', proficiency: 'Beginner' },
  { name: 'Docker', proficiency: 'Beginner' },
  { name: 'Git', proficiency: 'Advanced' },
  { name: 'Linux', proficiency: 'Intermediate' },
  { name: 'C++', proficiency: 'Advanced' }
];

const companies = [
  'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant',
  'Accenture', 'IBM', 'Amazon', 'Google', 'Microsoft', 'Oracle',
  'Capgemini', 'L&T Infotech', 'Mindtree', 'Mphasis', 'Hexaware'
];

const positions = [
  'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'Data Engineer', 'DevOps Engineer', 'QA Engineer', 'System Engineer',
  'Business Analyst', 'Product Manager', 'UI/UX Designer'
];

// Generate random date within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random element from array
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate random number within range
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random CGPA
const randomCGPA = () => (Math.random() * 3 + 7).toFixed(2); // Between 7.0 and 10.0

// Generate random phone number
const randomPhone = () => {
  const prefixes = ['+91', '+91', '+91'];
  const prefix = randomElement(prefixes);
  const number = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `${prefix}${number}`;
};

// Generate student data
const generateStudentData = (index) => {
  const branch = randomElement(branches);
  const city = randomElement(cities);
  const state = randomElement(states);
  const graduationYear = randomNumber(2024, 2026);
  const semester = randomNumber(5, 8);
  const cgpa = parseFloat(randomCGPA());
  
  // Generate random skills (2-5 skills)
  const numSkills = randomNumber(2, 5);
  const studentSkills = [];
  const availableSkills = [...skills];
  
  for (let i = 0; i < numSkills; i++) {
    if (availableSkills.length > 0) {
      const skillIndex = randomNumber(0, availableSkills.length - 1);
      studentSkills.push(availableSkills[skillIndex]);
      availableSkills.splice(skillIndex, 1);
    }
  }
  
  // Generate random projects (1-3 projects)
  const numProjects = randomNumber(1, 3);
  const projects = [];
  
  for (let i = 0; i < numProjects; i++) {
    const projectTitles = [
      'E-commerce Platform', 'Task Management App', 'Weather Dashboard',
      'Portfolio Website', 'Blog System', 'Chat Application',
      'Inventory Management', 'Student Portal', 'Restaurant Booking System'
    ];
    
    projects.push({
      title: randomElement(projectTitles),
      description: `A comprehensive ${randomElement(['web', 'mobile', 'desktop'])} application built with modern technologies.`,
      technologies: [randomElement(['React', 'Node.js', 'Python', 'Java', 'Flutter']), randomElement(['MongoDB', 'MySQL', 'PostgreSQL'])],
      githubUrl: `https://github.com/student${index}/project${i + 1}`,
      liveUrl: `https://project${i + 1}-${index}.vercel.app`,
      duration: {
        startDate: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
        endDate: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
      }
    });
  }
  
  // Generate random applications (0-5 applications)
  const numApplications = randomNumber(0, 5);
  const applications = [];
  
  for (let i = 0; i < numApplications; i++) {
    const statuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Rejected'];
    const status = randomElement(statuses);
    
    const application = {
      jobId: `JOB${String(index).padStart(3, '0')}${String(i + 1).padStart(2, '0')}`,
      companyName: randomElement(companies),
      position: randomElement(positions),
      appliedDate: randomDate(new Date(2024, 0, 1), new Date()),
      status: status,
      notes: status === 'Selected' ? 'Great interview experience!' : status === 'Rejected' ? 'Need to improve technical skills' : ''
    };
    
    // Add interview rounds for some applications
    if (['Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected'].includes(status)) {
      const numRounds = randomNumber(1, 3);
      application.interviewRounds = [];
      
      for (let j = 0; j < numRounds; j++) {
        application.interviewRounds.push({
          round: j + 1,
          date: randomDate(new Date(2024, 0, 1), new Date()),
          type: randomElement(['Online', 'Offline', 'Phone', 'Video Call']),
          status: randomElement(['Scheduled', 'Completed', 'Cancelled', 'Rescheduled']),
          feedback: j === 0 ? 'Good technical knowledge' : 'Strong problem-solving skills',
          score: randomNumber(6, 10)
        });
      }
    }
    
    applications.push(application);
  }
  
  // Check if student is placed
  const isPlaced = applications.some(app => app.status === 'Selected');
  let placementDetails = null;
  
  if (isPlaced) {
    const selectedApp = applications.find(app => app.status === 'Selected');
    placementDetails = {
      company: selectedApp.companyName,
      package: {
        amount: randomNumber(300000, 1200000),
        currency: 'INR',
        type: 'CTC'
      },
      role: selectedApp.position,
      location: randomElement(['Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Delhi']),
      placementDate: selectedApp.appliedDate,
      offerLetterUrl: `https://drive.google.com/offer-${index}.pdf`
    };
  }
  
  // Generate random internships (0-2 internships)
  const numInternships = randomNumber(0, 2);
  const internships = [];
  
  for (let i = 0; i < numInternships; i++) {
    internships.push({
      company: randomElement(companies),
      role: `Intern - ${randomElement(['Software Development', 'Data Analysis', 'Web Development', 'Testing'])}`,
      duration: {
        startDate: randomDate(new Date(2023, 5, 1), new Date(2023, 11, 31)),
        endDate: randomDate(new Date(2023, 11, 1), new Date(2024, 2, 31))
      },
      stipend: randomNumber(5000, 25000),
      description: 'Worked on real-world projects and gained hands-on experience.',
      certificateUrl: `https://drive.google.com/internship-${index}-${i + 1}.pdf`
    });
  }
  
  // Generate random certifications (0-3 certifications)
  const numCertifications = randomNumber(0, 3);
  const certifications = [];
  
  const certNames = [
    'AWS Certified Developer', 'Google Cloud Professional', 'Microsoft Azure Fundamentals',
    'Oracle Certified Java Developer', 'Cisco CCNA', 'CompTIA A+',
    'Data Science Certification', 'Machine Learning Specialization', 'Web Development Bootcamp'
  ];
  
  for (let i = 0; i < numCertifications; i++) {
    const issueDate = randomDate(new Date(2023, 0, 1), new Date());
    certifications.push({
      name: randomElement(certNames),
      issuer: randomElement(['AWS', 'Google', 'Microsoft', 'Oracle', 'Cisco', 'CompTIA', 'Coursera', 'Udemy']),
      issueDate: issueDate,
      expiryDate: new Date(issueDate.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year later
      certificateUrl: `https://drive.google.com/cert-${index}-${i + 1}.pdf`
    });
  }
  
  // Generate random achievements (0-4 achievements)
  const numAchievements = randomNumber(0, 4);
  const achievements = [];
  
  const achievementTitles = [
    'Hackathon Winner', 'Best Project Award', 'Dean\'s List', 'Technical Excellence Award',
    'Leadership Award', 'Innovation Award', 'Academic Excellence', 'Sports Champion'
  ];
  
  for (let i = 0; i < numAchievements; i++) {
    achievements.push({
      title: randomElement(achievementTitles),
      description: 'Recognized for outstanding performance and contribution.',
      date: randomDate(new Date(2023, 0, 1), new Date()),
      certificateUrl: `https://drive.google.com/achievement-${index}-${i + 1}.pdf`
    });
  }
  
  // Generate random languages (1-3 languages)
  const numLanguages = randomNumber(1, 3);
  const languages = [];
  const languageNames = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  
  for (let i = 0; i < numLanguages; i++) {
    if (i === 0) {
      languages.push({ name: 'English', proficiency: 'Fluent' }); // English is always fluent
    } else {
      const language = randomElement(languageNames.filter(l => !languages.find(lang => lang.name === l)));
      languages.push({
        name: language,
        proficiency: randomElement(['Basic', 'Conversational', 'Fluent'])
      });
    }
  }
  
  return {
    email: `student${index + 1}@college.edu`,
    password: 'password123',
    role: 'student',
    isVerified: true,
    profilePicture: `https://ui-avatars.com/api/?name=Student+${index + 1}&background=random&size=200`,
    lastLogin: new Date(),
    student: {
      name: `Student ${index + 1}`,
      rollNumber: `CS${String(index + 1).padStart(3, '0')}`,
      branch: branch,
      graduationYear: graduationYear,
      collegeName: 'Engineering College',
      semester: semester,
      cgpa: cgpa,
      sgpa: [
        { semester: 5, gpa: parseFloat((cgpa + randomNumber(-5, 5) / 10).toFixed(2)) },
        { semester: 6, gpa: parseFloat((cgpa + randomNumber(-5, 5) / 10).toFixed(2)) },
        { semester: 7, gpa: parseFloat((cgpa + randomNumber(-5, 5) / 10).toFixed(2)) }
      ],
      backlogHistory: randomNumber(0, 3),
      currentBacklogs: randomNumber(0, 1),
      dateOfBirth: randomDate(new Date(2000, 0, 1), new Date(2003, 11, 31)),
      gender: randomElement(['Male', 'Female']),
      phoneNumber: randomPhone(),
      address: {
        street: `${randomNumber(1, 100)} Main Street`,
        city: city,
        state: state,
        country: 'India',
        zipCode: randomNumber(100000, 999999).toString()
      },
      skills: studentSkills,
      certifications: certifications,
      languages: languages,
      resume: `https://drive.google.com/resume-${index + 1}.pdf`,
      portfolioUrl: `https://portfolio-${index + 1}.vercel.app`,
      githubUrl: `https://github.com/student${index + 1}`,
      linkedinUrl: `https://linkedin.com/in/student${index + 1}`,
      isPlaced: isPlaced,
      placementDetails: placementDetails,
      applications: applications,
      internships: internships,
      projects: projects,
      achievements: achievements,
      extracurricularActivities: [
        'Technical Club Member', 'Sports Team Captain', 'Cultural Committee', 'NSS Volunteer'
      ],
      preferredLocations: [city, randomElement(cities), randomElement(cities)],
      preferredCompanies: [randomElement(companies), randomElement(companies), randomElement(companies)],
      expectedPackage: {
        min: randomNumber(400000, 800000),
        max: randomNumber(800000, 1500000),
        currency: 'INR'
      },
      workMode: randomElement(['On-site', 'Remote', 'Hybrid', 'Any']),
      isActive: true,
      profileCompletion: 0
    }
  };
};

// Calculate profile completion percentage
const calculateProfileCompletion = (student) => {
  let completed = 0;
  let total = 0;
  
  // Basic info (25%)
  if (student.name) completed += 1;
  if (student.phoneNumber) completed += 1;
  if (student.address?.city) completed += 1;
  if (student.dateOfBirth) completed += 1;
  total += 4;
  
  // Academic info (25%)
  if (student.rollNumber) completed += 1;
  if (student.branch) completed += 1;
  if (student.graduationYear) completed += 1;
  if (student.collegeName) completed += 1;
  total += 4;
  
  // Skills and resume (25%)
  if (student.skills && student.skills.length > 0) completed += 1;
  if (student.resume) completed += 1;
  if (student.projects && student.projects.length > 0) completed += 1;
  if (student.certifications && student.certifications.length > 0) completed += 1;
  total += 4;
  
  // Preferences (25%)
  if (student.preferredLocations && student.preferredLocations.length > 0) completed += 1;
  if (student.expectedPackage?.min) completed += 1;
  if (student.workMode) completed += 1;
  if (student.profilePicture) completed += 1;
  total += 4;
  
  return Math.round((completed / total) * 100);
};

// Main seeding function
const seedStudents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB');
    
    // Clear existing students
    await User.deleteMany({ role: 'student' });
    console.log('🗑️  Cleared existing students');
    
    // Generate and insert 20 students
    const students = [];
    for (let i = 0; i < 20; i++) {
      const studentData = generateStudentData(i);
      students.push(studentData);
    }
    
    // Insert all students
    const insertedStudents = await User.insertMany(students);
    console.log(`✅ Successfully inserted ${insertedStudents.length} students`);
    
    // Calculate profile completion for each student
    for (const user of insertedStudents) {
      user.student.profileCompletion = calculateProfileCompletion(user.student);
      await user.save();
    }
    console.log('📊 Profile completion calculated for all students');
    
    // Display summary
    console.log('\n📋 Student Data Summary:');
    console.log('========================');
    
    const placedCount = insertedStudents.filter(u => u.student.isPlaced).length;
    const avgCGPA = (insertedStudents.reduce((sum, u) => sum + u.student.cgpa, 0) / insertedStudents.length).toFixed(2);
    const avgProfileCompletion = (insertedStudents.reduce((sum, u) => sum + u.student.profileCompletion, 0) / insertedStudents.length).toFixed(1);
    
    console.log(`Total Students: ${insertedStudents.length}`);
    console.log(`Placed Students: ${placedCount}`);
    console.log(`Average CGPA: ${avgCGPA}`);
    console.log(`Average Profile Completion: ${avgProfileCompletion}%`);
    
    // Show some sample students
    console.log('\n👥 Sample Students:');
    console.log('==================');
    
    insertedStudents.slice(0, 3).forEach((user, index) => {
      const student = user.student;
      console.log(`\n${index + 1}. ${student.name} (${student.rollNumber})`);
      console.log(`   Branch: ${student.branch}`);
      console.log(`   CGPA: ${student.cgpa}`);
      console.log(`   Status: ${student.isPlaced ? 'Placed' : 'Not Placed'}`);
      console.log(`   Profile Completion: ${student.profileCompletion}%`);
      if (student.isPlaced) {
        console.log(`   Company: ${student.placementDetails.company}`);
        console.log(`   Package: ₹${student.placementDetails.package.amount.toLocaleString()}`);
      }
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
};

// Run the seeding function
seedStudents();
