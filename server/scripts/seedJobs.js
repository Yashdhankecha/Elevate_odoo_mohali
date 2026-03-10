/**
 * Seed script: Insert 2 job postings for BVM (Birla Vishvakarma Mahavidyalaya)
 *   - 1 on-campus drive  (approved, visible only to BVM students)
 *   - 1 off-campus job   (approved, visible to all students)
 * Both created for company: developerstripod@gmail.com
 * Both approved by TPO: Mehul Patel (instituteName = 'Birla Vishvakarma Mahavidyalaya')
 *
 * Run: node scripts/seedJobs.js
 */

const mongoose = require('mongoose');
const JobPosting = require('../models/JobPosting');
const Company = require('../models/Company');
const TPO = require('../models/TPO');

const MONGODB_DIRECT_URI =
    'mongodb://tripod:karanharshyash@ac-kauqk1j-shard-00-00.lb9dcwd.mongodb.net:27017,' +
    'ac-kauqk1j-shard-00-01.lb9dcwd.mongodb.net:27017,' +
    'ac-kauqk1j-shard-00-02.lb9dcwd.mongodb.net:27017/' +
    'elevate_odoo_mohali?ssl=true&replicaSet=atlas-rh3iy8-shard-0&authSource=admin&retryWrites=true&w=majority';

