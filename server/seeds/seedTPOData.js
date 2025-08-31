const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');
const Student = require('../models/Student');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// TPO Institute Data
const TPO_INSTITUTE = {
  name: "Tech Excellence College",
  location: "Mohali, Punjab",
  type: "college"
};

// TPO User Data
const TPO_USER = {
  email: "tp1@college.edu",
  password: "tpo123456",
  name: "Dr. Rajesh Kumar",
  role: "tpo",
  status: "active",
  isVerified: true,
  designation: "Training & Placement Officer",
  department: "Placement Cell",
  instituteName: TPO_INSTITUTE.name,
  contactNumber: "+91-9876543210",
  address: {
    street: "Sector 67",
    city: "Mohali",
    state: "Punjab",
    country: "India",
    zipCode: "160062"
  },
  totalStudents: 450,
  placedStudents: 320,
  averagePackage: 6.5,
  highestPackage: 12.0,
  placementStats: [
    { year: 2022, totalStudents: 400, placedStudents: 280, averagePackage: 5.8, highestPackage: 10.5 },
    { year: 2023, totalStudents: 420, placedStudents: 300, averagePackage: 6.2, highestPackage: 11.2 },
    { year: 2024, totalStudents: 450, placedStudents: 320, averagePackage: 6.5, highestPackage: 12.0 }
  ]
};

