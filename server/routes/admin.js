const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Middleware to check if user is superadmin
const isSuperadmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Superadmin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get total students count
router.get('/total-students', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    // Wait for MongoDB connection to be ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection not ready. State: ' + mongoose.connection.readyState });
    }

    // Count students from both users collection and students collection
    const usersCollection = mongoose.connection.db.collection('users');
    const studentsCollection = mongoose.connection.db.collection('students');
    
    const [usersStudents, separateStudents] = await Promise.all([
      usersCollection.countDocuments({ role: 'student' }),
      studentsCollection.countDocuments({})
    ]);
    
    const totalStudents = usersStudents + separateStudents;
    console.log(`Total students: ${usersStudents} from users + ${separateStudents} from students = ${totalStudents}`);
    res.json({ count: totalStudents });
  } catch (error) {
    console.error('Error fetching total students:', error);
    res.status(500).json({ message: 'Failed to fetch total students count: ' + error.message });
  }
});

// Get total companies count
router.get('/total-companies', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    // Wait for MongoDB connection to be ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection not ready. State: ' + mongoose.connection.readyState });
    }

    // Count companies from both users collection and companies collection
    const usersCollection = mongoose.connection.db.collection('users');
    const companiesCollection = mongoose.connection.db.collection('companies');
    
    const [usersCompanies, separateCompanies] = await Promise.all([
      usersCollection.countDocuments({ role: 'company' }),
      companiesCollection.countDocuments({})
    ]);
    
    const totalCompanies = usersCompanies + separateCompanies;
    console.log(`Total companies: ${usersCompanies} from users + ${separateCompanies} from companies = ${totalCompanies}`);
    res.json({ count: totalCompanies });
  } catch (error) {
    console.error('Error fetching total companies:', error);
    res.status(500).json({ message: 'Failed to fetch total companies count: ' + error.message });
  }
 });

// Get total job postings count
router.get('/total-job-postings', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    // Wait for MongoDB connection to be ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection not ready. State: ' + mongoose.connection.readyState });
    }

    // Count job postings from the separate jobpostings collection
    const jobPostingsCollection = mongoose.connection.db.collection('jobpostings');
    const totalJobPostings = await jobPostingsCollection.countDocuments({});
    
    console.log(`Total job postings: ${totalJobPostings}`);
    res.json({ count: totalJobPostings });
  } catch (error) {
    console.error('Error fetching total job postings:', error);
    res.status(500).json({ message: 'Failed to fetch total job postings count: ' + error.message });
  }
});

// Get total applications count
router.get('/total-applications', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    // Wait for MongoDB connection to be ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection not ready. State: ' + mongoose.connection.readyState });
    }

    // Count applications from the separate jobapplications collection
    const jobApplicationsCollection = mongoose.connection.db.collection('jobapplications');
    const totalApplications = await jobApplicationsCollection.countDocuments({});
    
    console.log(`Total applications: ${totalApplications}`);
    res.json({ count: totalApplications });
  } catch (error) {
    console.error('Error fetching total applications:', error);
    res.status(500).json({ message: 'Failed to fetch total applications count: ' + error.message });
  }
});

// Get recent activities
router.get('/recent-activities', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    // Get recent user registrations and activities
    const recentActivities = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('role email createdAt isVerified name companyName')
      .lean();

    const formattedActivities = recentActivities.map(activity => {
      let message = '';
      let type = '';

      if (activity.role === 'tpo') {
        message = `New ${activity.role.toUpperCase()} registration: ${activity.email}`;
        type = 'admin_registration';
      } else if (activity.role === 'company') {
        const companyName = activity.companyName || 'Company';
        message = `New company registration: ${companyName} (${activity.email})`;
        type = 'company_registration';
      } else if (activity.role === 'student') {
        const studentName = activity.name || 'Student';
        message = `New student registration: ${studentName} (${activity.email})`;
        type = 'student_registration';
      } else if (activity.role === 'superadmin') {
        message = `Superadmin activity: ${activity.email}`;
        type = 'superadmin_activity';
      }

      return {
        id: activity._id,
        message,
        type,
        date: activity.createdAt
      };
    });

    res.json({ activities: formattedActivities });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Failed to fetch recent activities' });
  }
});

