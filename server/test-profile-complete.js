require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testProfileComplete() {
  try {
    console.log('=== TESTING COMPLETE PROFILE FUNCTIONALITY ===');
    
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
    
    // Test 1: Fetch user profile
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
    
    // Test 2: Change password
    console.log('\n=== TEST 2: Changing password ===');
    try {
      const passwordResponse = await axios.put('http://localhost:5000/api/user/change-password', {
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Password change successful');
      console.log('Password change response:', passwordResponse.data);
      
      // Test login with new password
      console.log('\n=== TEST 2.1: Testing login with new password ===');
      try {
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: 'test@student.com',
          password: 'newpassword123'
        });
        
        console.log('✅ Login with new password successful');
        console.log('Login response:', loginResponse.data);
        
        // Change password back to original
        console.log('\n=== TEST 2.2: Changing password back to original ===');
        const revertResponse = await axios.put('http://localhost:5000/api/user/change-password', {
          currentPassword: 'newpassword123',
          newPassword: 'password123'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Password reverted successfully');
        
      } catch (loginError) {
        console.log('❌ Login with new password failed:', loginError.response?.data || loginError.message);
      }
      
    } catch (error) {
      console.log('❌ Password change failed:', error.response?.data || error.message);
    }
    
    // Test 3: Verify user still exists (account not deleted)
    console.log('\n=== TEST 3: Verifying user still exists ===');
    const userStillExists = await User.findById(testUser._id);
    if (userStillExists) {
      console.log('✅ User still exists in database');
    } else {
      console.log('❌ User was deleted from database');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ All tests completed');
    
  } catch (error) {
    console.error('❌ Test error:', error);
    await mongoose.disconnect();
  }
}

testProfileComplete();