async function seed() {
    await mongoose.connect(MONGODB_DIRECT_URI, { family: 4 });
    console.log('✅ Connected to MongoDB');

    // ── Lookup company ──────────────────────────────────────────────────────────
    const company = await Company.findOne({ email: 'developerstripod@gmail.com' });
    if (!company) {
        console.error('❌ Company developerstripod@gmail.com not found in DB. Aborting.');
        process.exit(1);
    }
    console.log('✅ Company found:', company._id, company.email);

    // ── Lookup TPO ──────────────────────────────────────────────────────────────
    // Try by name first, then by instituteName
    let tpo = await TPO.findOne({ name: /mehul\s*patel/i });
    if (!tpo) {
        tpo = await TPO.findOne({ instituteName: /birla vishvakarma/i });
    }
    if (!tpo) {
        console.error('❌ TPO Mehul Patel / BVM not found in DB. Aborting.');
        process.exit(1);
    }
    console.log('✅ TPO found:', tpo._id, tpo.name, '|', tpo.instituteName);

    const BVM = 'Birla Vishvakarma Mahavidyalaya';
    const now = new Date();

    // ── 1. ON-CAMPUS job posting ────────────────────────────────────────────────
    const onCampus = new JobPosting({
        // Company & Job Basics
        companyName: company.companyName || 'Tripod Developer Solutions',
        companyWebsite: 'https://developerstripod.com',
        companyLogo: company.profilePicture || '',
        industry: 'IT/Software',
        companySize: 'startup',
        companyDescription: 'Tripod Developer Solutions is an innovative software company specialising in full-stack web applications, cloud consulting, and AI-powered product development.',
        companyLocation: 'Anand, Gujarat',
        jobTitle: 'Software Development Engineer (SDE-I)',
        department: 'Engineering',
        employmentType: 'full-time',
        jobCategory: 'technical',

        // Drive type – ON CAMPUS
        driveType: 'on_campus',
        targetBatches: ['2025', '2026'],
        eligibleDegrees: ['B.E.', 'B.Tech'],
        eligibleBranches: ['CSE', 'IT', 'AI&DS'],
        eligibilityCriteria: {
            minCgpaPercentage: { type: 'cgpa', value: 7.0 },
            backlogsAllowed: false,
            maxActiveBacklogs: 0,
            gapYearsAllowed: false,
        },
        targetColleges: [BVM],

        // Selection process
        totalRounds: 3,
        selectionRounds: [
            { roundNumber: 1, roundName: 'Online Aptitude Test', roundType: 'aptitude_test', duration: '60 min', mode: 'online', platform: 'HackerRank' },
            { roundNumber: 2, roundName: 'Technical Interview', roundType: 'technical_interview', duration: '45 min', mode: 'offline' },
            { roundNumber: 3, roundName: 'HR Interview', roundType: 'hr_interview', duration: '30 min', mode: 'offline' },
        ],

        // Compensation
        ctc: 600000,   // 6 LPA
        baseSalary: 550000,
        joiningBonus: 25000,
        otherBenefits: 'Health insurance, flexible WFH, annual team retreats',

        // Job details
        jobDescription:
            'We are looking for a passionate Software Development Engineer (SDE-I) to join our growing team. ' +
            'You will build scalable backend services, contribute to RESTful APIs, and collaborate with cross-functional teams on product features. ' +
            'This is a great opportunity for fresh graduates who want to make a real impact from day one. ' +
            'You will work with Node.js, React, MongoDB, and AWS cloud services in an agile environment.',
        requiredSkills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'REST APIs'],
        preferredSkills: ['TypeScript', 'Docker', 'AWS', 'Git'],
        experienceRequired: '0',
        numberOfOpenings: 5,
        workMode: 'office',
        workLocations: ['Anand, Gujarat'],

        // Dates
        applicationDeadline: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        tentativeDriveDate: new Date(now.getFullYear(), now.getMonth() + 1, 25),
        expectedJoiningDate: new Date(now.getFullYear(), now.getMonth() + 3, 1),

        // Drive logistics
        pptRequired: true,
        pptDetails: {
            dateTime: new Date(now.getFullYear(), now.getMonth() + 1, 20, 10, 0),
            duration: '1.5 hours',
            venue: 'Seminar Hall A, BVM Engineering College',
        },
        venueRequirements: 'A/C seminar hall for 200+ students with projector',
        expectedStudents: 80,

        // Application requirements
        resumeRequired: true,
        resumeFormat: 'pdf',
        coverLetterRequired: false,

        // Contact
        hrName: 'Priya Shah',
        contactEmail: 'hr@developerstripod.com',
        contactPhone: '+91-9876543210',

        // Status – APPROVED by TPO
        status: 'active',
        isActive: true,
        approvedBy: tpo._id,
        approvedAt: now,

        // Relationships
        company: company._id,
        createdBy: company._id,

        // Analytics defaults
        views: 0,
        applicationCount: 0,
    });

    // ── 2. OFF-CAMPUS job posting ───────────────────────────────────────────────
    const offCampus = new JobPosting({
        companyName: company.companyName || 'Tripod Developer Solutions',
        companyWebsite: 'https://developerstripod.com',
        companyLogo: company.profilePicture || '',
        industry: 'IT/Software',
        companySize: 'startup',
        companyDescription: 'Tripod Developer Solutions is an innovative software company specialising in full-stack web applications, cloud consulting, and AI-powered product development.',
        companyLocation: 'Remote (India)',
        jobTitle: 'Frontend Developer Intern',
        department: 'Engineering',
        employmentType: 'internship',
        jobCategory: 'technical',

        // Drive type – OFF CAMPUS (open to all)
        driveType: 'off_campus',
        targetBatches: ['2025', '2026', '2027'],
        eligibleDegrees: ['B.E.', 'B.Tech', 'BCA', 'MCA'],
        eligibleBranches: ['CSE', 'IT', 'ECE', 'AI&DS'],
        eligibilityCriteria: {
            minCgpaPercentage: { type: 'cgpa', value: 6.5 },
            backlogsAllowed: true,
            maxActiveBacklogs: 1,
            gapYearsAllowed: true,
        },

        totalRounds: 2,
        selectionRounds: [
            { roundNumber: 1, roundName: 'Coding Challenge', roundType: 'coding_round', duration: '90 min', mode: 'online', platform: 'HackerEarth' },
            { roundNumber: 2, roundName: 'Technical Interview', roundType: 'technical_interview', duration: '30 min', mode: 'online', platform: 'Google Meet' },
        ],

        // Compensation
        stipend: 15000,   // ₹15,000 / month
        ppoPossibility: 'performance_based',
        otherBenefits: 'Certificate of completion, PPO opportunity, remote-friendly',

        jobDescription:
            'Join Tripod Developer Solutions as a Frontend Developer Intern and gain hands-on experience building ' +
            'beautiful, responsive web applications. You will work closely with our design and engineering teams to ' +
            'implement UI components, integrate APIs, and improve performance across our products. ' +
            'We mentor interns actively and the best performers get a Pre-Placement Offer. ' +
            'Tech stack: React.js, Tailwind CSS, TypeScript, REST APIs.',
        requiredSkills: ['React.js', 'HTML', 'CSS', 'JavaScript', 'Git'],
        preferredSkills: ['Tailwind CSS', 'TypeScript', 'Figma'],
        experienceRequired: '0',
        numberOfOpenings: 3,
        workMode: 'remote',
        workLocations: ['Remote (India)'],

        internshipDuration: '6 months',

        applicationDeadline: new Date(now.getFullYear(), now.getMonth() + 1, 20),
        expectedJoiningDate: new Date(now.getFullYear(), now.getMonth() + 2, 1),

        // Application requirements
        resumeRequired: true,
        resumeFormat: 'pdf',
        coverLetterRequired: true,
        applicationPortalUrl: 'https://careers.developerstripod.com',
        howToApply: 'Apply through the portal above or email cv@developerstripod.com with subject "Frontend Intern Application"',

        hrName: 'Riya Mehta',
        contactEmail: 'cv@developerstripod.com',
        contactPhone: '+91-9988776655',

        // Status – APPROVED (off-campus, no TPO required but we stamp it for consistency)
        status: 'active',
        isActive: true,
        approvedBy: tpo._id,
        approvedAt: now,

        company: company._id,
        createdBy: company._id,

        views: 0,
        applicationCount: 0,
    });

    await onCampus.save();
    console.log(`✅ On-campus job created → jobId: ${onCampus.jobId} | "${onCampus.jobTitle}"`);

    await offCampus.save();
    console.log(`✅ Off-campus job created → jobId: ${offCampus.jobId} | "${offCampus.jobTitle}"`);

    console.log('\n🎉 Seed complete! Both jobs are active and ready in Browse Jobs.');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
