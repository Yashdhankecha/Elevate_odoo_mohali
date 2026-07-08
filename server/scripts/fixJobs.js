/**
 * Full fix: Ensure both jobs are visible and targetColleges is set correctly
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');

if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not set — add it to server/.env');
    process.exit(1);
}

async function fix() {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });

    const jobs = await JobPosting.find({ $or: [{ status: 'active' }, { isActive: true }] });
    console.log('\n=== FULL DETAILS OF ACTIVE JOBS ===');
    for (const j of jobs) {
        console.log(`\n--- ${j.jobId} ---`);
        console.log('  title:', j.jobTitle || j.title);
        console.log('  driveType:', j.driveType);
        console.log('  status:', j.status, '| isActive:', j.isActive);
        console.log('  targetColleges (raw):', JSON.stringify(j.targetColleges));
        console.log('  targetColleges type:', typeof j.targetColleges, Array.isArray(j.targetColleges) ? 'array' : 'NOT array');
    }

    // Force-fix: ensure JOB-2026-0009 has a proper array for targetColleges
    const onCampusJob = await JobPosting.findOne({ jobId: 'JOB-2026-0009' });
    if (onCampusJob) {
        await JobPosting.collection.updateOne(
            { jobId: 'JOB-2026-0009' },
            { $set: { targetColleges: ['Birla Vishvakarma Mahavidyalaya'], status: 'active', isActive: true } }
        );
        console.log('\n✅ Force-fixed JOB-2026-0009 targetColleges as raw array');
    }

    // Force-fix: ensure JOB-2026-0011 off-campus is visible
    const offCampusJob = await JobPosting.findOne({ jobId: 'JOB-2026-0011' });
    if (offCampusJob) {
        await JobPosting.collection.updateOne(
            { jobId: 'JOB-2026-0011' },
            { $set: { status: 'active', isActive: true } }
        );
        console.log('✅ Force-fixed JOB-2026-0011 status + isActive');
    }

    // Final verification
    const verified = await JobPosting.find({ $or: [{ status: 'active' }, { isActive: true }] })
        .select('jobId jobTitle driveType targetColleges status isActive');
    console.log('\n=== FINAL STATE ===');
    verified.forEach(j => console.log(
        `  ${j.jobId} | ${j.jobTitle || j.title} | ${j.driveType} | active:${j.isActive} | colleges:${JSON.stringify(j.targetColleges)}`
    ));

    await mongoose.disconnect();
    process.exit(0);
}

fix().catch(err => { console.error(err); process.exit(1); });
