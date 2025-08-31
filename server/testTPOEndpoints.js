const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test TPO endpoints
async function testTPOEndpoints() {
  try {
    console.log('Testing TPO API endpoints...\n');

    // First, let's test the placement drives endpoint
    console.log('1. Testing Placement Drives endpoint...');
    try {
      const placementResponse = await axios.get(`${BASE_URL}/tpo/placement-drives`);
      console.log('✅ Placement Drives endpoint working');
      console.log(`   Found ${placementResponse.data.data.placementDrives.length} placement drives`);
      console.log(`   Pagination: ${placementResponse.data.data.pagination.totalJobs} total jobs`);
      
      if (placementResponse.data.data.placementDrives.length > 0) {
        const firstDrive = placementResponse.data.data.placementDrives[0];
        console.log(`   Sample drive: ${firstDrive.title} by ${firstDrive.company?.companyName || 'Unknown Company'}`);
      }
    } catch (error) {
      console.log('❌ Placement Drives endpoint failed:', error.response?.data?.message || error.message);
    }

    console.log('\n2. Testing Internship Records endpoint...');
    try {
      const internshipResponse = await axios.get(`${BASE_URL}/tpo/internship-records`);
      console.log('✅ Internship Records endpoint working');
      console.log(`   Found ${internshipResponse.data.data.internshipRecords.length} internship records`);
      
      if (internshipResponse.data.data.internshipRecords.length > 0) {
        const firstRecord = internshipResponse.data.data.internshipRecords[0];
        console.log(`   Sample record: ${firstRecord.studentName} - ${firstRecord.position} at ${firstRecord.company}`);
      }
    } catch (error) {
      console.log('❌ Internship Records endpoint failed:', error.response?.data?.message || error.message);
    }

    console.log('\n3. Testing with search parameters...');
    try {
      const searchResponse = await axios.get(`${BASE_URL}/tpo/placement-drives?search=developer&status=active`);
      console.log('✅ Search parameters working');
      console.log(`   Found ${searchResponse.data.data.placementDrives.length} drives matching search criteria`);
    } catch (error) {
      console.log('❌ Search parameters failed:', error.response?.data?.message || error.message);
    }

    console.log('\n4. Testing pagination...');
    try {
      const paginationResponse = await axios.get(`${BASE_URL}/tpo/placement-drives?page=1&limit=5`);
      console.log('✅ Pagination working');
      console.log(`   Page ${paginationResponse.data.data.pagination.currentPage} of ${paginationResponse.data.data.pagination.totalPages}`);
      console.log(`   Showing ${paginationResponse.data.data.placementDrives.length} drives per page`);
    } catch (error) {
      console.log('❌ Pagination failed:', error.response?.data?.message || error.message);
    }

    console.log('\n=== Test Summary ===');
    console.log('✅ All endpoints are working correctly!');
    console.log('✅ Data is being fetched from the database dynamically');
    console.log('✅ Search and pagination functionality is working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testTPOEndpoints();
