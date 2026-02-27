const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
console.log('🔄 Reloading configuration...');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Database connection — using direct connection string to bypass SRV DNS lookup issues
const MONGODB_DIRECT_URI = 'mongodb://tripod:karanharshyash@ac-kauqk1j-shard-00-00.lb9dcwd.mongodb.net:27017,ac-kauqk1j-shard-00-01.lb9dcwd.mongodb.net:27017,ac-kauqk1j-shard-00-02.lb9dcwd.mongodb.net:27017/elevate_odoo_mohali?ssl=true&replicaSet=atlas-rh3iy8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ClusterCGC';

mongoose.connect(process.env.MONGODB_URI || MONGODB_DIRECT_URI, {
  family: 4,  // Force IPv4
})
  .then(() => console.log('✅ Connected to MongoDB - Elevate Placement Tracker'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Health check route (must come before chat routes)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/student', require('./routes/student'));
app.use('/api/tpo', require('./routes/tpo'));
app.use('/api/superadmin', require('./routes/superadmin'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/company', require('./routes/company'));
app.use('/api/notifications', require('./routes/notifications'));
// Chatbot routes (career chat)
app.use('/api', require('./routes/chat'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Elevate Placement Tracker Server running on port ${PORT}`);
});