// Student Data for TPO's Institute
const STUDENTS_DATA = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@college.edu",
    password: "student123",
    rollNumber: "CS2024001",
    branch: "Computer Science",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 8.9,
    phoneNumber: "+91-9876543201",
    skills: [
      { name: "JavaScript", proficiency: "Advanced" },
      { name: "React", proficiency: "Advanced" },
      { name: "Node.js", proficiency: "Intermediate" },
      { name: "Python", proficiency: "Advanced" }
    ],
    isPlaced: true,
    placementDetails: {
      company: "TechCorp Solutions",
      package: { amount: 850000, currency: "INR", type: "CTC" },
      role: "Software Engineer",
      location: "Bangalore",
      placementDate: new Date("2024-01-15")
    }
  },
  {
    name: "Priya Patel",
    email: "priya.patel@college.edu",
    password: "student123",
    rollNumber: "IT2024002",
    branch: "Information Technology",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 9.2,
    phoneNumber: "+91-9876543202",
    skills: [
      { name: "Java", proficiency: "Advanced" },
      { name: "Spring Boot", proficiency: "Advanced" },
      { name: "MySQL", proficiency: "Intermediate" },
      { name: "Docker", proficiency: "Intermediate" }
    ],
    isPlaced: true,
    placementDetails: {
      company: "InnovateTech",
      package: { amount: 920000, currency: "INR", type: "CTC" },
      role: "Backend Developer",
      location: "Mumbai",
      placementDate: new Date("2024-01-20")
    }
  },
  {
    name: "Rahul Verma",
    email: "rahul.verma@college.edu",
    password: "student123",
    rollNumber: "EC2024003",
    branch: "Electronics & Communication",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 8.5,
    phoneNumber: "+91-9876543203",
    skills: [
      { name: "VLSI Design", proficiency: "Advanced" },
      { name: "Verilog", proficiency: "Intermediate" },
      { name: "PCB Design", proficiency: "Intermediate" },
      { name: "MATLAB", proficiency: "Advanced" }
    ],
    isPlaced: true,
    placementDetails: {
      company: "ElectroTech Systems",
      package: { amount: 780000, currency: "INR", type: "CTC" },
      role: "Hardware Engineer",
      location: "Pune",
      placementDate: new Date("2024-02-01")
    }
  },
  {
    name: "Ananya Singh",
    email: "ananya.singh@college.edu",
    password: "student123",
    rollNumber: "ME2024004",
    branch: "Mechanical Engineering",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 8.7,
    phoneNumber: "+91-9876543204",
    skills: [
      { name: "AutoCAD", proficiency: "Advanced" },
      { name: "SolidWorks", proficiency: "Advanced" },
      { name: "ANSYS", proficiency: "Intermediate" },
      { name: "Manufacturing", proficiency: "Intermediate" }
    ],
    isPlaced: false
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.malhotra@college.edu",
    password: "student123",
    rollNumber: "CS2024005",
    branch: "Computer Science",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 7.8,
    phoneNumber: "+91-9876543205",
    skills: [
      { name: "C++", proficiency: "Advanced" },
      { name: "Data Structures", proficiency: "Advanced" },
      { name: "Algorithms", proficiency: "Intermediate" },
      { name: "Machine Learning", proficiency: "Beginner" }
    ],
    isPlaced: false
  },
  {
    name: "Zara Khan",
    email: "zara.khan@college.edu",
    password: "student123",
    rollNumber: "IT2024006",
    branch: "Information Technology",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 9.0,
    phoneNumber: "+91-9876543206",
    skills: [
      { name: "Python", proficiency: "Advanced" },
      { name: "Data Science", proficiency: "Advanced" },
      { name: "SQL", proficiency: "Advanced" },
      { name: "Tableau", proficiency: "Intermediate" }
    ],
    isPlaced: true,
    placementDetails: {
      company: "DataAnalytics Pro",
      package: { amount: 950000, currency: "INR", type: "CTC" },
      role: "Data Scientist",
      location: "Hyderabad",
      placementDate: new Date("2024-02-10")
    }
  },
  {
    name: "Arjun Reddy",
    email: "arjun.reddy@college.edu",
    password: "student123",
    rollNumber: "EC2024007",
    branch: "Electronics & Communication",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 8.2,
    phoneNumber: "+91-9876543207",
    skills: [
      { name: "Digital Signal Processing", proficiency: "Advanced" },
      { name: "Communication Systems", proficiency: "Intermediate" },
      { name: "Embedded Systems", proficiency: "Intermediate" },
      { name: "C Programming", proficiency: "Advanced" }
    ],
    isPlaced: false
  },
  {
    name: "Ishita Gupta",
    email: "ishita.gupta@college.edu",
    password: "student123",
    rollNumber: "ME2024008",
    branch: "Mechanical Engineering",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 8.4,
    phoneNumber: "+91-9876543208",
    skills: [
      { name: "Thermodynamics", proficiency: "Advanced" },
      { name: "Fluid Mechanics", proficiency: "Intermediate" },
      { name: "CAD/CAM", proficiency: "Advanced" },
      { name: "Robotics", proficiency: "Beginner" }
    ],
    isPlaced: false
  },
  {
    name: "Karan Mehta",
    email: "karan.mehta@college.edu",
    password: "student123",
    rollNumber: "CS2024009",
    branch: "Computer Science",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 8.6,
    phoneNumber: "+91-9876543209",
    skills: [
      { name: "Full Stack Development", proficiency: "Advanced" },
      { name: "MongoDB", proficiency: "Intermediate" },
      { name: "AWS", proficiency: "Beginner" },
      { name: "DevOps", proficiency: "Beginner" }
    ],
    isPlaced: true,
    placementDetails: {
      company: "CloudTech Solutions",
      package: { amount: 880000, currency: "INR", type: "CTC" },
      role: "Full Stack Developer",
      location: "Chennai",
      placementDate: new Date("2024-02-15")
    }
  },
  {
    name: "Neha Sharma",
    email: "neha.sharma@college.edu",
    password: "student123",
    rollNumber: "IT2024010",
    branch: "Information Technology",
    graduationYear: 2024,
    collegeName: TPO_INSTITUTE.name,
    semester: 8,
    cgpa: 8.8,
    phoneNumber: "+91-9876543210",
    skills: [
      { name: "Cybersecurity", proficiency: "Advanced" },
      { name: "Network Security", proficiency: "Intermediate" },
      { name: "Ethical Hacking", proficiency: "Intermediate" },
      { name: "Linux", proficiency: "Advanced" }
    ],
    isPlaced: false
  }
];

