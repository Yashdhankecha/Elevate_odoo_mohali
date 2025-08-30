// Test script to check client-side authentication
console.log('=== CLIENT AUTH TEST ===');

// Check localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('Token in localStorage:', token ? 'Present' : 'Missing');
console.log('User in localStorage:', user ? JSON.parse(user) : 'Missing');

// Check if we can make API calls
async function testClientAPI() {
  try {
    console.log('\n=== TESTING CLIENT API CALLS ===');
    
    // Test 1: Check if we can reach the server
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('Server health check:', healthData);
    
    if (!token) {
      console.log('❌ No token found - user not authenticated');
      return;
    }
    
    // Test 2: Check if token is valid
    const profileResponse = await fetch('http://localhost:5000/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Token is valid');
      console.log('Current profile:', profileData);
    } else {
      console.log('❌ Token is invalid or expired');
      const errorData = await profileResponse.json();
      console.log('Error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run the test
testClientAPI();
