const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_DIRECT_URI = 'mongodb://tripod:karanharshyash@ac-kauqk1j-shard-00-00.lb9dcwd.mongodb.net:27017,ac-kauqk1j-shard-00-01.lb9dcwd.mongodb.net:27017,ac-kauqk1j-shard-00-02.lb9dcwd.mongodb.net:27017/elevate_odoo_mohali?ssl=true&replicaSet=atlas-rh3iy8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ClusterCGC';

mongoose.connect(MONGODB_DIRECT_URI, { family: 4 })
  .then(() => console.log('✅ Connected to MongoDB for verification'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Models
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const PracticeSession = require('../models/PracticeSession');

async function verify() {
  const studentEmail = 'harshvyas457harsh@gmail.com';
  const companyName = 'tripod developers';

  const user = await User.findOne({ email: studentEmail });
  console.log(`Student User ID: ${user?._id}`);

  const student = await Student.findOne({ email: studentEmail });
  console.log(`Student Profile ID: ${student?._id}`);
  
  const comp = await Company.findOne({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } });
  console.log(`Company ID: ${comp?._id}`);

  const jobs = await JobPosting.countDocuments({ company: comp?._id });
  console.log(`Job Postings count: ${jobs}`);

  const apps = await JobApplication.countDocuments({ student: student?._id });
  console.log(`Job Applications count: ${apps}`);

  const interviews = await Interview.countDocuments({ candidate: studentEmail });
  console.log(`Interviews count: ${interviews}`);

  const notifs = await Notification.countDocuments({ recipient: user?._id });
  console.log(`Notifications count: ${notifs}`);

  const sessions = await PracticeSession.countDocuments({ student: user?._id });
  console.log(`Practice Sessions count: ${sessions}`);

  console.log('✅ Verification completed.');
  process.exit(0);
}

verify();
