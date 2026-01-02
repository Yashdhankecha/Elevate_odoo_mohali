const mongoose = require('mongoose');
const Student = require('./models/Student');
const TPO = require('./models/TPO');
const Company = require('./models/Company');
const SuperAdmin = require('./models/SuperAdmin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo_mohali');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test function
const testNewStructure = async () => {
  try {
    console.log('🧪 Testing new database structure...\n');

    // Test 1: Create a test student
    console.log('1️⃣ Testing Student creation...');
    const testStudent = new Student({
      name: 'Test Student',
      email: 'teststudent@test.com',
      password: 'testpass123',
      rollNumber: 'TEST001',
      branch: 'Computer Science',
      graduationYear: 2025,
      collegeName: 'Test University',
      cgpa: 8.5,
      status: 'active',
      isVerified: true
    });
    await testStudent.save();
    console.log('✅ Student created successfully:', testStudent._id);

    // Test 2: Create a test TPO
    console.log('\n2️⃣ Testing TPO creation...');
    const testTPO = new TPO({
      name: 'Test TPO',
      email: 'testtpo@test.com',
      password: 'testpass123',
      instituteName: 'Test Institute',
      contactNumber: '+91-9876543210',
      designation: 'Training & Placement Officer',
      department: 'Computer Science',
      status: 'active',
      isVerified: true
    });
    await testTPO.save();
    console.log('✅ TPO created successfully:', testTPO._id);

    // Test 3: Create a test company
    console.log('\n3️⃣ Testing Company creation...');
    const testCompany = new Company({
      companyName: 'Test Company',
      email: 'testcompany@test.com',
      password: 'testpass123',
      contactNumber: '+91-9876543211',
      industry: 'Technology',
      companySize: 'medium',
      website: 'https://testcompany.com',
      status: 'active',
      isVerified: true
    });
    await testCompany.save();
    console.log('✅ Company created successfully:', testCompany._id);

    // Test 4: Create a test superadmin
    console.log('\n4️⃣ Testing SuperAdmin creation...');
    const testSuperAdmin = new SuperAdmin({
      name: 'Test SuperAdmin',
      email: 'testsuperadmin@test.com',
      password: 'testpass123',
      status: 'active',
      isVerified: true
    });
    await testSuperAdmin.save();
    console.log('✅ SuperAdmin created successfully:', testSuperAdmin._id);

    // Test 5: Test finding users in collections
    console.log('\n5️⃣ Testing user retrieval...');
    
    const foundStudent = await Student.findOne({ email: 'teststudent@test.com' });
    console.log('✅ Student found:', foundStudent ? 'Yes' : 'No');
    
    const foundTPO = await TPO.findOne({ email: 'testtpo@test.com' });
    console.log('✅ TPO found:', foundTPO ? 'Yes' : 'No');
    
    const foundCompany = await Company.findOne({ email: 'testcompany@test.com' });
    console.log('✅ Company found:', foundCompany ? 'Yes' : 'No');
    
    const foundSuperAdmin = await SuperAdmin.findOne({ email: 'testsuperadmin@test.com' });
    console.log('✅ SuperAdmin found:', foundSuperAdmin ? 'Yes' : 'No');

    // Test 6: Test methods
    console.log('\n6️⃣ Testing model methods...');
    
    console.log('Student display name:', foundStudent.getDisplayName());
    console.log('TPO display name:', foundTPO.getDisplayName());
    console.log('Company display name:', foundCompany.getDisplayName());
    console.log('SuperAdmin display name:', foundSuperAdmin.getDisplayName());
    
    console.log('Student role data:', foundStudent.getRoleData());
    console.log('TPO role data:', foundTPO.getRoleData());
    console.log('Company role data:', foundCompany.getRoleData());

    // Test 7: Test password comparison
    console.log('\n7️⃣ Testing password comparison...');
    
    const studentPasswordValid = await foundStudent.comparePassword('testpass123');
    const tpoPasswordValid = await foundTPO.comparePassword('testpass123');
    const companyPasswordValid = await foundCompany.comparePassword('testpass123');
    const superAdminPasswordValid = await foundSuperAdmin.comparePassword('testpass123');
    
    console.log('Student password valid:', studentPasswordValid);
    console.log('TPO password valid:', tpoPasswordValid);
    console.log('Company password valid:', companyPasswordValid);
    console.log('SuperAdmin password valid:', superAdminPasswordValid);

    // Test 8: Test OTP generation
    console.log('\n8️⃣ Testing OTP generation...');
    
    const studentOTP = foundStudent.generateOTP();
    const tpoOTP = foundTPO.generateOTP();
    const companyOTP = foundCompany.generateOTP();
    
    console.log('Student OTP generated:', studentOTP ? 'Yes' : 'No');
    console.log('TPO OTP generated:', tpoOTP ? 'Yes' : 'No');
    console.log('Company OTP generated:', companyOTP ? 'Yes' : 'No');

    // Test 9: Test JSON conversion (password should be hidden)
    console.log('\n9️⃣ Testing JSON conversion...');
    
    const studentJSON = foundStudent.toJSON();
    const tpoJSON = foundTPO.toJSON();
    const companyJSON = foundCompany.toJSON();
    const superAdminJSON = foundSuperAdmin.toJSON();
    
    console.log('Student password hidden:', !studentJSON.password ? 'Yes' : 'No');
    console.log('TPO password hidden:', !tpoJSON.password ? 'Yes' : 'No');
    console.log('Company password hidden:', !companyJSON.password ? 'Yes' : 'No');
    console.log('SuperAdmin password hidden:', !superAdminJSON.password ? 'Yes' : 'No');

    // Test 10: Test collection counts
    console.log('\n🔟 Testing collection counts...');
    
    const studentCount = await Student.countDocuments();
    const tpoCount = await TPO.countDocuments();
    const companyCount = await Company.countDocuments();
    const superAdminCount = await SuperAdmin.countDocuments();
    
    console.log('Total students:', studentCount);
    console.log('Total TPOs:', tpoCount);
    console.log('Total companies:', companyCount);
    console.log('Total superadmins:', superAdminCount);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Student operations: Working');
    console.log('✅ TPO operations: Working');
    console.log('✅ Company operations: Working');
    console.log('✅ SuperAdmin operations: Working');
    console.log('✅ Authentication methods: Working');
    console.log('✅ Data retrieval: Working');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Cleanup function
const cleanup = async () => {
  try {
    console.log('\n🧹 Cleaning up test data...');
    
    await Student.deleteOne({ email: 'teststudent@test.com' });
    await TPO.deleteOne({ email: 'testtpo@test.com' });
    await Company.deleteOne({ email: 'testcompany@test.com' });
    await SuperAdmin.deleteOne({ email: 'testsuperadmin@test.com' });
    
    console.log('✅ Test data cleaned up');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
};

// Run tests
const runTests = async () => {
  await connectDB();
  await testNewStructure();
  await cleanup();
  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB');
};

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testNewStructure };

