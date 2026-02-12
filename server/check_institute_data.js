const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC')
    .then(async () => {
        console.log('Connected.');
        await checkData();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });

async function checkData() {
    try {
        const instituteName = 'Birla Vishvakarma Mahavidyalaya';
        console.log(`Checking data for institute: ${instituteName}`);

        // Check Students
        const studentCount = await User.countDocuments({
            role: 'student',
            'student.collegeName': instituteName
        });
        console.log(`Students found: ${studentCount}`);

        // Check one student sample if exists
        if (studentCount > 0) {
            const student = await User.findOne({ role: 'student', 'student.collegeName': instituteName });
            console.log('Sample student:', student.name, student.email);
        } else {
            console.log('No students found. Creating a sample student...');
            const sampleStudent = new User({
                email: 'student.sample@bvm.com',
                password: 'password123',
                role: 'student',
                isVerified: true,
                status: 'active',
                name: 'Sample Student',
                student: {
                    name: 'Sample Student',
                    rollNumber: 'BVM001',
                    branch: 'Computer Engineering',
                    graduationYear: '2026',
                    collegeName: instituteName,
                    cgpa: 8.5
                }
            });
            await sampleStudent.save();
            console.log('Sample student created.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}
