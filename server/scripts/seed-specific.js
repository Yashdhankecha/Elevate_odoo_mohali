const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_DIRECT_URI = 'mongodb://tripod:karanharshyash@ac-kauqk1j-shard-00-00.lb9dcwd.mongodb.net:27017,ac-kauqk1j-shard-00-01.lb9dcwd.mongodb.net:27017,ac-kauqk1j-shard-00-02.lb9dcwd.mongodb.net:27017/elevate_odoo_mohali?ssl=true&replicaSet=atlas-rh3iy8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ClusterCGC';

mongoose.connect(MONGODB_DIRECT_URI, { family: 4 })
  .then(() => console.log('✅ Connected to MongoDB'))
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

async function seedData() {
  try {
    const studentEmail = 'harshvyas457harsh@gmail.com';
    const companyName = 'tripod developers';
    
    console.log('--- Checking for Student User ---');
    let studentUser = await User.findOne({ email: studentEmail });
    if (!studentUser) {
        console.log('Student user not found, creating...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        studentUser = new User({
            email: studentEmail,
            password: hashedPassword,
            role: 'student',
            status: 'active',
            isVerified: true,
            name: 'Harsh Vyas',
            student: {
                name: 'Harsh Vyas',
                rollNumber: 'ROLL' + Math.floor(Math.random() * 10000),
                branch: 'CSE',
                graduationYear: '2026',
                collegeName: 'Elevate Institute'
            }
        });
        await studentUser.save();
    } else {
        console.log('Student user found:', studentUser._id);
    }
    
    let studentProfile = await Student.findOne({ email: studentEmail });
    if (!studentProfile) {
        console.log('Student profile not found, creating...');
        studentProfile = new Student({
            name: 'Harsh Vyas',
            email: studentEmail,
            password: studentUser.password, // already hashed
            rollNumber: studentUser.student.rollNumber || ('ROLL' + Math.floor(Math.random() * 10000)),
            branch: 'CSE',
            graduationYear: 2026,
            collegeName: 'Elevate Institute',
            isVerified: true
        });
        await studentProfile.save();
    } else {
        console.log('Student profile found:', studentProfile._id);
    }

    console.log('--- Checking for Company ---');
    // Using a regex for case-insensitive match
    let companyUser = await User.findOne({ 
        role: 'company', 
        'company.companyName': { $regex: new RegExp(`^${companyName}$`, 'i') } 
    });
    
    if (!companyUser) {
        console.log('Company user not found, checking by email...');
        companyUser = await User.findOne({ email: 'contact@tripoddevelopers.com' });
    }

    if (!companyUser) {
        console.log('Company user not found, creating...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('company123', salt);
        companyUser = new User({
            email: 'contact@tripoddevelopers.com',
            password: hashedPassword,
            role: 'company',
            status: 'active',
            isVerified: true,
            name: companyName,
            company: {
                companyName: companyName,
                industry: 'IT/Software',
                companySize: 'startup',
                website: 'https://tripoddevelopers.com',
                description: 'We build great software.',
                location: 'Mohali'
            }
        });
        await companyUser.save();
    } else {
        console.log('Company user found:', companyUser._id);
    }

    let companyProfile = await Company.findOne({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } });
    if (!companyProfile) {
        console.log('Company profile not found, creating...');
        companyProfile = new Company({
            companyName: companyName,
            email: companyUser.email,
            password: companyUser.password,
            contactNumber: '+91 9876543210',
            isVerified: true,
            status: 'active',
            industry: 'IT/Software',
            companySize: 'startup',
            website: 'https://tripoddevelopers.com',
            description: 'We build great software.',
            role: 'company'
        });
        await companyProfile.save();
    } else {
        console.log('Company profile found:', companyProfile._id);
    }

    console.log('--- Seeding Job Postings ---');
    const jobRoles = ['Frontend Eng', 'Backend Eng', 'Full Stack Eng', 'DevOps Eng', 'QA Tester', 'UI/UX Designer', 'Data Analyst', 'Product Manager', 'Data Scientist', 'Security Analyst'];
    let jobs = [];
    for (let i = 0; i < 10; i++) {
        const title = jobRoles[i];
        let job = await JobPosting.findOne({ jobTitle: title, company: companyProfile._id });
        if (!job) {
            job = new JobPosting({
                companyName: companyProfile.companyName,
                industry: 'IT/Software',
                companySize: 'startup',
                companyDescription: 'Innovative solutions for modern problems. '.repeat(5),
                companyLocation: 'Mohali',
                jobTitle: title,
                department: 'Engineering',
                employmentType: i % 2 === 0 ? 'full-time' : 'internship',
                jobCategory: 'technical',
                driveType: 'on_campus',
                targetBatches: ['2025', '2026'],
                eligibleDegrees: ['B.Tech', 'M.Tech'],
                eligibleBranches: ['CSE', 'IT'],
                eligibilityCriteria: {
                    minCgpaPercentage: { value: 6.5 },
                    backlogsAllowed: false,
                    maxActiveBacklogs: 0,
                    min10thPercentage: 60,
                    min12thPercentage: 60
                },
                totalRounds: 3,
                selectionRounds: [
                    { roundNumber: 1, roundName: 'Aptitude', roundType: 'aptitude_test', mode: 'online' },
                    { roundNumber: 2, roundName: 'Technical', roundType: 'technical_interview', mode: 'online' },
                    { roundNumber: 3, roundName: 'HR', roundType: 'hr_interview', mode: 'online' }
                ],
                ctc: 600000 + (i * 100000),
                baseSalary: 500000 + (i * 100000),
                jobDescription: `Detailed description for ${title}. We are looking for talented individuals.`.repeat(3),
                requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'].sort(() => 0.5 - Math.random()).slice(0, 3),
                workMode: 'hybrid',
                workLocations: ['Mohali', 'Remote'],
                applicationDeadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                expectedJoiningDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
                hrName: 'HR Manager',
                contactEmail: companyProfile.email,
                contactPhone: companyProfile.contactNumber,
                status: 'approved',
                company: companyProfile._id,
                createdBy: companyUser._id,
                isActive: true
            });
            await job.save();
        }
        jobs.push(job);
    }
    console.log(`Ensured 10 Job Postings for ${companyName}`);

    console.log('--- Seeding Job Applications ---');
    const applicationStatuses = ['applied', 'test_scheduled', 'test_completed', 'interview_scheduled', 'interview_completed', 'offer_received', 'rejected'];
    for (let i = 0; i < 10; i++) {
        const job = jobs[i];
        const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
        let app = await JobApplication.findOne({ student: studentProfile._id, jobPosting: job._id });
        if (!app) {
            app = new JobApplication({
                student: studentProfile._id,
                jobPosting: job._id,
                company: companyProfile._id,
                status: status,
                appliedDate: new Date(new Date().setDate(new Date().getDate() - i)),
                notes: `Application for ${job.jobTitle}`
            });
            await app.save();
            
            // Also update student.applications array for backward compatibility
            studentProfile.applications.push({
                jobId: job.jobId || job._id.toString(),
                companyName: job.companyName,
                position: job.jobTitle,
                appliedDate: app.appliedDate,
                status: status === 'offer_received' ? 'Selected' : 
                        status === 'rejected' ? 'Rejected' : 
                        status === 'interview_scheduled' ? 'Interview Scheduled' : 
                        'Applied'
            });
            await studentProfile.save();
        }
    }
    console.log(`Ensured 10 Job Applications for ${studentProfile.email}`);

    console.log('--- Seeding Interviews ---');
    const interviewStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
    for (let i = 0; i < 10; i++) {
        const status = interviewStatuses[Math.floor(Math.random() * interviewStatuses.length)];
        let title = `Interview - Round ${i+1}`;
        let existing = await Interview.findOne({ candidate: studentProfile.email, role: title });
        if (!existing) {
            existing = new Interview({
                company: companyUser._id,
                candidate: studentProfile.email,
                candidateId: studentUser._id,
                role: title,
                date: new Date(new Date().setDate(new Date().getDate() + i)),
                time: '14:00',
                type: 'Technical',
                status: status,
                interviewer: 'John Doe',
                location: 'Google Meet',
                duration: '60',
                notes: 'Please join 5 mins early.',
                result: status === 'Completed' ? (Math.random() > 0.5 ? 'Passed' : 'Failed') : 'Not Evaluated'
            });
            await existing.save();
        }
    }
    console.log(`Ensured 10 Interviews for ${studentProfile.email}`);

    console.log('--- Seeding Notifications ---');
    const types = ['application', 'interview', 'job', 'system', 'achievement'];
    for (let i = 0; i < 10; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        let notif = new Notification({
            recipient: studentUser._id,
            title: `Sample Notification ${i+1}`,
            message: `This is a seeded notification of type ${type} for testing purposes.`,
            type: type,
            isRead: i < 5, // half read, half unread
            priority: 'medium'
        });
        await notif.save();
    }
    console.log(`Ensured 10 Notifications for ${studentProfile.email}`);

    console.log('--- Seeding Practice Sessions ---');
    const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'System Design Base', 'React Basics', 'Node JS', 'SQL'];
    const practiceCategories = ['data-structures', 'algorithms', 'system-design', 'database', 'web-development', 'machine-learning', 'soft-skills'];
    for (let i = 0; i < 10; i++) {
        let title = topics[i];
        let existing = await PracticeSession.findOne({ student: studentUser._id, topic: title });
        if (!existing) {
            existing = new PracticeSession({
                student: studentUser._id,
                topic: title,
                category: practiceCategories[i % practiceCategories.length],
                difficulty: 'medium',
                score: Math.floor(Math.random() * 40) + 60, // 60-100
                totalQuestions: 10,
                correctAnswers: Math.floor(Math.random() * 4) + 6, // 6-10
                timeSpent: 30 + Math.floor(Math.random() * 30),
                completedAt: new Date(new Date().setDate(new Date().getDate() - i))
            });
            await existing.save();
        }
    }
    console.log(`Ensured 10 Practice Sessions for ${studentProfile.email}`);

    console.log('✅ Seeding completed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
