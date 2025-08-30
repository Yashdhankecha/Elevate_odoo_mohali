const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createTestStudent() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/elevate_odoo_mohali');
    console.log('Connected to MongoDB');

    // Check if test student already exists
    const existingStudent = await User.findOne({ email: 'test@student.com' });
    if (existingStudent) {
      console.log('Test student already exists');
      mongoose.connection.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create test student
    const testStudent = new User({
      email: 'test@student.com',
      password: hashedPassword,
      role: 'student',
      isVerified: true,
      student: {
        name: 'Test Student',
        rollNumber: '2024001',
        branch: 'Computer Science',
        graduationYear: 2024,
        collegeName: 'Test University',
        cgpa: 8.5,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        personalInfo: {
          phone: '9876543210',
          address: {
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India'
          }
        },
        education: {
          degree: 'Bachelor of Technology',
          specialization: 'Computer Science',
          institution: 'Test University',
          graduationYear: 2024
        },
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce application using MERN stack',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            link: 'https://github.com/test/ecommerce'
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            date: '2023-12-01',
            link: 'https://aws.amazon.com/certification/'
          }
        ],
        profileCompletion: 85
      }
    });

    await testStudent.save();
    console.log('Test student created successfully');
    console.log('Email: test@student.com');
    console.log('Password: password123');

    mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error creating test student:', error);
    process.exit(1);
  }
}

// Run the function
createTestStudent();
