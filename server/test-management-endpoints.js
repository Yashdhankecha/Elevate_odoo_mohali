const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test function to verify management endpoints
async function testManagementEndpoints() {
  try {
    console.log('Testing Management Endpoints...\n');

    // First, let's try to get a superadmin token (you'll need to replace this with actual credentials)
    console.log('Note: You need to be logged in as superadmin to test these endpoints');
    console.log('Please login as superadmin first and get the token\n');

    // Test endpoints (these will fail without proper authentication, but we can see the structure)
    const endpoints = [
      '/superadmin/registered-tpos',
      '/superadmin/registered-companies',
      '/superadmin/management-stats'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing: ${endpoint}`);
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
          }
        });
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
      } catch (error) {
        if (error.response) {
          console.log(`❌ ${endpoint} - Status: ${error.response.status}`);
          console.log(`   Error: ${error.response.data.message || error.response.data}\n`);
        } else {
          console.log(`❌ ${endpoint} - Network Error: ${error.message}\n`);
        }
      }
    }

    console.log('Management endpoints test completed!');
    console.log('\nTo properly test:');
    console.log('1. Login as superadmin');
    console.log('2. Get the JWT token');
    console.log('3. Replace YOUR_TOKEN_HERE with the actual token');
    console.log('4. Run this test again');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testManagementEndpoints();
