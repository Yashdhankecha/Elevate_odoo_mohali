const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
require('dotenv').config();

// Sample company data
const COMPANIES = [
  {
    email: "hr@techcorp.com",
    password: "techcorp123",
    role: "company",
    status: "active",
    isVerified: true,
    company: {
      companyName: "TechCorp Solutions",
      contactNumber: "+1-555-0101",
      industry: "Technology",
      companySize: "medium",
      website: "https://techcorp.com",
      description: "Leading technology solutions provider",
      location: "San Francisco, CA"
    }
  },
  {
    email: "hr@innovatesoft.com",
    password: "innovate123",
    role: "company",
    status: "active",
    isVerified: true,
    company: {
      companyName: "InnovateSoft",
      contactNumber: "+1-555-0202",
      industry: "Software Development",
      companySize: "large",
      website: "https://innovatesoft.com",
      description: "Innovative software development company",
      location: "Seattle, WA"
    }
  }
];

// Sample job data
const JOBS = [
  {
    title: "Senior Software Engineer",
    department: "Engineering",
    description: "We are looking for a Senior Software Engineer to join our team. You will be responsible for developing high-quality software solutions and mentoring junior developers.",
    requirements: [
      "5+ years of experience in software development",
      "Strong knowledge of JavaScript, React, Node.js",
      "Experience with cloud platforms (AWS, Azure)",
      "Excellent problem-solving skills",
      "Strong communication skills"
    ],
    location: "San Francisco, CA",
    salary: "$120,000 - $150,000",
    type: "full-time",
    status: "Active",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    tags: ["JavaScript", "React", "Node.js", "AWS"]
  },
  {
    title: "Frontend Developer",
    department: "Engineering",
    description: "Join our frontend team to create beautiful and responsive user interfaces. You will work with modern technologies and collaborate with designers and backend developers.",
    requirements: [
      "3+ years of frontend development experience",
      "Proficient in HTML, CSS, JavaScript",
      "Experience with React or Vue.js",
      "Knowledge of responsive design principles",
      "Familiarity with version control systems"
    ],
    location: "Remote",
    salary: "$80,000 - $100,000",
    type: "full-time",
    status: "Active",
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    tags: ["HTML", "CSS", "JavaScript", "React", "Vue.js"]
  },
  {
    title: "Data Analyst Intern",
    department: "Data Science",
    description: "Great opportunity for students to gain hands-on experience in data analysis. You will work with real data sets and learn industry-standard tools and techniques.",
    requirements: [
      "Currently pursuing a degree in Computer Science, Statistics, or related field",
      "Basic knowledge of Python or R",
      "Familiarity with SQL",
      "Strong analytical skills",
      "Eagerness to learn"
    ],
    location: "Seattle, WA",
    salary: "$25/hour",
    type: "internship",
    status: "Active",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    tags: ["Python", "R", "SQL", "Data Analysis"]
  },
  {
    title: "Product Manager",
    department: "Product",
    description: "Lead product development initiatives and work closely with engineering, design, and business teams to deliver exceptional user experiences.",
    requirements: [
      "5+ years of product management experience",
      "Strong analytical and strategic thinking",
      "Excellent communication and leadership skills",
      "Experience with agile methodologies",
      "Technical background preferred"
    ],
    location: "San Francisco, CA",
    salary: "$130,000 - $160,000",
    type: "full-time",
    status: "Active",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    tags: ["Product Management", "Agile", "Strategy", "Leadership"]
  },
  {
    title: "DevOps Engineer",
    department: "Operations",
    description: "Help us build and maintain our cloud infrastructure. You will work on automation, monitoring, and ensuring our systems are scalable and reliable.",
    requirements: [
      "3+ years of DevOps experience",
      "Experience with AWS, Docker, Kubernetes",
      "Knowledge of CI/CD pipelines",
      "Scripting skills (Python, Bash)",
      "Experience with monitoring tools"
    ],
    location: "Remote",
    salary: "$100,000 - $130,000",
    type: "full-time",
    status: "Active",
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD", "DevOps"]
  }
];

// Sample student data for applications
const STUDENTS = [
  {
    name: "John Smith",
    email: "john.smith@university.edu",
    phone: "+1-555-1001",
    education: "Bachelor's in Computer Science",
    experience: "2 years",
    skills: ["JavaScript", "React", "Node.js", "Python"]
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1-555-1002",
    education: "Master's in Data Science",
    experience: "1 year",
    skills: ["Python", "R", "SQL", "Machine Learning"]
  },
  {
    name: "Mike Chen",
    email: "mike.chen@university.edu",
    phone: "+1-555-1003",
    education: "Bachelor's in Software Engineering",
    experience: "3 years",
    skills: ["Java", "Spring", "AWS", "Docker"]
  },
  {
    name: "Emily Davis",
    email: "emily.davis@university.edu",
    phone: "+1-555-1004",
    education: "Bachelor's in Information Technology",
    experience: "1 year",
    skills: ["HTML", "CSS", "JavaScript", "React"]
  },
  {
    name: "David Wilson",
    email: "david.wilson@university.edu",
    phone: "+1-555-1005",
    education: "Master's in Business Administration",
    experience: "4 years",
    skills: ["Product Management", "Agile", "Strategy", "Leadership"]
  }
];

