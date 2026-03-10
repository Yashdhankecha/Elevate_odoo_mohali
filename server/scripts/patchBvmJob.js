/**
 * Patch: Set targetColleges on the on-campus BVM job posting
 * Run: node scripts/patchBvmJob.js
 */
const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');

const URI =
    'mongodb://tripod:karanharshyash@ac-kauqk1j-shard-00-00.lb9dcwd.mongodb.net:27017,' +
    'ac-kauqk1j-shard-00-01.lb9dcwd.mongodb.net:27017,' +
    'ac-kauqk1j-shard-00-02.lb9dcwd.mongodb.net:27017/' +
    'elevate_odoo_mohali?ssl=true&replicaSet=atlas-rh3iy8-shard-0&authSource=admin&retryWrites=true&w=majority';

async function patch() {
    await mongoose.connect(URI, { family: 4 });
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
