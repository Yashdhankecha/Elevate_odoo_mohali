const mongoose = require('mongoose');
const SkillProgress = require('./models/SkillProgress');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevate_placement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createSampleSkills = async () => {
  try {
    console.log('Creating sample skill progress data...');
    
    // Get a student user
    const student = await User.findOne({ role: 'student' });
    if (!student) {
      console.log('No student found. Please create a student account first.');
      return;
    }
    
    console.log(`Found student: ${student.email}`);
    
    // Clear existing skill progress for this student
    await SkillProgress.deleteMany({ student: student._id });
    
    // Create sample technical skills
    const technicalSkills = [
      { skill: 'Data Structures & Algorithms', proficiency: 75, category: 'technical' },
      { skill: 'System Design', proficiency: 60, category: 'technical' },
      { skill: 'Database Management', proficiency: 85, category: 'technical' },
      { skill: 'Web Development', proficiency: 90, category: 'technical' },
      { skill: 'JavaScript', proficiency: 80, category: 'technical' },
      { skill: 'React', proficiency: 70, category: 'technical' },
      { skill: 'Node.js', proficiency: 65, category: 'technical' },
      { skill: 'Python', proficiency: 55, category: 'technical' }
    ];
    
    // Create sample soft skills
    const softSkills = [
      { skill: 'Communication', proficiency: 80, category: 'soft-skills' },
      { skill: 'Problem Solving', proficiency: 75, category: 'soft-skills' },
      { skill: 'Leadership', proficiency: 60, category: 'soft-skills' },
      { skill: 'Teamwork', proficiency: 85, category: 'soft-skills' },
      { skill: 'Time Management', proficiency: 70, category: 'soft-skills' },
      { skill: 'Critical Thinking', proficiency: 65, category: 'soft-skills' }
    ];
    
    const allSkills = [...technicalSkills, ...softSkills];
    
    // Create skill progress records
    const skillProgressRecords = allSkills.map(skill => ({
      student: student._id,
      skill: skill.skill,
      category: skill.category,
      proficiency: skill.proficiency,
      targetProficiency: Math.min(100, skill.proficiency + 20),
      notes: `Current proficiency level: ${skill.proficiency}%. ${skill.proficiency < 50 ? 'Needs improvement.' : skill.proficiency < 80 ? 'Good progress.' : 'Excellent level.'}`,
      lastUpdated: new Date()
    }));
    
    await SkillProgress.insertMany(skillProgressRecords);
    
    console.log(`✅ Created ${skillProgressRecords.length} skill progress records for student: ${student.email}`);
    
    // Log statistics
    const technicalCount = technicalSkills.length;
    const softCount = softSkills.length;
    const technicalAvg = Math.round(technicalSkills.reduce((sum, s) => sum + s.proficiency, 0) / technicalCount);
    const softAvg = Math.round(softSkills.reduce((sum, s) => sum + s.proficiency, 0) / softCount);
    const overallAvg = Math.round((technicalAvg + softAvg) / 2);
    
    console.log('\n📊 Sample Data Statistics:');
    console.log(`Technical Skills: ${technicalCount} skills, Average: ${technicalAvg}%`);
    console.log(`Soft Skills: ${softCount} skills, Average: ${softAvg}%`);
    console.log(`Overall Average: ${overallAvg}%`);
    
    mongoose.connection.close();
    console.log('✅ Sample skill data created successfully!');
    
  } catch (error) {
    console.error('Error creating sample skills:', error);
    mongoose.connection.close();
  }
};

createSampleSkills();