// Sample interview data
const INTERVIEWS = [
  {
    candidate: "John Smith",
    role: "Senior Software Engineer",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    time: "10:00 AM",
    type: "Technical",
    interviewer: "Sarah Tech Lead",
    location: "Virtual (Zoom)",
    duration: "60",
    notes: "Focus on system design and coding challenges",
    status: "Scheduled"
  },
  {
    candidate: "Sarah Johnson",
    role: "Data Analyst Intern",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    time: "2:00 PM",
    type: "HR Round",
    interviewer: "HR Manager",
    location: "Office - Conference Room A",
    duration: "45",
    notes: "Discuss internship requirements and expectations",
    status: "Scheduled"
  },
  {
    candidate: "Mike Chen",
    role: "DevOps Engineer",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    time: "11:30 AM",
    type: "Technical",
    interviewer: "DevOps Lead",
    location: "Virtual (Teams)",
    duration: "90",
    notes: "Infrastructure and automation discussion",
    status: "Scheduled"
  }
];

const seedCompanyData = async () => {
  try {
    console.log('🌱 Starting company data seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing company data...');
    await User.deleteMany({ role: 'company' });
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create companies
    console.log('🏢 Creating companies...');
    const createdCompanies = [];
    for (const companyData of COMPANIES) {
      const company = new User(companyData);
      const savedCompany = await company.save();
      createdCompanies.push(savedCompany);
      console.log(`✅ Created company: ${savedCompany.company.companyName}`);
    }

    // Create jobs for each company
    console.log('💼 Creating jobs...');
    const createdJobs = [];
    for (let i = 0; i < JOBS.length; i++) {
      const jobData = JOBS[i];
      const company = createdCompanies[i % createdCompanies.length];
      
      const job = new Job({
        ...jobData,
        company: company._id
      });
      
      const savedJob = await job.save();
      createdJobs.push(savedJob);
      console.log(`✅ Created job: ${savedJob.title} at ${company.company.companyName}`);
    }

    // Create applications
    console.log('📝 Creating applications...');
    const applicationStatuses = ['pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected'];
    let applicationCount = 0;
    
    for (const job of createdJobs) {
      // Each job gets 2-4 applications
      const numApplications = Math.floor(Math.random() * 3) + 2;
      const selectedStudents = STUDENTS.sort(() => 0.5 - Math.random()).slice(0, numApplications);
      
      for (const student of selectedStudents) {
        const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
        const appliedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in last 30 days

        const application = new Application({
          job: job._id,
          applicant: student._id || new mongoose.Types.ObjectId(), // Create a dummy ID if student doesn't exist
          company: job.company,
          status: status,
          coverLetter: `I am excited to apply for the ${job.title} position at ${createdCompanies.find(c => c._id.equals(job.company))?.company.companyName}. I believe my skills and experience make me a strong candidate for this role. I am particularly interested in ${job.department} and would love to contribute to your team.`,
          appliedAt: appliedDate,
          feedback: status === 'rejected' ? 'Thank you for your application. We have decided to move forward with other candidates.' : null,
          salaryExpectation: {
            amount: Math.floor(Math.random() * 50000) + 50000,
            currency: 'USD'
          }
        });
        
        await application.save();
        applicationCount++;
        
        // Add application to job
        job.applications.push(application._id);
        await job.save();
      }
    }
    console.log(`✅ Created ${applicationCount} applications`);

    // Create interviews
    console.log('📅 Creating interviews...');
    for (const interviewData of INTERVIEWS) {
      const job = createdJobs.find(j => j.title.includes(interviewData.role.split(' ')[0]));
      if (job) {
        const interview = new Interview({
          company: job.company,
          candidate: interviewData.candidate,
          role: interviewData.role,
          date: interviewData.date,
          time: interviewData.time,
          type: interviewData.type,
          interviewer: interviewData.interviewer,
          location: interviewData.location,
          duration: interviewData.duration,
          notes: interviewData.notes,
          status: interviewData.status
        });
        
        await interview.save();
        console.log(`✅ Created interview: ${interview.candidate} for ${interview.role}`);
      }
    }

    console.log('\n=== COMPANY DATA SEEDING SUMMARY ===');
    console.log(`🏢 Companies Created: ${createdCompanies.length}`);
    console.log(`💼 Jobs Created: ${createdJobs.length}`);
    console.log(`📝 Applications Created: ${applicationCount}`);
    console.log(`📅 Interviews Created: ${INTERVIEWS.length}`);

    console.log('\n=== LOGIN CREDENTIALS ===');
    createdCompanies.forEach(company => {
      console.log(`${company.company.companyName}: ${company.email} / ${company.password}`);
    });

    console.log('\n✅ Company data seeding completed successfully!');
    console.log('🚀 The company portal is now ready with sample data for testing.');

  } catch (error) {
    console.error('❌ Error seeding company data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seeding
seedCompanyData();
