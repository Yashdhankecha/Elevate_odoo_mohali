require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker');
    console.log('✅ Connected to MongoDB');
    
    // Check if there are any users
    const users = await User.find({}).select('email role name');
    console.log('Users in database:', users);
    
    // Check the User model schema
    console.log('User model fields:', Object.keys(User.schema.paths));
    
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Database test error:', error);
  }
}

testDatabase();
