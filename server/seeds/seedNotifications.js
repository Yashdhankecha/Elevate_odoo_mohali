require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Notification = require('../models/Notification');

async function seedNotifications() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('Cleared existing notifications');

    // Get users for each role
    const students = await User.find({ role: 'student' }).limit(3);
    const companies = await User.find({ role: 'company' }).limit(3);
    const tpos = await User.find({ role: 'tpo' }).limit(3);
    const superadmins = await User.find({ role: 'superadmin' }).limit(3);

    console.log(`Found ${students.length} students, ${companies.length} companies, ${tpos.length} TPOs, ${superadmins.length} superadmins`);

    const notifications = [];

    // Student notifications
    students.forEach((student, index) => {
      notifications.push(
        {
          recipient: student._id,
          title: 'New Job Opportunity',
          message: 'A new Software Engineer position has been posted by TechCorp Solutions',
          type: 'job',
          priority: 'medium',
          isRead: false,
          actionLink: '/student/job-browse',
          actionText: 'View Job'
        },
        {
          recipient: student._id,
          title: 'Application Status Update',
          message: 'Your application for Frontend Developer at WebTech has been shortlisted',
          type: 'application',
          priority: 'high',
          isRead: false,
          actionLink: '/student/applications',
          actionText: 'View Application'
        },
        {
          recipient: student._id,
          title: 'Interview Scheduled',
          message: 'Interview scheduled for tomorrow at 10:00 AM with TechCorp Solutions',
          type: 'interview',
          priority: 'urgent',
          isRead: true,
          actionLink: '/student/applications',
          actionText: 'View Details'
        },
        {
          recipient: student._id,
          title: 'Practice Session Completed',
          message: 'Great job! You scored 85% in the JavaScript practice session',
          type: 'achievement',
          priority: 'low',
          isRead: false,
          actionLink: '/student/practice-hub',
          actionText: 'View Results'
        }
      );
    });

    // Company notifications
    companies.forEach((company, index) => {
      notifications.push(
        {
          recipient: company._id,
          title: 'New Application Received',
          message: 'John Doe has applied for the Software Engineer position',
          type: 'application',
          priority: 'medium',
          isRead: false,
          actionLink: '/company/applications',
          actionText: 'Review Application'
        },
        {
          recipient: company._id,
          title: 'Interview Scheduled',
          message: 'Interview scheduled with Sarah Smith for tomorrow at 2:00 PM',
          type: 'interview',
          priority: 'high',
          isRead: false,
          actionLink: '/company/interview-scheduling',
          actionText: 'View Schedule'
        },
        {
          recipient: company._id,
          title: 'Job Posting Expiring',
          message: 'Your Frontend Developer job posting expires in 2 days',
          type: 'reminder',
          priority: 'medium',
          isRead: true,
          actionLink: '/company/job-management',
          actionText: 'Extend Posting'
        }
      );
    });

    // TPO notifications
    tpos.forEach((tpo, index) => {
      notifications.push(
        {
          recipient: tpo._id,
          title: 'New Company Registration',
          message: 'TechCorp Solutions has registered and is pending approval',
          type: 'approval',
          priority: 'high',
          isRead: false,
          actionLink: '/tpo/company-management',
          actionText: 'Review Company'
        },
        {
          recipient: tpo._id,
          title: 'Placement Drive Scheduled',
          message: 'Placement drive scheduled for December 20th, 2024',
          type: 'reminder',
          priority: 'medium',
          isRead: false,
          actionLink: '/tpo/placement-drives',
          actionText: 'View Details'
        },
        {
          recipient: tpo._id,
          title: 'Training Program Completed',
          message: '5 students have completed the Advanced Programming training program',
          type: 'achievement',
          priority: 'low',
          isRead: true,
          actionLink: '/tpo/training-programs',
          actionText: 'View Report'
        }
      );
    });

    // Superadmin notifications
    superadmins.forEach((admin, index) => {
      notifications.push(
        {
          recipient: admin._id,
          title: 'New Admin Registration',
          message: 'John Smith has registered as a new administrator',
          type: 'admin',
          priority: 'high',
          isRead: false,
          actionLink: '/superadmin/user-management',
          actionText: 'Review Admin'
        },
        {
          recipient: admin._id,
          title: 'Company Approval Request',
          message: 'TechCorp Solutions is requesting approval for platform access',
          type: 'approval',
          priority: 'medium',
          isRead: false,
          actionLink: '/superadmin/company-approval',
          actionText: 'Review Request'
        },
        {
          recipient: admin._id,
          title: 'System Backup Completed',
          message: 'Daily system backup completed successfully at 2:00 AM',
          type: 'system',
          priority: 'low',
          isRead: true,
          actionLink: '/superadmin/system-settings',
          actionText: 'View Logs'
        }
      );
    });

    // Insert all notifications
    const result = await Notification.insertMany(notifications);
    console.log(`✅ Created ${result.length} notifications`);

    // Verify notifications were created
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ isRead: false });
    console.log(`Total notifications: ${totalNotifications}`);
    console.log(`Unread notifications: ${unreadNotifications}`);

    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error seeding notifications:', error);
    await mongoose.disconnect();
  }
}

seedNotifications();
