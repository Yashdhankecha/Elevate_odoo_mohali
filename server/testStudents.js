const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model
const User = require('./models/User');

// Test function to verify student data
const testStudentData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB');
    
    // Get all students
    const students = await User.find({ role: 'student' })
      .select('-password -emailVerificationOTP -passwordResetToken')
      .limit(5);
    
    console.log(`\n📊 Found ${students.length} students (showing first 5):`);
    console.log('==================================================');
    
    students.forEach((user, index) => {
      const student = user.student;
      console.log(`\n${index + 1}. ${student.name} (${student.rollNumber})`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Branch: ${student.branch}`);
      console.log(`   CGPA: ${student.cgpa}`);
      console.log(`   Semester: ${student.semester}`);
      console.log(`   Status: ${student.isPlaced ? 'Placed' : 'Not Placed'}`);
      console.log(`   Profile Completion: ${student.profileCompletion}%`);
      
      if (student.skills && student.skills.length > 0) {
        console.log(`   Skills: ${student.skills.map(s => `${s.name} (${s.proficiency})`).join(', ')}`);
      }
      
      if (student.isPlaced && student.placementDetails) {
        console.log(`   Company: ${student.placementDetails.company}`);
        console.log(`   Package: ₹${student.placementDetails.package.amount.toLocaleString()}`);
        console.log(`   Role: ${student.placementDetails.role}`);
      }
      
      if (student.applications && student.applications.length > 0) {
        console.log(`   Applications: ${student.applications.length}`);
        const statuses = student.applications.map(app => app.status);
        console.log(`   Application Statuses: ${[...new Set(statuses)].join(', ')}`);
      }
    });
    
    // Get statistics
    const stats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          placedStudents: { $sum: { $cond: ['$student.isPlaced', 1, 0] } },
          avgCGPA: { $avg: '$student.cgpa' },
          avgProfileCompletion: { $avg: '$student.profileCompletion' }
        }
      }
    ]);
    
    console.log('\n📈 Overall Statistics:');
    console.log('======================');
    if (stats[0]) {
      console.log(`Total Students: ${stats[0].totalStudents}`);
      console.log(`Placed Students: ${stats[0].placedStudents}`);
      console.log(`Average CGPA: ${stats[0].avgCGPA.toFixed(2)}`);
      console.log(`Average Profile Completion: ${stats[0].avgProfileCompletion.toFixed(1)}%`);
      console.log(`Placement Rate: ${((stats[0].placedStudents / stats[0].totalStudents) * 100).toFixed(1)}%`);
    }
    
    // Get branch-wise statistics
    const branchStats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: '$student.branch',
          count: { $sum: 1 },
          placedCount: { $sum: { $cond: ['$student.isPlaced', 1, 0] } },
          avgCGPA: { $avg: '$student.cgpa' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🏫 Branch-wise Statistics:');
    console.log('==========================');
    branchStats.forEach(branch => {
      console.log(`${branch._id}:`);
      console.log(`  Students: ${branch.count}`);
      console.log(`  Placed: ${branch.placedCount}`);
      console.log(`  Avg CGPA: ${branch.avgCGPA.toFixed(2)}`);
      console.log(`  Placement Rate: ${((branch.placedCount / branch.count) * 100).toFixed(1)}%`);
    });
    
    // Test filtering
    console.log('\n🔍 Testing Filters:');
    console.log('==================');
    
    // Filter by branch
    const csStudents = await User.find({ 
      role: 'student', 
      'student.branch': 'Computer Science' 
    }).countDocuments();
    console.log(`Computer Science Students: ${csStudents}`);
    
    // Filter by CGPA range
    const highCGPAStudents = await User.find({ 
      role: 'student', 
      'student.cgpa': { $gte: 9.0 } 
    }).countDocuments();
    console.log(`Students with CGPA >= 9.0: ${highCGPAStudents}`);
    
    // Filter by placement status
    const placedStudents = await User.find({ 
      role: 'student', 
      'student.isPlaced': true 
    }).countDocuments();
    console.log(`Placed Students: ${placedStudents}`);
    
    // Filter by skills
    const jsStudents = await User.find({ 
      role: 'student', 
      'student.skills.name': 'JavaScript' 
    }).countDocuments();
    console.log(`Students with JavaScript: ${jsStudents}`);
    
    console.log('\n✅ Student data verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing student data:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
};

// Run the test
testStudentData();

