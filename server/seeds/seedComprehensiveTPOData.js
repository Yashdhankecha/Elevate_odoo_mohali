const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');

// Configuration
const TPO_INSTITUTE = {
  name: "Chandigarh University",
  location: "Mohali, Punjab",
  type: "Private University",
  established: 2012
};

const TPO_USER = {
  email: "tp1@college.edu",
  password: "tpo123456",
  name: "Dr. Rajesh Kumar",
  role: "tpo",
  tpo: {
    name: "Dr. Rajesh Kumar",
    instituteName: TPO_INSTITUTE.name,
    contactNumber: "+91-9876543210",
    designation: "Training & Placement Officer",
    department: "Computer Science & Engineering",
    location: TPO_INSTITUTE.location
  }
};

// Comprehensive student data
const STUDENTS_DATA = [
  // Computer Science Students
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@cu.edu.in",
    rollNumber: "CSE2021001",
    branch: "Computer Science",
    cgpa: 8.9,
    skills: ["Java", "Python", "React", "Node.js", "MongoDB"],
    isPlaced: true,
    placementDetails: {
      company: "Google",
      package: { amount: 1800000, currency: "INR", type: "CTC" },
      role: "Software Engineer",
      placementDate: new Date("2024-01-15")
    }
  },
  {
    name: "Priya Patel",
    email: "priya.patel@cu.edu.in",
    rollNumber: "CSE2021002",
    branch: "Computer Science",
    cgpa: 9.2,
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "AWS"],
    isPlaced: true,
    placementDetails: {
      company: "Microsoft",
      package: { amount: 1600000, currency: "INR", type: "CTC" },
      role: "Data Scientist",
      placementDate: new Date("2024-01-20")
    }
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@cu.edu.in",
    rollNumber: "CSE2021003",
    branch: "Computer Science",
    cgpa: 7.8,
    skills: ["JavaScript", "React", "Angular", "Node.js", "Express"],
    isPlaced: true,
    placementDetails: {
      company: "Amazon",
      package: { amount: 1400000, currency: "INR", type: "CTC" },
      role: "Frontend Developer",
      placementDate: new Date("2024-02-01")
    }
  },
  {
    name: "Ananya Reddy",
    email: "ananya.reddy@cu.edu.in",
    rollNumber: "CSE2021004",
    branch: "Computer Science",
    cgpa: 8.5,
    skills: ["Java", "Spring Boot", "Hibernate", "MySQL", "Docker"],
    isPlaced: false
  },
  {
    name: "Rahul Verma",
    email: "rahul.verma@cu.edu.in",
    rollNumber: "CSE2021005",
    branch: "Computer Science",
    cgpa: 7.2,
    skills: ["C++", "Data Structures", "Algorithms", "Python", "Git"],
    isPlaced: false
  },
  // Information Technology Students
  {
    name: "Zara Khan",
    email: "zara.khan@cu.edu.in",
    rollNumber: "IT2021001",
    branch: "Information Technology",
    cgpa: 8.7,
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Celery"],
    isPlaced: true,
    placementDetails: {
      company: "Infosys",
      package: { amount: 1200000, currency: "INR", type: "CTC" },
      role: "Backend Developer",
      placementDate: new Date("2024-01-25")
    }
  },
  {
    name: "Aditya Joshi",
    email: "aditya.joshi@cu.edu.in",
    rollNumber: "IT2021002",
    branch: "Information Technology",
    cgpa: 8.1,
    skills: ["Java", "Spring", "Microservices", "Kubernetes", "Jenkins"],
    isPlaced: true,
    placementDetails: {
      company: "TCS",
      package: { amount: 1100000, currency: "INR", type: "CTC" },
      role: "DevOps Engineer",
      placementDate: new Date("2024-02-05")
    }
  },
  {
    name: "Meera Iyer",
    email: "meera.iyer@cu.edu.in",
    rollNumber: "IT2021003",
    branch: "Information Technology",
    cgpa: 7.9,
    skills: ["JavaScript", "Vue.js", "Node.js", "MongoDB", "AWS"],
    isPlaced: false
  },
  // Electronics & Communication Students
  {
    name: "Karan Malhotra",
    email: "karan.malhotra@cu.edu.in",
    rollNumber: "ECE2021001",
    branch: "Electronics & Communication",
    cgpa: 8.3,
    skills: ["VLSI", "Verilog", "FPGA", "MATLAB", "Python"],
    isPlaced: true,
    placementDetails: {
      company: "Intel",
      package: { amount: 1300000, currency: "INR", type: "CTC" },
      role: "VLSI Design Engineer",
      placementDate: new Date("2024-01-30")
    }
  },
  {
    name: "Sneha Gupta",
    email: "sneha.gupta@cu.edu.in",
    rollNumber: "ECE2021002",
    branch: "Electronics & Communication",
    cgpa: 7.6,
    skills: ["Embedded Systems", "C", "ARM", "RTOS", "IoT"],
    isPlaced: false
  },
  // Mechanical Engineering Students
  {
    name: "Arjun Kapoor",
    email: "arjun.kapoor@cu.edu.in",
    rollNumber: "MECH2021001",
    branch: "Mechanical Engineering",
    cgpa: 8.0,
    skills: ["AutoCAD", "SolidWorks", "ANSYS", "MATLAB", "CNC"],
    isPlaced: true,
    placementDetails: {
      company: "Maruti Suzuki",
      package: { amount: 900000, currency: "INR", type: "CTC" },
      role: "Design Engineer",
      placementDate: new Date("2024-02-10")
    }
  },
  {
    name: "Pooja Sharma",
    email: "pooja.sharma@cu.edu.in",
    rollNumber: "MECH2021002",
    branch: "Mechanical Engineering",
    cgpa: 7.4,
    skills: ["CATIA", "Pro-E", "Thermal Analysis", "Fluid Dynamics"],
    isPlaced: false
  },
  // Civil Engineering Students
  {
    name: "Rohan Desai",
    email: "rohan.desai@cu.edu.in",
    rollNumber: "CIVIL2021001",
    branch: "Civil Engineering",
    cgpa: 7.8,
    skills: ["AutoCAD", "STAAD Pro", "ETABS", "Primavera", "Revit"],
    isPlaced: true,
    placementDetails: {
      company: "L&T Construction",
      package: { amount: 800000, currency: "INR", type: "CTC" },
      role: "Site Engineer",
      placementDate: new Date("2024-02-15")
    }
  },
  {
    name: "Tanvi Patel",
    email: "tanvi.patel@cu.edu.in",
    rollNumber: "CIVIL2021002",
    branch: "Civil Engineering",
    cgpa: 7.2,
    skills: ["AutoCAD", "Structural Analysis", "Concrete Design", "Surveying"],
    isPlaced: false
  },
  // Electrical Engineering Students
  {
    name: "Dev Kumar",
    email: "dev.kumar@cu.edu.in",
    rollNumber: "EEE2021001",
    branch: "Electrical Engineering",
    cgpa: 8.2,
    skills: ["PLC", "SCADA", "MATLAB", "Simulink", "Power Systems"],
    isPlaced: true,
    placementDetails: {
      company: "BHEL",
      package: { amount: 950000, currency: "INR", type: "CTC" },
      role: "Electrical Engineer",
      placementDate: new Date("2024-02-20")
    }
  },
  {
    name: "Ishita Singh",
    email: "ishita.singh@cu.edu.in",
    rollNumber: "EEE2021002",
    branch: "Electrical Engineering",
    cgpa: 7.5,
    skills: ["Power Electronics", "Control Systems", "Electric Drives", "MATLAB"],
    isPlaced: false
  }
];

