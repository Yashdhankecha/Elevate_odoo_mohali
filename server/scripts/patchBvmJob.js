/**
 * Patch: Set targetColleges on the on-campus BVM job posting
 * Run: node scripts/patchBvmJob.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');

if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not set — add it to server/.env');
    process.exit(1);
}

async function patch() {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('✅ Connected');

    // Set targetColleges on the on-campus SDE-1 job
    const r = await JobPosting.updateOne(
        { jobId: 'JOB-2026-0009' },
        { $set: { targetColleges: ['Birla Vishvakarma Mahavidyalaya'] } }
    );
    console.log('Patch result:', r);

    // Verify
    const job = await JobPosting.findOne({ jobId: 'JOB-2026-0009' })
        .select('jobId jobTitle driveType targetColleges status isActive approvedAt');
    console.log('Verified job:', JSON.stringify(job, null, 2));

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
}

patch().catch(err => { console.error(err); process.exit(1); });
