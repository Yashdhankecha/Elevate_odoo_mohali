const mongoose = require('mongoose');
const User = require('./models/User');

async function debugLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo');
    console.log('✅ Connected to MongoDB');

    const email = 'tp1@college.edu';
    const password = 'tpo123456';

    console.log('🔍 Step 1: Finding user by email...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    console.log('✅ User found:', user.email);
    console.log('✅ User role:', user.role);
    console.log('✅ User status:', user.status);
    console.log('✅ User isVerified:', user.isVerified);

    console.log('\n🔍 Step 2: Testing password comparison...');
    console.log('Password hash:', user.password);
    console.log('Password hash length:', user.password.length);
    
    // Test the comparePassword method
    const isPasswordValid = await user.comparePassword(password);
    console.log('comparePassword result:', isPasswordValid);

    // Test direct bcrypt comparison
    const bcrypt = require('bcryptjs');
    const directComparison = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt comparison:', directComparison);

    console.log('\n🔍 Step 3: Testing with wrong password...');
    const isWrongPassword = await user.comparePassword('wrongpassword');
    console.log('Wrong password result:', isWrongPassword);

    console.log('\n🔍 Step 4: Testing status check...');
    if (user.role !== 'superadmin' && user.status !== 'active') {
      console.log('❌ User status is not active:', user.status);
    } else {
      console.log('✅ User status is active');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

debugLogin();