// Comprehensive company data
const COMPANIES_DATA = [
  {
    companyName: "Google",
    email: "hr@google.com",
    password: "google123",
    contactNumber: "+1-650-253-0000",
    industry: "Technology",
    companySize: "enterprise",
    website: "https://google.com",
    description: "Global technology company specializing in internet-related services and products",
    address: {
      street: "1600 Amphitheatre Parkway",
      city: "Mountain View",
      state: "CA",
      country: "USA",
      zipCode: "94043"
    },
    status: "active"
  },
  {
    companyName: "Microsoft",
    email: "hr@microsoft.com",
    password: "microsoft123",
    contactNumber: "+1-425-882-8080",
    industry: "Technology",
    companySize: "enterprise",
    website: "https://microsoft.com",
    description: "Leading technology company that develops, manufactures, licenses, supports, and sells computer software",
    address: {
      street: "One Microsoft Way",
      city: "Redmond",
      state: "WA",
      country: "USA",
      zipCode: "98052"
    },
    status: "active"
  },
  {
    companyName: "Amazon",
    email: "hr@amazon.com",
    password: "amazon123",
    contactNumber: "+1-206-266-1000",
    industry: "E-commerce",
    companySize: "enterprise",
    website: "https://amazon.com",
    description: "Multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence",
    address: {
      street: "410 Terry Avenue North",
      city: "Seattle",
      state: "WA",
      country: "USA",
      zipCode: "98109"
    },
    status: "active"
  },
  {
    companyName: "Infosys",
    email: "hr@infosys.com",
    password: "infosys123",
    contactNumber: "+91-80-2852-0261",
    industry: "IT Services",
    companySize: "enterprise",
    website: "https://infosys.com",
    description: "Global leader in next-generation digital services and consulting",
    address: {
      street: "Electronics City",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      zipCode: "560100"
    },
    status: "active"
  },
  {
    companyName: "TCS",
    email: "hr@tcs.com",
    password: "tcs123",
    contactNumber: "+91-22-6778-9999",
    industry: "IT Services",
    companySize: "enterprise",
    website: "https://tcs.com",
    description: "Leading global IT services, consulting and business solutions organization",
    address: {
      street: "TCS House",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400001"
    },
    status: "active"
  },
  {
    companyName: "Intel",
    email: "hr@intel.com",
    password: "intel123",
    contactNumber: "+1-408-765-8080",
    industry: "Semiconductor",
    companySize: "enterprise",
    website: "https://intel.com",
    description: "American multinational corporation and technology company",
    address: {
      street: "2200 Mission College Blvd",
      city: "Santa Clara",
      state: "CA",
      country: "USA",
      zipCode: "95054"
    },
    status: "active"
  },
  {
    companyName: "Maruti Suzuki",
    email: "hr@marutisuzuki.com",
    password: "maruti123",
    contactNumber: "+91-11-4660-1000",
    industry: "Automotive",
    companySize: "large",
    website: "https://marutisuzuki.com",
    description: "India's largest passenger vehicle manufacturer",
    address: {
      street: "Plot No. 1",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      zipCode: "110001"
    },
    status: "active"
  },
  {
    companyName: "L&T Construction",
    email: "hr@larsentoubro.com",
    password: "lt123456",
    contactNumber: "+91-22-6752-5656",
    industry: "Construction",
    companySize: "large",
    website: "https://larsentoubro.com",
    description: "Leading construction company in India",
    address: {
      street: "L&T House",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400001"
    },
    status: "active"
  },
  {
    companyName: "BHEL",
    email: "hr@bhel.com",
    password: "bhel123456",
    contactNumber: "+91-11-2340-1111",
    industry: "Power",
    companySize: "large",
    website: "https://bhel.com",
    description: "India's largest engineering and manufacturing company",
    address: {
      street: "BHEL House",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      zipCode: "110001"
    },
    status: "active"
  },
  {
    companyName: "Wipro",
    email: "hr@wipro.com",
    password: "wipro123",
    contactNumber: "+91-80-2844-0011",
    industry: "IT Services",
    companySize: "enterprise",
    website: "https://wipro.com",
    description: "Leading global information technology, consulting and business process services company",
    address: {
      street: "Doddakannelli",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      zipCode: "560035"
    },
    status: "active"
  },
  {
    companyName: "HCL Technologies",
    email: "hr@hcl.com",
    password: "hcl123",
    contactNumber: "+91-120-446-1000",
    industry: "IT Services",
    companySize: "enterprise",
    website: "https://hcl.com",
    description: "Global technology company that helps enterprises reimagine their businesses for the digital age",
    address: {
      street: "Plot 3A",
      city: "Noida",
      state: "Uttar Pradesh",
      country: "India",
      zipCode: "201301"
    },
    status: "active"
  },
  {
    companyName: "Tech Mahindra",
    email: "hr@techmahindra.com",
    password: "techm123456",
    contactNumber: "+91-20-4225-0000",
    industry: "IT Services",
    companySize: "enterprise",
    website: "https://techmahindra.com",
    description: "Global consulting service focused on digital transformation",
    address: {
      street: "Tech Mahindra",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      zipCode: "411013"
    },
    status: "active"
  }
];

