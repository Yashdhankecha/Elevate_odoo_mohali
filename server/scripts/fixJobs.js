/**
 * Full fix: Ensure both jobs are visible and targetColleges is set correctly
 */
const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');

const URI =
    'mongodb://tripod:karanharshyash@ac-kauqk1j-shard-00-00.lb9dcwd.mongodb.net:27017,' +
    'ac-kauqk1j-shard-00-01.lb9dcwd.mongodb.net:27017,' +
    'ac-kauqk1j-shard-00-02.lb9dcwd.mongodb.net:27017/' +
    'elevate_odoo_mohali?ssl=true&replicaSet=atlas-rh3iy8-shard-0&authSource=admin&retryWrites=true&w=majority';

async function fix() {
    await mongoose.connect(URI, { family: 4 });

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
