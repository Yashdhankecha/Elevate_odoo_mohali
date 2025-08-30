const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate-placement-tracker')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function createSuperadmin() {
  try {
    // Check if superadmin already exists
    const existingSuperadmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperadmin) {
      console.log('⚠️  Superadmin already exists:');
      console.log('📧 Email:', existingSuperadmin.email);
      console.log('🔑 Role:', existingSuperadmin.role);
      console.log('✅ Verified:', existingSuperadmin.isVerified);
      console.log('🆔 User ID:', existingSuperadmin._id);
      
      // Delete existing superadmin to recreate with correct schema
      console.log('🗑️  Deleting existing superadmin to recreate with correct schema...');
      await User.findByIdAndDelete(existingSuperadmin._id);
      console.log('✅ Existing superadmin deleted');
    }

    // Create superadmin user
    const hashedPassword = await bcrypt.hash('321ewq', 6);
    
    const superadmin = new User({
      email: 'superadmin@elevate.com',
      password: hashedPassword,
      role: 'superadmin',
      isVerified: true, // Superadmin is pre-verified
      profilePicture: '',
      lastLogin: new Date()
    });

    await superadmin.save();
    
    console.log('✅ Superadmin created successfully!');
    console.log('📧 Email: superadmin@elevate.com');
    console.log('🔑 Password: 321ewq');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating superadmin:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createSuperadmin();
