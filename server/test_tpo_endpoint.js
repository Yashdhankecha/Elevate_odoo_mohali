const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const EMAIL = 'tpo@bvm.com';
const PASSWORD = '321ewq';

async function testTPODashboard() {
    try {
        console.log('1. Logging in as TPO...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: EMAIL,
            password: PASSWORD,
            role: 'tpo'
        });

        const token = loginRes.data.token;
        console.log('Login successful. Token received.');

        console.log('2. Fetching Dashboard Stats...');
        const statsRes = await axios.get(`${API_URL}/tpo/dashboard-stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Dashboard Stats Response:', JSON.stringify(statsRes.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testTPODashboard();