// Company Data
const COMPANIES_DATA = [
  {
    companyName: "TechCorp Solutions",
    email: "hr@techcorp.com",
    password: "company123",
    contactNumber: "+91-9876543301",
    industry: "Information Technology",
    companySize: "large",
    website: "https://techcorp.com",
    description: "Leading software development company specializing in enterprise solutions",
    address: {
      street: "Tech Park, Phase 1",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      zipCode: "560001"
    },
    status: "active",
    isVerified: true
  },
  {
    companyName: "InnovateTech",
    email: "careers@innovatetech.com",
    password: "company123",
    contactNumber: "+91-9876543302",
    industry: "Software Development",
    companySize: "medium",
    website: "https://innovatetech.com",
    description: "Innovative technology company focused on cutting-edge solutions",
    address: {
      street: "Innovation Hub",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400001"
    },
    status: "active",
    isVerified: true
  },
  {
    companyName: "ElectroTech Systems",
    email: "hr@electrotech.com",
    password: "company123",
    contactNumber: "+91-9876543303",
    industry: "Electronics",
    companySize: "large",
    website: "https://electrotech.com",
    description: "Electronics manufacturing and design company",
    address: {
      street: "Electronics Zone",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      zipCode: "411001"
    },
    status: "active",
    isVerified: true
  },
  {
    companyName: "DataAnalytics Pro",
    email: "jobs@dataanalyticspro.com",
    password: "company123",
    contactNumber: "+91-9876543304",
    industry: "Data Science",
    companySize: "medium",
    website: "https://dataanalyticspro.com",
    description: "Data analytics and business intelligence solutions",
    address: {
      street: "Data Center",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      zipCode: "500001"
    },
    status: "active",
    isVerified: true
  },
  {
    companyName: "CloudTech Solutions",
    email: "careers@cloudtech.com",
    password: "company123",
    contactNumber: "+91-9876543305",
    industry: "Cloud Computing",
    companySize: "large",
    website: "https://cloudtech.com",
    description: "Cloud infrastructure and platform services",
    address: {
      street: "Cloud Campus",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      zipCode: "600001"
    },
    status: "active",
    isVerified: true
  },
  {
    companyName: "StartupXYZ",
    email: "hr@startupxyz.com",
    password: "company123",
    contactNumber: "+91-9876543306",
    industry: "E-commerce",
    companySize: "startup",
    website: "https://startupxyz.com",
    description: "Innovative e-commerce startup",
    address: {
      street: "Startup Hub",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      zipCode: "110001"
    },
    status: "active",
    isVerified: true
  }
];

