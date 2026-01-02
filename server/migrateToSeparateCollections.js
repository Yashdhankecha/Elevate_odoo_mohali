const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const TPO = require('./models/TPO');
const Company = require('./models/Company');
const SuperAdmin = require('./models/SuperAdmin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_odoo_mohali');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function
const migrateToSeparateCollections = async () => {
  try {
    console.log('🚀 Starting migration to separate collections...');
    
    // Get all users from the User collection
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      try {
        let migrated = false;
        
        switch (user.role) {
          case 'student':
            if (user.student) {
              // Create student document
              const studentData = {
                name: user.student.name || user.name,
                email: user.email,
                password: user.password,
                rollNumber: user.student.rollNumber,
                branch: user.student.branch,
                graduationYear: user.student.graduationYear,
                collegeName: user.student.collegeName,
                cgpa: user.student.cgpa,
                semester: user.student.currentSemester || 6,
                phoneNumber: user.student.personalInfo?.phoneNumber || user.phone,
                address: user.student.personalInfo?.address ? {
                  street: user.student.personalInfo.address,
                  city: user.location,
                  state: '',
                  country: 'India',
                  zipCode: ''
                } : undefined,
                skills: user.student.skills?.technicalSkills?.map(skill => ({
                  name: skill,
                  proficiency: 'Intermediate'
                })) || [],
                certifications: user.student.skills?.certifications || [],
                projects: user.student.experience?.projects || [],
                internships: user.student.experience?.internships || [],
                achievements: user.student.academicInfo?.achievements?.map(achievement => ({
                  title: achievement,
                  description: achievement,
                  date: new Date()
                })) || [],
                resume: user.student.resume || '',
                linkedinUrl: user.student.personalInfo?.linkedinProfile || user.linkedin,
                githubUrl: user.student.personalInfo?.githubProfile || user.github,
                portfolioUrl: user.student.personalInfo?.portfolio || '',
                isPlaced: user.student.placementInfo?.isPlaced || false,
                placementDetails: user.student.placementInfo?.isPlaced ? {
                  company: user.student.placementInfo.placementCompany,
                  package: {
                    amount: 0,
                    currency: 'INR',
                    type: 'CTC'
                  },
                  role: user.student.placementInfo.placementRole,
                  location: '',
                  placementDate: user.student.placementInfo.placementDate
                } : undefined,
                status: user.status,
                isVerified: user.isVerified,
                profilePicture: user.profilePicture,
                lastLogin: user.lastLogin,
                profileCompletion: user.student.profileCompletion || 0
              };
              
              const student = new Student(studentData);
              await student.save();
              console.log(`✅ Migrated student: ${student.email}`);
              migrated = true;
            }
            break;
            
          case 'company':
            if (user.company) {
              // Create company document
              const companyData = {
                companyName: user.company.companyName,
                email: user.email,
                password: user.password,
                contactNumber: user.company.contactNumber,
                industry: user.company.industry,
                companySize: user.company.companySize,
                website: user.company.website,
                address: {
                  street: '',
                  city: user.company.location,
                  state: '',
                  country: 'India',
                  zipCode: ''
                },
                description: user.company.description,
                status: user.status,
                isVerified: user.isVerified,
                profilePicture: user.profilePicture,
                lastLogin: user.lastLogin
              };
              
              const company = new Company(companyData);
              await company.save();
              console.log(`✅ Migrated company: ${company.email}`);
              migrated = true;
            }
            break;
            
          case 'tpo':
            if (user.tpo) {
              // Create TPO document
              const tpoData = {
                name: user.tpo.name,
                email: user.email,
                password: user.password,
                instituteName: user.tpo.instituteName,
                contactNumber: user.tpo.contactNumber,
                designation: user.tpo.designation,
                department: user.tpo.department,
                address: {
                  street: '',
                  city: user.tpo.location,
                  state: '',
                  country: 'India',
                  zipCode: ''
                },
                status: user.status,
                isVerified: user.isVerified,
                profilePicture: user.profilePicture,
                lastLogin: user.lastLogin
              };
              
              const tpo = new TPO(tpoData);
              await tpo.save();
              console.log(`✅ Migrated TPO: ${tpo.email}`);
              migrated = true;
            }
            break;
            
          case 'superadmin':
            // Create superadmin document
            const superAdminData = {
              name: user.name || 'Super Admin',
              email: user.email,
              password: user.password,
              status: user.status,
              isVerified: user.isVerified,
              profilePicture: user.profilePicture,
              lastLogin: user.lastLogin
            };
            
            const superAdmin = new SuperAdmin(superAdminData);
            await superAdmin.save();
            console.log(`✅ Migrated superadmin: ${superAdmin.email}`);
            migrated = true;
            break;
            
          default:
            console.log(`⚠️ Unknown role: ${user.role} for user: ${user.email}`);
            skippedCount++;
            continue;
        }
        
        if (migrated) {
          migratedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error migrating user ${user.email}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n=== MIGRATION SUMMARY ===');
    console.log(`✅ Successfully migrated: ${migratedCount} users`);
    console.log(`⚠️ Skipped: ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log('\n🎉 Migration completed!');
    
    // Optionally, you can delete the old User collection after verification
    // console.log('\n⚠️ To delete the old User collection, uncomment the following line:');
    // console.log('// await User.deleteMany({});');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await migrateToSeparateCollections();
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
};

// Run if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { migrateToSeparateCollections };

