require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');

async function testProfileUpdateAPI() {
  try {
    console.log('=== TESTING PROFILE UPDATE API ===');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Find a test user
    const testUser = await User.findOne({ email: 'test@student.com' });
    if (!testUser) {
      console.log('Test user not found');
      return;
    }
    
    console.log('Test user found:', testUser.email);
    
    // Create a JWT token
    const token = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
    console.log('JWT token created');
    
    // Test data
    const testData = {
      name: 'API Test User',
      phone: '+91 12345 67890',
      bio: 'This is a test bio from API call',
      location: 'Test City, India',
      linkedin: 'https://linkedin.com/in/apitest',
      github: 'https://github.com/apitest'
    };
    
    console.log('Test data:', testData);
    
    // Make API call
    const response = await axios.put('http://localhost:5000/api/user/profile', testData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    
    // Verify the update in database
    const updatedUser = await User.findById(testUser._id).select('-password');
    console.log('Updated user in database:', JSON.stringify(updatedUser, null, 2));
    
    await mongoose.disconnect();
    console.log('Test completed');
    
  } catch (error) {
    console.error('Test error:', error.response?.data || error.message);
    await mongoose.disconnect();
  }
}

testProfileUpdateAPI();