// Comprehensive job postings data
const JOBS_DATA = [
  {
    title: "Software Engineer",
    description: "We are looking for a talented Software Engineer to join our team. You will be responsible for developing high-quality software solutions.",
    requirements: ["Bachelor's degree in Computer Science", "Strong programming skills in Java/Python", "Experience with web technologies", "Good problem-solving skills"],
    location: "Bangalore, India",
    type: "full-time",
    salary: 1200000,
    status: "active",
    deadline: new Date("2024-04-30"),
    tags: ["Java", "Python", "Web Development", "Software Engineering"]
  },
  {
    title: "Data Scientist",
    description: "Join our data science team to work on cutting-edge machine learning projects and help drive business decisions through data insights.",
    requirements: ["Master's degree in Data Science/Statistics", "Experience with Python/R", "Knowledge of ML algorithms", "Strong analytical skills"],
    location: "Mumbai, India",
    type: "full-time",
    salary: 1500000,
    status: "active",
    deadline: new Date("2024-04-25"),
    tags: ["Python", "Machine Learning", "Data Analysis", "Statistics"]
  },
  {
    title: "Frontend Developer",
    description: "We are seeking a skilled Frontend Developer to create beautiful and responsive user interfaces for our web applications.",
    requirements: ["Bachelor's degree in Computer Science", "Proficiency in JavaScript/React", "Experience with CSS/HTML", "Understanding of UX principles"],
    location: "Pune, India",
    type: "full-time",
    salary: 1000000,
    status: "active",
    deadline: new Date("2024-04-20"),
    tags: ["JavaScript", "React", "CSS", "Frontend Development"]
  },
  {
    title: "DevOps Engineer",
    description: "Join our DevOps team to help automate and streamline our development and deployment processes.",
    requirements: ["Bachelor's degree in IT/Computer Science", "Experience with Docker/Kubernetes", "Knowledge of CI/CD pipelines", "Linux administration skills"],
    location: "Hyderabad, India",
    type: "full-time",
    salary: 1100000,
    status: "active",
    deadline: new Date("2024-04-15"),
    tags: ["Docker", "Kubernetes", "CI/CD", "DevOps"]
  },
  {
    title: "VLSI Design Engineer",
    description: "We are looking for a VLSI Design Engineer to work on cutting-edge semiconductor design projects.",
    requirements: ["Bachelor's degree in Electronics", "Experience with Verilog/VHDL", "Knowledge of FPGA design", "Understanding of digital design"],
    location: "Bangalore, India",
    type: "full-time",
    salary: 1300000,
    status: "active",
    deadline: new Date("2024-04-10"),
    tags: ["VLSI", "Verilog", "FPGA", "Digital Design"]
  },
  {
    title: "Mechanical Design Engineer",
    description: "Join our mechanical engineering team to design innovative products and solutions.",
    requirements: ["Bachelor's degree in Mechanical Engineering", "Proficiency in AutoCAD/SolidWorks", "Experience with product design", "Knowledge of manufacturing processes"],
    location: "Chennai, India",
    type: "full-time",
    salary: 900000,
    status: "active",
    deadline: new Date("2024-04-05"),
    tags: ["AutoCAD", "SolidWorks", "Mechanical Design", "Product Design"]
  },
  {
    title: "Civil Engineer",
    description: "We are seeking a Civil Engineer to work on infrastructure and construction projects.",
    requirements: ["Bachelor's degree in Civil Engineering", "Experience with STAAD Pro/ETABS", "Knowledge of structural analysis", "Understanding of construction codes"],
    location: "Delhi, India",
    type: "full-time",
    salary: 800000,
    status: "active",
    deadline: new Date("2024-04-01"),
    tags: ["STAAD Pro", "ETABS", "Structural Analysis", "Construction"]
  },
  {
    title: "Electrical Engineer",
    description: "Join our electrical engineering team to work on power systems and electrical infrastructure projects.",
    requirements: ["Bachelor's degree in Electrical Engineering", "Experience with PLC/SCADA", "Knowledge of power systems", "Understanding of electrical codes"],
    location: "Mumbai, India",
    type: "full-time",
    salary: 950000,
    status: "active",
    deadline: new Date("2024-03-30"),
    tags: ["PLC", "SCADA", "Power Systems", "Electrical Engineering"]
  },
  {
    title: "Backend Developer",
    description: "We are looking for a Backend Developer to build scalable and robust server-side applications.",
    requirements: ["Bachelor's degree in Computer Science", "Experience with Node.js/Python", "Knowledge of databases", "Understanding of APIs"],
    location: "Gurgaon, India",
    type: "full-time",
    salary: 1100000,
    status: "active",
    deadline: new Date("2024-03-25"),
    tags: ["Node.js", "Python", "Databases", "API Development"]
  },
  {
    title: "Quality Assurance Engineer",
    description: "Join our QA team to ensure the quality and reliability of our software products.",
    requirements: ["Bachelor's degree in Computer Science", "Experience with testing tools", "Knowledge of testing methodologies", "Attention to detail"],
    location: "Noida, India",
    type: "full-time",
    salary: 900000,
    status: "active",
    deadline: new Date("2024-03-20"),
    tags: ["Testing", "Quality Assurance", "Automation", "Software Testing"]
  }
];