// Job Postings Data
const JOBS_DATA = [
  {
    title: "Software Engineer - Full Stack",
    description: "We are looking for a talented Full Stack Developer to join our team. The ideal candidate should have experience with modern web technologies and frameworks.",
    requirements: [
      "Strong knowledge of JavaScript, React, Node.js",
      "Experience with databases (SQL/NoSQL)",
      "Understanding of RESTful APIs",
      "Knowledge of version control systems (Git)",
      "Good problem-solving skills"
    ],
    location: "Bangalore",
    type: "full-time",
    salary: { min: 800000, max: 1200000, currency: "INR" },
    status: "active",
    deadline: new Date("2024-03-15"),
    tags: ["JavaScript", "React", "Node.js", "Full Stack"]
  },
  {
    title: "Backend Developer",
    description: "Join our backend development team to build scalable and robust server-side applications.",
    requirements: [
      "Proficiency in Java and Spring Boot",
      "Experience with microservices architecture",
      "Knowledge of database design and optimization",
      "Understanding of cloud platforms (AWS/Azure)",
      "Experience with Docker and Kubernetes"
    ],
    location: "Mumbai",
    type: "full-time",
    salary: { min: 700000, max: 1100000, currency: "INR" },
    status: "active",
    deadline: new Date("2024-03-20"),
    tags: ["Java", "Spring Boot", "Microservices", "Backend"]
  },
  {
    title: "Hardware Engineer",
    description: "Design and develop electronic hardware systems for our products.",
    requirements: [
      "Experience in VLSI design and verification",
      "Knowledge of PCB design tools",
      "Understanding of digital and analog circuits",
      "Experience with hardware testing and validation",
      "Knowledge of industry standards and protocols"
    ],
    location: "Pune",
    type: "full-time",
    salary: { min: 600000, max: 900000, currency: "INR" },
    status: "active",
    deadline: new Date("2024-03-25"),
    tags: ["VLSI", "Hardware", "PCB Design", "Electronics"]
  },
  {
    title: "Data Scientist",
    description: "Join our data science team to develop machine learning models and analytics solutions.",
    requirements: [
      "Strong background in statistics and mathematics",
      "Experience with Python, R, or similar languages",
      "Knowledge of machine learning algorithms",
      "Experience with data visualization tools",
      "Understanding of big data technologies"
    ],
    location: "Hyderabad",
    type: "full-time",
    salary: { min: 800000, max: 1300000, currency: "INR" },
    status: "active",
    deadline: new Date("2024-03-30"),
    tags: ["Data Science", "Machine Learning", "Python", "Analytics"]
  },
  {
    title: "Full Stack Developer",
    description: "Build end-to-end web applications using modern technologies.",
    requirements: [
      "Experience with frontend frameworks (React/Angular/Vue)",
      "Backend development experience (Node.js/Python/Java)",
      "Database design and management",
      "Understanding of cloud platforms",
      "Experience with CI/CD pipelines"
    ],
    location: "Chennai",
    type: "full-time",
    salary: { min: 700000, max: 1100000, currency: "INR" },
    status: "active",
    deadline: new Date("2024-04-05"),
    tags: ["Full Stack", "React", "Node.js", "Cloud"]
  },
  {
    title: "Software Developer Intern",
    description: "Summer internship opportunity for students to gain hands-on experience in software development.",
    requirements: [
      "Currently pursuing Computer Science or related degree",
      "Basic knowledge of programming languages",
      "Good academic record",
      "Eagerness to learn new technologies",
      "Strong communication skills"
    ],
    location: "Delhi",
    type: "internship",
    salary: { min: 25000, max: 40000, currency: "INR" },
    status: "active",
    deadline: new Date("2024-04-10"),
    tags: ["Internship", "Software Development", "Learning"]
  },
  {
    title: "DevOps Engineer",
    description: "Help us build and maintain our cloud infrastructure and deployment pipelines.",
    requirements: [
      "Experience with cloud platforms (AWS/Azure/GCP)",
      "Knowledge of containerization (Docker, Kubernetes)",
      "Experience with CI/CD tools",
      "Understanding of infrastructure as code",
      "Linux system administration skills"
    ],
    location: "Bangalore",
    type: "full-time",
    salary: { min: 800000, max: 1200000, currency: "INR" },
    status: "active",
    deadline: new Date("2024-04-15"),
    tags: ["DevOps", "Cloud", "Docker", "Kubernetes"]
  },
  {
    title: "Cybersecurity Analyst",
    description: "Protect our systems and data from cyber threats and vulnerabilities.",
    requirements: [
      "Knowledge of cybersecurity principles and practices",
      "Experience with security tools and technologies",
      "Understanding of network security",
      "Knowledge of compliance standards",
      "Incident response experience"
    ],
    location: "Mumbai",
    type: "full-time",
    salary: { min: 600000, max: 1000000, currency: "INR" },
    status: "active",
    deadline: new Date("2024-04-20"),
    tags: ["Cybersecurity", "Network Security", "Compliance"]
  }
];

// Training Programs Data
const TRAINING_PROGRAMS = [
  {
    name: "Technical Interview Preparation",
    description: "Comprehensive training program to prepare students for technical interviews",
    duration: "4 weeks",
    participants: 45,
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    topics: ["Data Structures", "Algorithms", "System Design", "Coding Practice"],
    instructor: "Prof. Amit Kumar",
    location: "Computer Lab 1"
  },
  {
    name: "Soft Skills Development",
    description: "Training program focused on communication, leadership, and interpersonal skills",
    duration: "3 weeks",
    participants: 32,
    status: "Active",
    startDate: "2024-01-20",
    endDate: "2024-02-10",
    topics: ["Communication Skills", "Leadership", "Team Work", "Presentation Skills"],
    instructor: "Dr. Priya Sharma",
    location: "Conference Hall"
  },
  {
    name: "Resume Building Workshop",
    description: "Learn to create compelling resumes that stand out to recruiters",
    duration: "2 weeks",
    participants: 28,
    status: "Active",
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    topics: ["Resume Writing", "Cover Letters", "LinkedIn Profile", "Portfolio Building"],
    instructor: "Ms. Ritu Verma",
    location: "Career Center"
  },
  {
    name: "Mock Interview Sessions",
    description: "Practice interviews with industry professionals and get feedback",
    duration: "Ongoing",
    participants: 60,
    status: "Active",
    startDate: "2024-01-10",
    endDate: "2024-03-30",
    topics: ["Technical Interviews", "HR Interviews", "Behavioral Questions", "Feedback Sessions"],
    instructor: "Industry Experts",
    location: "Interview Rooms"
  }
];

