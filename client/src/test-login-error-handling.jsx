// Test script to verify login error handling
console.log('=== LOGIN ERROR HANDLING TEST ===');

// Test function to simulate invalid login
async function testInvalidLogin() {
  try {
    console.log('\n=== TESTING INVALID LOGIN ===');
    
    // Clear any existing tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Cleared existing tokens');
    
    // Test invalid credentials
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('✅ Invalid login properly rejected');
      console.log('Response status:', response.status);
      console.log('Error message:', data.message);
      
      // Check that no token was set
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('✅ No token set after invalid login');
      } else {
        console.log('❌ Token was set after invalid login - this is wrong!');
      }
      
      // Check that no user was set
      const user = localStorage.getItem('user');
      if (!user) {
        console.log('✅ No user data set after invalid login');
      } else {
        console.log('❌ User data was set after invalid login - this is wrong!');
      }
      
    } else {
      console.log('❌ Invalid login was accepted - this is wrong!');
      console.log('Response data:', data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test function to verify valid login with unverified user
async function testValidLoginUnverified() {
  try {
    console.log('\n=== TESTING VALID LOGIN WITH UNVERIFIED USER ===');
    
    // Clear any existing tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Cleared existing tokens');
    
    // Note: This test requires a real unverified user account
    // You would need to replace with actual test credentials
    console.log('ℹ️  This test requires a real unverified user account');
    console.log('ℹ️  Please create a test account and update the credentials below');
    
    /*
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com', // Replace with real unverified user
        password: 'testpassword'   // Replace with real password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Valid login with unverified user');
      console.log('User data:', data.user);
      console.log('Is verified:', data.user.isVerified);
      
      if (!data.user.isVerified) {
        console.log('✅ User correctly identified as unverified');
        // Check that token was set
        const token = localStorage.getItem('token');
        if (token) {
          console.log('✅ Token set for unverified user');
        } else {
          console.log('❌ No token set for unverified user');
        }
      } else {
        console.log('❌ User was marked as verified when they should be unverified');
      }
    } else {
      console.log('❌ Valid login with unverified user was rejected');
      console.log('Error:', data.message);
    }
    */
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
console.log('Starting login error handling tests...');
testInvalidLogin().then(() => {
  console.log('\n=== TEST COMPLETED ===');
  console.log('Check the results above to verify the fix is working correctly.');
  console.log('Key points to verify:');
  console.log('1. Invalid credentials should show error message, not redirect to NotVerified');
  console.log('2. No token should be set for invalid login attempts');
  console.log('3. User should stay on login page with error message');
});