// Notifications data
const NOTIFICATIONS_DATA = [
  {
    title: "New Placement Drive Announced",
    message: "Google is coming for campus recruitment on April 15th. All eligible students are encouraged to apply.",
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
    message: "Last date to submit updated resumes for upcoming placement drives is April 10th.",
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
    message: "Microsoft will be visiting campus on April 20th for pre-placement talk and interviews.",
    type: "job",
    actionLink: "/companies"
  },
  {
    title: "Placement Statistics Updated",
    message: "Latest placement statistics for the current academic year have been updated.",
    type: "system",
    actionLink: "/reports-analytics"
  },
  {
    title: "Internship Opportunities",
    message: "New internship opportunities from top companies have been posted. Check the portal for details.",
    type: "job",
    actionLink: "/internship-records"
  },
  {
    title: "Skill Assessment Test",
    message: "Online skill assessment test for all final year students will be conducted on April 5th.",
    type: "reminder",
    actionLink: "/students"
  }
];

const seedComprehensiveTPOData = async () => {
  try {
    console.log('🌱 Starting comprehensive TPO data seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_portal');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({ role: 'tpo', email: TPO_USER.email });
    await User.deleteMany({ role: 'student', 'student.collegeName': TPO_INSTITUTE.name });
    await Company.deleteMany({});
    await JobPosting.deleteMany({});
    await JobApplication.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create TPO user
    console.log('👨‍💼 Creating TPO user...');
    const tpoUser = new User({
      ...TPO_USER,
      isVerified: true,
      status: 'active'
    });
    await tpoUser.save();
    console.log(`✅ TPO user created: ${tpoUser.email}`);

    // Create students
    console.log('👥 Creating students...');
    const createdStudents = [];
    for (const studentData of STUDENTS_DATA) {
      const student = new User({
        name: studentData.name,
        email: studentData.email,
        password: 'student123',
        phoneNumber: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        role: 'student',
        isVerified: true,
        status: 'active',
        student: {
          name: studentData.name,
          rollNumber: studentData.rollNumber,
          branch: studentData.branch,
          cgpa: studentData.cgpa,
          collegeName: TPO_INSTITUTE.name,
          graduationYear: "2024",
          personalInfo: {
            phoneNumber: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
          },
          skills: {
            technicalSkills: studentData.skills
          },
          placementInfo: {
            isPlaced: studentData.isPlaced,
            placementCompany: studentData.placementDetails?.company || null,
            placementRole: studentData.placementDetails?.role || null,
            placementPackage: studentData.placementDetails?.package?.amount ? `${studentData.placementDetails.package.amount} LPA` : null,
            placementDate: studentData.placementDetails?.placementDate || null
          },
          verificationStatus: 'verified',
          verifiedBy: tpoUser._id,
          verifiedAt: new Date()
        }
      });
      const savedStudent = await student.save();
      createdStudents.push(savedStudent);
    }
    console.log(`✅ ${createdStudents.length} students created successfully`);

    // Create companies
    console.log('🏢 Creating companies...');
    const createdCompanies = [];
    for (const companyData of COMPANIES_DATA) {
      const company = new Company({
        ...companyData,
        isVerified: true,
        role: 'company'
      });
      const savedCompany = await company.save();
      createdCompanies.push(savedCompany);
    }
    console.log(`✅ ${createdCompanies.length} companies created successfully`);

    // Create job postings
    console.log('💼 Creating job postings...');
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
        package: {
          min: jobData.salary * 0.8,
          max: jobData.salary * 1.2,
          currency: "INR"
        },
        isActive: jobData.status === 'active',
        deadline: jobData.deadline,
        skills: jobData.tags,
        experience: {
          min: Math.floor(Math.random() * 3) + 1,
          max: Math.floor(Math.random() * 5) + 3
        },
        category: "software-engineering"
      });
      const savedJobPosting = await jobPosting.save();
      createdJobPostings.push(savedJobPosting);
    }
    console.log(`✅ ${createdJobPostings.length} job postings created successfully`);

    // Create job applications
    console.log('📝 Creating job applications...');
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
          resume: `resume_${student.student.rollNumber}.pdf`,
          testScore: status === 'test_completed' ? Math.floor(Math.random() * 100) + 60 : null,
          interviewDate: ['interview_scheduled', 'interview_completed'].includes(status) ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
          feedback: status === 'rejected' ? 'Thank you for your application. We have decided to move forward with other candidates.' : null
        });
        await application.save();
        applicationCount++;
      }
    }
    console.log(`✅ ${applicationCount} job applications created successfully`);

    // Create notifications
    console.log('🔔 Creating notifications...');
    for (const notificationData of NOTIFICATIONS_DATA) {
      const notification = new Notification({
        recipient: tpoUser._id,
        sender: tpoUser._id,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        actionLink: notificationData.actionLink,
        isRead: Math.random() > 0.5
      });
      await notification.save();
    }

    // Create student-specific notifications
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
    console.log(`✅ ${NOTIFICATIONS_DATA.length + createdStudents.length} notifications created successfully`);

    // Print summary
    console.log('\n=== COMPREHENSIVE SEEDING SUMMARY ===');
    console.log(`🏫 Institute: ${TPO_INSTITUTE.name}`);
    console.log(`👨‍💼 TPO User: ${tpoUser.email} (Password: ${TPO_USER.password})`);
    console.log(`👥 Students Created: ${createdStudents.length}`);
    console.log(`🏢 Companies Created: ${createdCompanies.length}`);
    console.log(`💼 Job Postings Created: ${createdJobPostings.length}`);
    console.log(`📝 Job Applications Created: ${applicationCount}`);
    console.log(`🔔 Notifications Created: ${NOTIFICATIONS_DATA.length + createdStudents.length}`);

    console.log('\n=== STUDENT PLACEMENT SUMMARY ===');
    const placedStudents = createdStudents.filter(s => s.student.isPlaced);
    const unplacedStudents = createdStudents.filter(s => !s.student.isPlaced);
    console.log(`✅ Placed Students: ${placedStudents.length}`);
    console.log(`⏳ Unplaced Students: ${unplacedStudents.length}`);
    console.log(`📊 Placement Rate: ${((placedStudents.length / createdStudents.length) * 100).toFixed(1)}%`);

    console.log('\n=== BRANCH-WISE PLACEMENT ===');
    const branchStats = {};
    createdStudents.forEach(student => {
      const branch = student.student.branch;
      if (!branchStats[branch]) {
        branchStats[branch] = { total: 0, placed: 0 };
      }
      branchStats[branch].total++;
      if (student.student.isPlaced) {
        branchStats[branch].placed++;
      }
    });

    Object.entries(branchStats).forEach(([branch, stats]) => {
      const placementRate = ((stats.placed / stats.total) * 100).toFixed(1);
      console.log(`${branch}: ${stats.placed}/${stats.total} (${placementRate}%)`);
    });

    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log(`TPO Login: ${tpoUser.email} / ${TPO_USER.password}`);
    console.log(`Student Logins: All students use password 'student123'`);
    console.log('Example student emails:');
    createdStudents.slice(0, 5).forEach(student => {
      console.log(`  ${student.email} / student123`);
    });

    console.log('\n✅ Comprehensive TPO data seeding completed successfully!');
    console.log('🚀 The TPO portal is now ready with extensive data for testing and demonstration.');

  } catch (error) {
    console.error('❌ Error during comprehensive TPO data seeding:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seeding function
if (require.main === module) {
  seedComprehensiveTPOData()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedComprehensiveTPOData;
