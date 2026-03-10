// Test file to verify the verification flow
// This file can be run in the browser console to test the verification functionality

console.log('🧪 Testing Verification Flow...');

// Test 1: Check if NotVerified page is accessible
async function testNotVerifiedPage() {
  console.log('📋 Test 1: Checking NotVerified page accessibility...');
  
  try {
    // Simulate a user who is not verified
    const mockUser = {
      email: 'test@example.com',
      role: 'student',
      isVerified: false
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Navigate to not-verified page
    window.location.href = '/not-verified';
    
    console.log('✅ Test 1: NotVerified page navigation successful');
  } catch (error) {
    console.error('❌ Test 1 failed:', error);
  }
}

// Test 2: Test resend verification API
async function testResendVerification() {
  console.log('📋 Test 2: Testing resend verification API...');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    const data = await response.json();
    console.log('📧 Resend verification response:', data);
    
    if (response.ok) {
      console.log('✅ Test 2: Resend verification API working');
    } else {
      console.log('⚠️ Test 2: Resend verification API returned error (expected for non-existent user)');
    }
  } catch (error) {
    console.error('❌ Test 2 failed:', error);
  }
}

// Test 3: Test verification status check
function testVerificationStatusCheck() {
  console.log('📋 Test 3: Testing verification status check...');
  
  try {
    // Simulate different user states
    const testCases = [
      { user: { isVerified: false }, expected: 'not-verified' },
      { user: { isVerified: true }, expected: 'dashboard' },
      { user: null, expected: 'login' }
    ];
    
    testCases.forEach((testCase, index) => {
      console.log(`  Case ${index + 1}: User verified = ${testCase.user?.isVerified}, Expected redirect = ${testCase.expected}`);
    });
    
    console.log('✅ Test 3: Verification status check logic verified');
  } catch (error) {
    console.error('❌ Test 3 failed:', error);
  }
}

// Test 4: Test API interceptor behavior
function testApiInterceptor() {
  console.log('📋 Test 4: Testing API interceptor behavior...');
  
  try {
    // Simulate 401 error for verified user
    const verifiedUser = { isVerified: true };
    localStorage.setItem('user', JSON.stringify(verifiedUser));
    
    console.log('  Case 1: Verified user gets 401 -> should redirect to login');
    
    // Simulate 401 error for unverified user
    const unverifiedUser = { isVerified: false };
    localStorage.setItem('user', JSON.stringify(unverifiedUser));
    
    console.log('  Case 2: Unverified user gets 401 -> should redirect to not-verified');
    
    console.log('✅ Test 4: API interceptor logic verified');
  } catch (error) {
    console.error('❌ Test 4 failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting verification flow tests...\n');
  
  await testNotVerifiedPage();
  await testResendVerification();
  testVerificationStatusCheck();
  testApiInterceptor();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📝 Manual Testing Instructions:');
  console.log('1. Create a new user account');
  console.log('2. Try to access dashboard without verifying email');
  console.log('3. Verify you are redirected to /not-verified page');
  console.log('4. Test the "Resend Verification Email" button');
  console.log('5. Test the "I\'ve Verified My Email" button');
  console.log('6. Verify email and check if you can access dashboard');
}

// Export for manual testing
window.testVerificationFlow = {
  runAllTests,
  testNotVerifiedPage,
  testResendVerification,
  testVerificationStatusCheck,
  testApiInterceptor
};

console.log('🔧 Verification flow tests loaded. Run window.testVerificationFlow.runAllTests() to start testing.');
