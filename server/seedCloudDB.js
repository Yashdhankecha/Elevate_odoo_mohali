const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Company = require('./models/Company');
const JobPosting = require('./models/JobPosting');
const JobApplication = require('./models/JobApplication');
const Notification = require('./models/Notification');

// Use the same MongoDB URI as the server
const MONGODB_URI = 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCGC';

async function seedCloudDB() {
  try {
    console.log('🌱 Starting cloud database seeding...');
    
    // Connect to cloud database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to cloud MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await JobPosting.deleteMany({});
    await JobApplication.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create TPO user
    console.log('👨‍💼 Creating TPO user...');
    const tpoUser = new User({
      email: "tp1@college.edu",
      password: "tpo123456",
      name: "Dr. Rajesh Kumar",
      role: "tpo",
      status: "active",
      isVerified: true,
      tpo: {
        name: "Dr. Rajesh Kumar",
        instituteName: "Chandigarh University",
        contactNumber: "+91-9876543210",
        designation: "Training & Placement Officer",
        department: "Computer Science & Engineering",
        location: "Mohali, Punjab"
      }
    });
    await tpoUser.save();
    console.log(`✅ TPO user created: ${tpoUser.email}`);

    // Create some sample students
    console.log('👥 Creating sample students...');
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const student = new User({
        name: `Student ${i}`,
        email: `student${i}@cu.edu.in`,
        password: "student123",
        role: "student",
        status: "active",
        isVerified: true,
        student: {
          name: `Student ${i}`,
          rollNumber: `CSE202100${i}`,
          branch: "Computer Science",
          cgpa: 8.0 + (i * 0.2),
          collegeName: "Chandigarh University",
          graduationYear: 2024,
          skills: ["Java", "Python", "React"],
          isPlaced: false
        }
      });
      const savedStudent = await student.save();
      students.push(savedStudent);
    }
    console.log(`✅ ${students.length} students created`);

    // Create some sample companies
    console.log('🏢 Creating sample companies...');
    const companies = [];
    const companyData = [
      { name: "Google", email: "hr@google.com", password: "google123" },
      { name: "Microsoft", email: "hr@microsoft.com", password: "microsoft123" },
      { name: "Amazon", email: "hr@amazon.com", password: "amazon123" }
    ];

    for (const data of companyData) {
      const company = new Company({
        companyName: data.name,
        email: data.email,
        password: data.password,
        contactNumber: "+1-555-0123",
        industry: "Technology",
        companySize: "enterprise",
        website: `https://${data.name.toLowerCase()}.com`,
        description: `${data.name} is a leading technology company`,
        status: "active",
        isVerified: true,
        role: "company"
      });
      const savedCompany = await company.save();
      companies.push(savedCompany);
    }
    console.log(`✅ ${companies.length} companies created`);

    console.log('\n=== CLOUD DATABASE SEEDING SUMMARY ===');
    console.log('👨‍💼 TPO User: tp1@college.edu (Password: tpo123456)');
    console.log('👥 Students Created:', students.length);
    console.log('🏢 Companies Created:', companies.length);
    console.log('\n✅ Cloud database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during cloud database seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from cloud MongoDB');
  }
}

seedCloudDB();
