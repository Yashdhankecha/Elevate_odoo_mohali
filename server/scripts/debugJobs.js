require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');
const Student = require('../models/Student');

if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not set — add it to server/.env');
    process.exit(1);
}

async function debug() {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('✅ Connected\n');

    // 1. Show all active jobs
    const allJobs = await JobPosting.find({ $or: [{ status: 'active' }, { isActive: true }] })
        .select('jobId jobTitle driveType targetColleges status isActive companyName');
    console.log('=== ALL ACTIVE JOBS ===');
    allJobs.forEach(j => console.log(`  ${j.jobId} | ${j.jobTitle} | ${j.driveType} | isActive:${j.isActive} | status:${j.status} | colleges:${JSON.stringify(j.targetColleges)}`));

    // 2. Show BVM students
    const students = await Student.find({ collegeName: /birla|bvm/i }).select('name email collegeName isActive isVerified');
    console.log('\n=== BVM STUDENTS ===');
    students.forEach(s => console.log(`  ${s.name} | ${s.email} | college:"${s.collegeName}" | active:${s.isActive} | verified:${s.isVerified}`));

    // 3. Simulate the query for a BVM student
    const bvmStudent = students[0];
    if (bvmStudent) {
        const studentCollege = bvmStudent.collegeName || '';
        console.log(`\n=== SIMULATING QUERY for "${studentCollege}" ===`);
        const escaped = studentCollege.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const collegeConditions = [{ driveType: { $ne: 'on_campus' } }];
        if (studentCollege) {
            collegeConditions.push({
                driveType: 'on_campus',
                targetColleges: { $elemMatch: { $regex: new RegExp(`^${escaped}$`, 'i') } }
            });
        }
        const query = {
            $and: [
                { $or: [{ status: 'active' }, { isActive: true }] },
                { $or: collegeConditions }
            ]
        };
        console.log('Query:', JSON.stringify(query, null, 2));
        const visible = await JobPosting.find(query).select('jobId jobTitle driveType targetColleges');
        console.log('Visible jobs:', visible.length);
        visible.forEach(j => console.log(`  ${j.jobId} | ${j.jobTitle} | ${j.driveType}`));
    }

    await mongoose.disconnect();
    process.exit(0);
}

debug().catch(err => { console.error(err); process.exit(1); });