// Get pending registrations (TPOs and Companies with pending verification)
router.get('/pending-registrations', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    // Wait for MongoDB connection to be ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection not ready. State: ' + mongoose.connection.readyState });
    }

    // Get pending TPOs and Companies from users collection
    const usersCollection = mongoose.connection.db.collection('users');
    const pendingUsers = await usersCollection.find({ 
      role: { $in: ['tpo', 'company'] }, 
      status: 'pending' 
    }).toArray();

    // Get pending TPOs from tpos collection
    const tposCollection = mongoose.connection.db.collection('tpos');
    const pendingTPOsFromCollection = await tposCollection.find({ 
      status: 'pending' 
    }).toArray();

    // Get pending Companies from companies collection
    const companiesCollection = mongoose.connection.db.collection('companies');
    const pendingCompaniesFromCollection = await companiesCollection.find({ 
      status: 'pending' 
    }).toArray();

    // Combine and format the results
    const allPendingUsers = [
      ...pendingUsers, 
      ...pendingTPOsFromCollection, 
      ...pendingCompaniesFromCollection
    ].map(user => ({
      id: user._id,
      email: user.email,
      role: user.role || 'tpo', // Default to tpo for backward compatibility
      name: user.name || user.instituteName || user.companyName || 'User',
      createdAt: user.createdAt,
      status: 'pending',
      instituteName: user.instituteName || user.companyName || 'N/A'
    }));

    console.log(`Found ${allPendingUsers.length} pending users requiring verification`);
    res.json({ 
      success: true, 
      pendingUsers: allPendingUsers 
    });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending users: ' + error.message 
    });
  }
});

// Approve user (TPO or Company)
router.post('/approve-user/:id', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Wait for MongoDB connection to be ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection not ready. State: ' + mongoose.connection.readyState });
    }

    // Try to update in users collection first (for both TPO and Company)
    const usersCollection = mongoose.connection.db.collection('users');
    let updateResult = await usersCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(id), role: { $in: ['tpo', 'company'] } },
      { $set: { status: 'active' } }
    );

    let userType = 'user';

    // If not found in users, try tpos collection
    if (updateResult.matchedCount === 0) {
      const tposCollection = mongoose.connection.db.collection('tpos');
      updateResult = await tposCollection.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { status: 'active' } }
      );
      userType = 'TPO';
    }

    // If not found in tpos, try companies collection
    if (updateResult.matchedCount === 0) {
      const companiesCollection = mongoose.connection.db.collection('companies');
      updateResult = await companiesCollection.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { status: 'active' } }
      );
      userType = 'Company';
    }

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (updateResult.modifiedCount > 0) {
      console.log(`${userType} ${id} approved successfully`);
      res.json({ 
        success: true, 
        message: `${userType} approved successfully` 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: `${userType} was already approved` 
      });
    }
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve user: ' + error.message 
    });
  }
});

// Reject user (TPO or Company)
router.post('/reject-user/:id', authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Wait for MongoDB connection to be ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection not ready. State: ' + mongoose.connection.readyState });
    }

    // Try to update in users collection first (for both TPO and Company)
    const usersCollection = mongoose.connection.db.collection('users');
    let updateResult = await usersCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(id), role: { $in: ['tpo', 'company'] } },
      { $set: { status: 'rejected' } }
    );

    let userType = 'user';

    // If not found in users, try tpos collection
    if (updateResult.matchedCount === 0) {
      const tposCollection = mongoose.connection.db.collection('tpos');
      updateResult = await tposCollection.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { status: 'rejected' } }
      );
      userType = 'TPO';
    }

    // If not found in tpos, try companies collection
    if (updateResult.matchedCount === 0) {
      const companiesCollection = mongoose.connection.db.collection('companies');
      updateResult = await companiesCollection.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { status: 'rejected' } }
      );
      userType = 'Company';
    }

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (updateResult.modifiedCount > 0) {
      console.log(`${userType} ${id} rejected successfully`);
      res.json({ 
        success: true, 
        message: `${userType} rejected successfully` 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: `${userType} was already rejected` 
      });
    }
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reject user: ' + error.message 
    });
  }
});

module.exports = router;
