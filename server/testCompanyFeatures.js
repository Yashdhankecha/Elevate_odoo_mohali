const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test data
const testCompany = {
  email: 'hr@techcorp.com',
  password: 'techcorp123'
};

const testJob = {
  title: 'Test Software Engineer',
  department: 'Engineering',
  description: 'This is a test job posting for verification purposes.',
  requirements: ['JavaScript', 'React', 'Node.js'],
  location: 'Remote',
  salary: '$80,000 - $100,000',
  type: 'full-time',
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
};

const testInterview = {
  candidate: 'Test Candidate',
  role: 'Software Engineer',
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  time: '10:00 AM',
  type: 'Technical',
  interviewer: 'Test Interviewer',
  location: 'Virtual (Zoom)',
  duration: '60',
  notes: 'Test interview for verification'
};

async function login() {
  try {
    console.log('🔐 Testing login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testCompany);
    
    if (response.data.token) {
      authToken = response.data.token;
      console.log('✅ Login successful');
      console.log(`👤 Logged in as: ${response.data.user.displayName}`);
      return true;
    } else {
      console.log('❌ Login failed - no token received');
      return false;
    }
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testJobs() {
  console.log('\n💼 Testing Job Management...');
  
  try {
    // Get all jobs
    console.log('📋 Getting all jobs...');
    const getJobsResponse = await axios.get(`${BASE_URL}/company/jobs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Found ${getJobsResponse.data.length} jobs`);
    
    // Create a new job
    console.log('➕ Creating new job...');
    const createJobResponse = await axios.post(`${BASE_URL}/company/jobs`, testJob, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Created job: ${createJobResponse.data.title}`);
    
    const jobId = createJobResponse.data._id;
    
    // Update the job
    console.log('✏️ Updating job...');
    const updateData = { ...testJob, title: 'Updated Test Software Engineer' };
    const updateJobResponse = await axios.put(`${BASE_URL}/company/jobs/${jobId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Updated job: ${updateJobResponse.data.title}`);
    
    // Get job applications
    console.log('📝 Getting job applications...');
    const getApplicationsResponse = await axios.get(`${BASE_URL}/company/jobs/${jobId}/applications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Found ${getApplicationsResponse.data.length} applications for this job`);
    
    // Delete the test job
    console.log('🗑️ Deleting test job...');
    await axios.delete(`${BASE_URL}/company/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Test job deleted');
    
    return true;
  } catch (error) {
    console.log('❌ Job management test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testInterviews() {
  console.log('\n📅 Testing Interview Management...');
  
  try {
    // Get all interviews
    console.log('📋 Getting all interviews...');
    const getInterviewsResponse = await axios.get(`${BASE_URL}/company/interviews`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Found ${getInterviewsResponse.data.length} interviews`);
    
    // Create a new interview
    console.log('➕ Creating new interview...');
    const createInterviewResponse = await axios.post(`${BASE_URL}/company/interviews`, testInterview, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Created interview: ${createInterviewResponse.data.candidate} for ${createInterviewResponse.data.role}`);
    
    const interviewId = createInterviewResponse.data._id;
    
    // Update interview status
    console.log('🔄 Updating interview status...');
    const updateStatusResponse = await axios.patch(`${BASE_URL}/company/interviews/${interviewId}/status`, 
      { status: 'In Progress' }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Updated interview status to: ${updateStatusResponse.data.status}`);
    
    // Update the interview
    console.log('✏️ Updating interview details...');
    const updateData = { ...testInterview, notes: 'Updated test interview notes' };
    const updateInterviewResponse = await axios.put(`${BASE_URL}/company/interviews/${interviewId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Updated interview notes`);
    
    // Delete the test interview
    console.log('🗑️ Deleting test interview...');
    await axios.delete(`${BASE_URL}/company/interviews/${interviewId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Test interview deleted');
    
    return true;
  } catch (error) {
    console.log('❌ Interview management test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testApplications() {
  console.log('\n📝 Testing Application Management...');
  
  try {
    // Get all applications
    console.log('📋 Getting all applications...');
    const getApplicationsResponse = await axios.get(`${BASE_URL}/company/applications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Found ${getApplicationsResponse.data.length} applications`);
    
    if (getApplicationsResponse.data.length > 0) {
      const applicationId = getApplicationsResponse.data[0]._id;
      
      // Get specific application details
      console.log('👁️ Getting application details...');
      const getApplicationResponse = await axios.get(`${BASE_URL}/company/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`✅ Retrieved application details for: ${getApplicationResponse.data.applicant}`);
      
      // Update application status
      console.log('🔄 Updating application status...');
      const updateStatusResponse = await axios.patch(`${BASE_URL}/company/applications/${applicationId}/status`, 
        { status: 'shortlisted' }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`✅ Updated application status to: ${updateStatusResponse.data.status}`);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Application management test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testDashboard() {
  console.log('\n📊 Testing Dashboard...');
  
  try {
    // Get dashboard stats
    console.log('📈 Getting dashboard statistics...');
    const getStatsResponse = await axios.get(`${BASE_URL}/company/dashboard/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Dashboard statistics retrieved successfully');
    console.log(`   - Total Jobs: ${getStatsResponse.data.totalJobs || 0}`);
    console.log(`   - Active Jobs: ${getStatsResponse.data.activeJobs || 0}`);
    console.log(`   - Total Applications: ${getStatsResponse.data.totalApplications || 0}`);
    console.log(`   - Total Interviews: ${getStatsResponse.data.totalInterviews || 0}`);
    
    return true;
  } catch (error) {
    console.log('❌ Dashboard test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testProfile() {
  console.log('\n👤 Testing Profile Management...');
  
  try {
    // Get company profile
    console.log('📋 Getting company profile...');
    const getProfileResponse = await axios.get(`${BASE_URL}/company/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Retrieved profile for: ${getProfileResponse.data.company.companyName}`);
    
    // Update company profile
    console.log('✏️ Updating company profile...');
    const updateData = {
      companyName: getProfileResponse.data.company.companyName,
      description: 'Updated company description for testing purposes'
    };
    const updateProfileResponse = await axios.put(`${BASE_URL}/company/profile`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Company profile updated successfully');
    
    return true;
  } catch (error) {
    console.log('❌ Profile management test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Company Features Test Suite...\n');
  
  const results = {
    login: false,
    jobs: false,
    interviews: false,
    applications: false,
    dashboard: false,
    profile: false
  };
  
  // Test login first
  results.login = await login();
  
  if (!results.login) {
    console.log('\n❌ Cannot proceed without successful login');
    return results;
  }
  
  // Run all other tests
  results.jobs = await testJobs();
  results.interviews = await testInterviews();
  results.applications = await testApplications();
  results.dashboard = await testDashboard();
  results.profile = await testProfile();
  
  // Summary
  console.log('\n📋 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.toUpperCase()}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All company features are working correctly!');
  } else {
    console.log('⚠️ Some features need attention. Check the logs above for details.');
  }
  
  return results;
}

// Run the tests
runAllTests().catch(console.error);
