const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tripod:karanharshyash@clustercgc.lb9dcwd.mongodb.net/elevate_odoo_mohali?retryWrites=true&w=majority&appName=ClusterCGC')
    .then(async () => {
        console.log('Connected.');
        await checkUser();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });

async function checkUser() {
    try {
        const email = 'tpo@bvm.com';
        console.log(`Fetching full details for: ${email}`);

        // Case insensitive search
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (!user) {
            console.log('USER NOT FOUND!');
        } else {
            console.log('User Found. ID:', user._id);
            console.log('Role:', user.role);
            console.log('TPO Field Type:', typeof user.tpo);
            console.log('TPO Field Value:', JSON.stringify(user.tpo, null, 2));

            // Explicitly check properties
            if (user.tpo) {
                console.log('tpo.instituteName:', user.tpo.instituteName);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}
