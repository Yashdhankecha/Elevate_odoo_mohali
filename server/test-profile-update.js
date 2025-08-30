require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

async function testProfileUpdate() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB');
    
    // Find a test user
    const testUser = await User.findOne({ email: 'test@student.com' });
    if (!testUser) {
      console.log('Test user not found, creating one...');
      return;
    }
    
    console.log('Test user found:', testUser.email, testUser.name);
    
    // Create a test token
    const token = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
    console.log('Test token created');
    
    // Test profile update
    const updateData = {
      name: 'Updated Test User',
      phone: '+91 98765 43210',
      bio: 'This is a test bio update',
      location: 'Mumbai, India',
      linkedin: 'https://linkedin.com/in/testuser',
      github: 'https://github.com/testuser'
    };
    
    console.log('Updating profile with:', updateData);
    
    const updatedUser = await User.findByIdAndUpdate(
      testUser._id,
      updateData,
      { new: true }
    ).select('-password');
    
    console.log('Updated user:', updatedUser);
    
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Profile update test error:', error);
  }
}

testProfileUpdate();
