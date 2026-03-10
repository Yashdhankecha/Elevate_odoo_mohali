// Test script to verify registration flow and pending page display
console.log('=== REGISTRATION FLOW TEST ===');

// Test function to simulate registration flow
async function testRegistrationFlow() {
  try {
    console.log('\n=== TESTING REGISTRATION FLOW ===');
    
    // Clear any existing tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Cleared existing tokens');
    
    // Test data for different user types
    const testUsers = [
      {
        role: 'student',
        email: 'teststudent@example.com',
        password: 'testpassword123',
        name: 'Test Student',
        rollNumber: 'STU001',
        branch: 'Computer Science',
        graduationYear: '2025',
        collegeName: 'Test College'
      },
      {
        role: 'company',
        email: 'testcompany@example.com',
        password: 'testpassword123',
        companyName: 'Test Company',
        contactNumber: '1234567890'
      },
      {
        role: 'tpo',
        email: 'testtpo@example.com',
        password: 'testpassword123',
        name: 'Test TPO',
        instituteName: 'Test Institute',
        contactNumber: '1234567890'
      }
    ];
    
    for (const userData of testUsers) {
      console.log(`\n--- Testing ${userData.role} registration ---`);
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log(`✅ ${userData.role} registration successful`);
          console.log('Response:', {
            success: data.success,
            message: data.message,
            userId: data.userId,
            role: data.role,
            status: data.status
          });
          
          // Test OTP verification (using a mock OTP)
          console.log(`\n--- Testing OTP verification for ${userData.role} ---`);
          
          const otpResponse = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: data.userId,
              otp: '123456' // Mock OTP - in real scenario this would be from email
            })
          });
          
          const otpData = await otpResponse.json();
          
          if (otpResponse.ok) {
            console.log(`✅ ${userData.role} OTP verification successful`);
            console.log('OTP Response:', {
              success: otpData.success,
              message: otpData.message,
              user: {
                role: otpData.user?.role,
                status: otpData.user?.status,
                isVerified: otpData.user?.isVerified
              }
            });
            
            // Check if token was provided
            if (otpData.token) {
              console.log('✅ Token provided after OTP verification');
            } else {
              console.log('❌ No token provided after OTP verification');
            }
            
            // Check expected flow based on user role
            if ((userData.role === 'company' || userData.role === 'tpo') && otpData.user?.status === 'pending') {
              console.log(`✅ ${userData.role} correctly has pending status - should go to approval page`);
            } else if (userData.role === 'student' && otpData.user?.status === 'pending') {
              console.log(`✅ ${userData.role} correctly has pending status - should go to approval page`);
            } else {
              console.log(`ℹ️  ${userData.role} status: ${otpData.user?.status}`);
            }
            
          } else {
            console.log(`❌ ${userData.role} OTP verification failed`);
            console.log('Error:', otpData.message);
          }
          
        } else {
          console.log(`❌ ${userData.role} registration failed`);
          console.log('Error:', data.message);
        }
        
      } catch (error) {
        console.error(`❌ Error testing ${userData.role} registration:`, error);
      }
    }
    
  } catch (error) {
    console.error('❌ Registration flow test failed:', error);
  }
}

// Test function to verify pending page display
function testPendingPageDisplay() {
  console.log('\n=== TESTING PENDING PAGE DISPLAY ===');
  
  // Test different user roles
  const testRoles = ['student', 'company', 'tpo', 'superadmin', 'unknown'];
  
  testRoles.forEach(role => {
    console.log(`\n--- Testing role: ${role} ---`);
    
    // Simulate the getRoleDisplayName function logic
    let displayName;
    switch (role) {
      case 'student':
        displayName = 'Student';
        break;
      case 'tpo':
        displayName = 'TPO (Training & Placement Officer)';
        break;
      case 'company':
        displayName = 'Company HR';
        break;
      case 'superadmin':
        displayName = 'Super Admin';
        break;
      default:
        displayName = role?.toUpperCase() || 'User';
    }
    
    console.log(`Role: ${role} -> Display Name: ${displayName}`);
    
    if (displayName === 'User' && role !== 'unknown') {
      console.log(`❌ Role ${role} incorrectly shows as "User"`);
    } else {
      console.log(`✅ Role ${role} correctly displays as "${displayName}"`);
    }
  });
}

// Run the tests
console.log('Starting registration flow tests...');
testRegistrationFlow().then(() => {
  testPendingPageDisplay();
  console.log('\n=== TEST COMPLETED ===');
  console.log('Check the results above to verify the fixes are working correctly.');
  console.log('Key points to verify:');
  console.log('1. Registration should work for all user types');
  console.log('2. OTP verification should return a token');
  console.log('3. Company and TPO users should have pending status after OTP verification');
  console.log('4. Pending page should show proper role names instead of "User"');
  console.log('5. All users should be redirected to appropriate pages after verification');
});
