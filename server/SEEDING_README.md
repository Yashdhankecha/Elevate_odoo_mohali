# 🚀 Student Data Seeding Guide

This guide explains how to seed your database with 20 realistic student profiles for the Elevate Placement Tracker system.

## 📋 What Gets Created

The seeding script creates 20 comprehensive student profiles with the following data:

### 🎓 Academic Information
- **Name**: Student 1, Student 2, etc.
- **Roll Number**: CS001, CS002, etc.
- **Branch**: Computer Science, IT, ECE, Mechanical, Civil, Electrical
- **Graduation Year**: 2024-2026
- **Semester**: 5-8
- **CGPA**: 7.0-10.0 (realistic distribution)
- **SGPA**: Per-semester GPA tracking
- **Backlog History**: 0-3 backlogs
- **Current Backlogs**: 0-1

### 👤 Personal Information
- **Date of Birth**: 2000-2003
- **Gender**: Male/Female
- **Phone Number**: Indian format (+91)
- **Address**: Realistic Indian cities and states
- **Profile Picture**: Generated avatars

### 🛠️ Skills & Certifications
- **Technical Skills**: 2-5 skills per student (JavaScript, Python, Java, React, etc.)
- **Skill Proficiency**: Beginner, Intermediate, Advanced, Expert
- **Certifications**: 0-3 per student (AWS, Google Cloud, Microsoft, etc.)
- **Languages**: 1-3 languages (English always fluent)

### 📚 Projects & Experience
- **Projects**: 1-3 projects per student
- **Internships**: 0-2 internships with stipends
- **Achievements**: 0-4 achievements (Hackathon, Awards, etc.)
- **Extracurricular**: Technical clubs, sports, cultural activities

### 💼 Placement Information
- **Applications**: 0-5 job applications per student
- **Interview Rounds**: Detailed interview tracking
- **Placement Status**: Some students placed, others not
- **Package Expectations**: ₹4-15 LPA range
- **Work Preferences**: On-site, Remote, Hybrid

### 📊 Profile Completion
- **Auto-calculated**: Based on filled fields
- **Realistic Range**: 60-95% completion

## 🚀 How to Run

### Prerequisites
1. Make sure MongoDB is running
2. Create a `.env` file with your database connection
3. Install dependencies: `npm install`

### Running the Script
```bash
# Option 1: Using npm script
npm run seed

# Option 2: Direct execution
node seedStudents.js
```

### Environment Variables
Make sure your `.env` file contains:
```bash
MONGODB_URI=mongodb://localhost:27017/elevate-placement-tracker
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 📊 Sample Output

```
✅ Connected to MongoDB
🗑️  Cleared existing students
✅ Successfully inserted 20 students
📊 Profile completion calculated for all students

📋 Student Data Summary:
========================
Total Students: 20
Placed Students: 8
Average CGPA: 8.45
Average Profile Completion: 78.5%

👥 Sample Students:
==================

1. Student 1 (CS001)
   Branch: Computer Science
   CGPA: 8.75
   Status: Placed
   Profile Completion: 85%
   Company: TCS
   Package: ₹6,50,000

2. Student 2 (CS002)
   Branch: Information Technology
   CGPA: 7.95
   Status: Not Placed
   Profile Completion: 72%
```

## 🔧 Customization

### Modifying Data
- **Skills**: Edit the `skills` array in the script
- **Companies**: Modify the `companies` array
- **Branches**: Update the `branches` array
- **Cities/States**: Change the `cities` and `states` arrays

### Adding More Students
Change the loop count in the main function:
```javascript
// Generate and insert 20 students
for (let i = 0; i < 20; i++) {  // Change 20 to desired number
  const studentData = generateStudentData(i);
  students.push(studentData);
}
```

### Adjusting Ranges
- **CGPA Range**: Modify `randomCGPA()` function
- **Package Range**: Update `expectedPackage` values
- **Age Range**: Change date ranges in `randomDate()`

## 🗑️ Clearing Data

To clear all student data:
```javascript
await User.deleteMany({ role: 'student' });
```

## 📝 Data Structure

Each student follows this structure:
```javascript
{
  email: "student1@college.edu",
  password: "password123", // Hashed automatically
  role: "student",
  isVerified: true,
  student: {
    name: "Student 1",
    rollNumber: "CS001",
    branch: "Computer Science",
    // ... all other fields
  }
}
```

## ⚠️ Important Notes

1. **Passwords**: All students use `password123` (for development only)
2. **Verification**: All students are pre-verified
3. **Realistic Data**: Data is randomized but realistic
4. **No Duplicates**: Roll numbers and emails are unique
5. **Profile Pictures**: Generated using UI Avatars service

## 🎯 Use Cases

- **Development**: Test your application with realistic data
- **Demo**: Show stakeholders the system capabilities
- **Testing**: Validate dashboard features and analytics
- **Training**: Train users with sample data

## 🆘 Troubleshooting

### Common Issues
1. **Connection Error**: Check MongoDB connection string
2. **Validation Error**: Ensure all required fields are present
3. **Memory Issues**: Reduce number of students if needed

### Debug Mode
Add console logs to see what's happening:
```javascript
console.log('Generated student:', studentData);
```

## 📞 Support

If you encounter issues:
1. Check MongoDB connection
2. Verify environment variables
3. Check console for error messages
4. Ensure all dependencies are installed

---

**Happy Seeding! 🌱**

