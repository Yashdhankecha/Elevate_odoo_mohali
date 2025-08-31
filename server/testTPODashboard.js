const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');

const API_BASE_URL = 'http://localhost:5000/api';

async function testTPODashboard() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo');
    console.log('✅ Connected to MongoDB');

    // Find TPO user
    const tpoUser = await User.findOne({ role: 'tpo' });
    if (!tpoUser) {
      console.log('❌ No TPO user found');
      return;
    }
    console.log('✅ Found TPO user:', tpoUser.email);

    // Test email normalization
    const { normalizeEmail } = require('validator');
    const normalizedEmail = normalizeEmail('tp1@college.edu');
    console.log('Original email: tp1@college.edu');
    console.log('Normalized email:', normalizedEmail);
    console.log('Database email:', tpoUser.email);

    // Login as TPO
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'tp1@college.edu',
      password: 'tpo123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token');

    // Test dashboard stats endpoint
    const dashboardResponse = await axios.get(`${API_BASE_URL}/tpo/dashboard-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Dashboard API response:');
    console.log(JSON.stringify(dashboardResponse.data, null, 2));

    // Check if there are students
    const students = await User.find({ 
      role: 'student',
      'student.collegeName': tpoUser.tpo.instituteName 
    });
    console.log(`📊 Found ${students.length} students for TPO's institute`);

    // Check if there are companies
    const Company = require('./models/Company');
    const companies = await Company.find({ status: 'active' });
    console.log(`🏢 Found ${companies.length} active companies`);

    // Check if there are job applications
    const JobApplication = require('./models/JobApplication');
    const studentIds = students.map(student => student._id);
    const applications = await JobApplication.find({
      student: { $in: studentIds }
    });
    console.log(`📝 Found ${applications.length} job applications`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testTPODashboard();
