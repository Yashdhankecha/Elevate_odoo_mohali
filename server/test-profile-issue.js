require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testProfileIssue() {
  try {
    console.log('=== TESTING PROFILE UPDATE ISSUE ===');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find a test user
    const testUser = await User.findOne({ email: 'test@student.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('✅ Test user found:', testUser.email);
    console.log('Current user data:', {
      name: testUser.name,
      phone: testUser.phone,
      bio: testUser.bio,
      location: testUser.location
    });
    
    // Create a JWT token
    const token = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
    console.log('✅ JWT token created');
    
    // Test 1: Check if user can fetch their profile
    console.log('\n=== TEST 1: Fetching user profile ===');
    try {
      const profileResponse = await axios.get('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Profile fetch successful');
      console.log('Profile data:', profileResponse.data);
    } catch (error) {
      console.log('❌ Profile fetch failed:', error.response?.data || error.message);
    }
    
    // Test 2: Update profile
    console.log('\n=== TEST 2: Updating profile ===');
    const updateData = {
      name: 'Updated Test User',
      phone: '+91 98765 43210',
      bio: 'This is a test bio update from script',
      location: 'Mumbai, India',
      linkedin: 'https://linkedin.com/in/testuser',
      github: 'https://github.com/testuser'
    };
    
    console.log('Update data:', updateData);
    
    try {
      const updateResponse = await axios.put('http://localhost:5000/api/user/profile', updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Profile update successful');
      console.log('Update response:', updateResponse.data);
    } catch (error) {
      console.log('❌ Profile update failed:', error.response?.data || error.message);
    }
    
    // Test 3: Verify the update in database
    console.log('\n=== TEST 3: Verifying database update ===');
    const updatedUser = await User.findById(testUser._id).select('-password');
    console.log('Updated user in database:', {
      name: updatedUser.name,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      location: updatedUser.location,
      linkedin: updatedUser.linkedin,
      github: updatedUser.github,
      updatedAt: updatedUser.updatedAt
    });
    
    // Test 4: Check if the data matches what we sent
    const dataMatches = 
      updatedUser.name === updateData.name &&
      updatedUser.phone === updateData.phone &&
      updatedUser.bio === updateData.bio &&
      updatedUser.location === updateData.location &&
      updatedUser.linkedin === updateData.linkedin &&
      updatedUser.github === updateData.github;
    
    console.log('Data matches expected:', dataMatches);
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test error:', error);
    await mongoose.disconnect();
  }
}

testProfileIssue();
