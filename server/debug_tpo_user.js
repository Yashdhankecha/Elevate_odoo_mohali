const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC')
    .then(async () => {
        console.log('Connected to MongoDB');
        await createOrUpdateTPOUser();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

async function createOrUpdateTPOUser() {
    try {
        const email = 'tpo@bvm.com';
        const password = '321ewq';

        console.log(`Checking for user with email: ${email}...`);

        // Attempt to strictly find by email (case insensitive)
        let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (!user) {
            console.log('User not found. Creating new TPO user...');
            user = new User({
                email: email,
                password: password, // Will be hashed by pre-save hook
                role: 'tpo',
                isVerified: true,
                status: 'active',
                name: 'TPO Officer',
                tpo: {
                    name: 'TPO Officer',
                    instituteName: 'Birla Vishvakarma Mahavidyalaya',
                    designation: 'Placement Officer',
                    department: 'Training and Placement Cell',
                    contactNumber: '9999999999',
                    location: 'Vallabh Vidyanagar'
                }
            });
            await user.save();
            console.log('User created successfully with ID:', user._id);
        } else {
            console.log('User found:', user._id);

            // Update/Ensure fields are correct
            user.role = 'tpo';
            user.isVerified = true;
            user.status = 'active';

            if (!user.tpo) user.tpo = {};

            user.tpo.instituteName = 'Birla Vishvakarma Mahavidyalaya';
            user.tpo.department = 'Training and Placement Cell';
            user.tpo.designation = 'Placement Officer';
            user.tpo.contactNumber = '9999999999';
            user.tpo.location = 'Vallabh Vidyanagar';

            // Ensure name is set
            if (!user.tpo.name) user.tpo.name = user.name || 'TPO Officer';

            user.markModified('tpo');
            await user.save();
            console.log('User updated successfully.');
        }
    } catch (error) {
        console.error('Error in createOrUpdateTPOUser:', error);
    } finally {
        console.log('Closing connection...');
        await mongoose.connection.close();
        console.log('Done.');
        process.exit(0);
    }
}
