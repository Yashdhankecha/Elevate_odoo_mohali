const mongoose = require('mongoose');
const User = require('./models/User');

async function testPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo');
    console.log('✅ Connected to MongoDB');

    const tpo = await User.findOne({ role: 'tpo' });
    if (!tpo) {
      console.log('❌ No TPO user found');
      return;
    }

    console.log('TPO email:', tpo.email);
    console.log('TPO password hash:', tpo.password);

    // Test password comparison
    const isCorrect = await tpo.comparePassword('tpo123456');
    console.log('Password comparison result:', isCorrect);

    // Test wrong password
    const isWrong = await tpo.comparePassword('wrongpassword');
    console.log('Wrong password comparison result:', isWrong);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testPassword();