// Notifications Data
const NOTIFICATIONS_DATA = [
  {
    title: "New Placement Drive Announced",
    message: "TechCorp Solutions is coming for campus recruitment on March 15th. All eligible students are encouraged to apply.",
    type: "job",
    actionLink: "/placement-drives"
  },
  {
    title: "Training Program Registration Open",
    message: "Registration for Technical Interview Preparation program is now open. Limited seats available.",
    type: "system",
    actionLink: "/training-programs"
  },
  {
    title: "Resume Submission Deadline",
    message: "Last date to submit updated resumes for upcoming placement drives is March 10th.",
    type: "reminder",
    actionLink: "/students"
  },
  {
    title: "Mock Interview Schedule",
    message: "Mock interview sessions for final year students will begin from next week. Please check the schedule.",
    type: "interview",
    actionLink: "/training-programs"
  },
  {
    title: "Company Visit Confirmed",
    message: "InnovateTech will be visiting campus on March 20th for pre-placement talk and interviews.",
    type: "job",
    actionLink: "/companies"
  }
];

// Main seeding function
const seedTPOData = async () => {
  try {
    console.log('Starting TPO data seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({ role: 'tpo' });
    await User.deleteMany({ role: 'student', 'student.collegeName': TPO_INSTITUTE.name });
    await Company.deleteMany({});
    await Job.deleteMany({});
    await JobPosting.deleteMany({});
    await JobApplication.deleteMany({});
    await Notification.deleteMany({});

    // Create TPO User
    console.log('Creating TPO user...');
    const tpoUser = new User({
      email: TPO_USER.email,
      password: TPO_USER.password,
      name: TPO_USER.name,
      role: TPO_USER.role,
      status: TPO_USER.status,
      isVerified: TPO_USER.isVerified,
      tpo: {
        name: TPO_USER.name,
        instituteName: TPO_USER.instituteName,
        contactNumber: TPO_USER.contactNumber,
        designation: TPO_USER.designation,
        department: TPO_USER.department,
        location: TPO_USER.address.city
      }
    });
    await tpoUser.save();
    console.log('TPO user created successfully');

    // Create Students
    console.log('Creating students...');
    const createdStudents = [];
    for (const studentData of STUDENTS_DATA) {
      const student = new User({
        email: studentData.email,
        password: studentData.password,
        name: studentData.name,
        role: 'student',
        status: 'active',
        isVerified: true,
        student: {
          name: studentData.name,
          rollNumber: studentData.rollNumber,
          branch: studentData.branch,
          graduationYear: studentData.graduationYear,
          collegeName: studentData.collegeName,
          cgpa: studentData.cgpa,
          isPlaced: studentData.isPlaced,
          placementDetails: studentData.placementDetails,
          skills: studentData.skills,
          phoneNumber: studentData.phoneNumber
        }
      });
      const savedStudent = await student.save();
      createdStudents.push(savedStudent);
    }
    console.log(`${createdStudents.length} students created successfully`);

    // Create Companies
    console.log('Creating companies...');
    const createdCompanies = [];
    for (const companyData of COMPANIES_DATA) {
      const company = new Company({
        companyName: companyData.companyName,
        email: companyData.email,
        password: companyData.password,
        contactNumber: companyData.contactNumber,
        industry: companyData.industry,
        companySize: companyData.companySize,
        website: companyData.website,
        description: companyData.description,
        address: companyData.address,
        status: companyData.status,
        isVerified: companyData.isVerified
      });
      const savedCompany = await company.save();
      createdCompanies.push(savedCompany);
    }
    console.log(`${createdCompanies.length} companies created successfully`);

    // Create Job Postings
    console.log('Creating job postings...');
    const createdJobPostings = [];
    for (let i = 0; i < JOBS_DATA.length; i++) {
      const jobData = JOBS_DATA[i];
      const company = createdCompanies[i % createdCompanies.length];
      
      const jobPosting = new JobPosting({
        company: company._id,
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        location: jobData.location,
        type: jobData.type,
        package: jobData.salary,
        isActive: jobData.status === 'active',
        deadline: jobData.deadline,
        skills: jobData.tags
      });
      const savedJobPosting = await jobPosting.save();
      createdJobPostings.push(savedJobPosting);
    }
    console.log(`${createdJobPostings.length} job postings created successfully`);

    // Create Job Applications
    console.log('Creating job applications...');
    const applicationStatuses = ['applied', 'test_scheduled', 'test_completed', 'interview_scheduled', 'interview_completed', 'offer_received', 'rejected', 'withdrawn'];
    let applicationCount = 0;

    for (const student of createdStudents) {
      // Each student applies to 2-4 jobs
      const numApplications = Math.floor(Math.random() * 3) + 2;
      const selectedJobPostings = createdJobPostings.sort(() => 0.5 - Math.random()).slice(0, numApplications);

      for (const jobPosting of selectedJobPostings) {
        const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
        const appliedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in last 30 days

        const application = new JobApplication({
          student: student._id,
          jobPosting: jobPosting._id,
          company: jobPosting.company,
          status: status,
          appliedDate: appliedDate,
          coverLetter: `I am excited to apply for the ${jobPosting.title} position at ${createdCompanies.find(c => c._id.equals(jobPosting.company))?.companyName}. I believe my skills and experience make me a strong candidate for this role.`,
          resume: `resume_${student.student.rollNumber}.pdf`
        });
        await application.save();
        applicationCount++;
      }
    }
    console.log(`${applicationCount} job applications created successfully`);

    // Create Notifications
    console.log('Creating notifications...');
    for (const notificationData of NOTIFICATIONS_DATA) {
      const notification = new Notification({
        recipient: tpoUser._id,
        sender: tpoUser._id,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        actionLink: notificationData.actionLink,
        isRead: Math.random() > 0.5 // Random read status
      });
      await notification.save();
    }
    console.log(`${NOTIFICATIONS_DATA.length} notifications created successfully`);

    // Create notifications for students
    for (const student of createdStudents) {
      const studentNotification = new Notification({
        recipient: student._id,
        sender: tpoUser._id,
        title: "Welcome to Placement Portal",
        message: `Welcome ${student.name}! Your profile has been successfully created. Please complete your profile and upload your resume.`,
        type: "system",
        actionLink: "/profile"
      });
      await studentNotification.save();
    }

    console.log('TPO data seeding completed successfully!');
    console.log('\n=== SEEDING SUMMARY ===');
    console.log(`TPO User: ${tpoUser.email}`);
    console.log(`Students Created: ${createdStudents.length}`);
    console.log(`Companies Created: ${createdCompanies.length}`);
    console.log(`Job Postings Created: ${createdJobPostings.length}`);
    console.log(`Job Applications Created: ${applicationCount}`);
    console.log(`Notifications Created: ${NOTIFICATIONS_DATA.length + createdStudents.length}`);
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log(`TPO Login: ${tpoUser.email} / ${TPO_USER.password}`);
    console.log(`Student Login: ${createdStudents[0].email} / student123`);
    console.log(`Company Login: ${createdCompanies[0].email} / company123`);

  } catch (error) {
    console.error('Error seeding TPO data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding
if (require.main === module) {
  connectDB().then(() => {
    seedTPOData();
  });
}

module.exports = { seedTPOData, TPO_USER, STUDENTS_DATA, COMPANIES_DATA, JOBS_DATA };
