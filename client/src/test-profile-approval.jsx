// Test file for Profile Approval functionality
// This file can be used to test the profile approval features

// Test data for profile approval
const testProfileData = {
  _id: 'test-student-id',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  approvalStatus: 'Pending',
  student: {
    branch: 'Computer Science',
    collegeName: 'Test University',
    graduationYear: '2024'
  }
};

// Test functions
const testProfileApproval = {
  // Test loading profile data
  testLoadProfileData: async () => {
    console.log('Testing profile data loading...');
    try {
      // Simulate API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: testProfileData
          });
        }, 1000);
      });
      
      console.log('Profile data loaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error loading profile data:', error);
      throw error;
    }
  },

  // Test approving profile
  testApproveProfile: async (studentId) => {
    console.log('Testing profile approval...');
    try {
      // Simulate API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Profile approved successfully',
            data: {
              ...testProfileData,
              approvalStatus: 'Approved',
              approvedAt: new Date().toISOString()
            }
          });
        }, 1000);
      });
      
      console.log('Profile approved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error approving profile:', error);
      throw error;
    }
  },

  // Test rejecting profile
  testRejectProfile: async (studentId, reason) => {
    console.log('Testing profile rejection...');
    try {
      // Simulate API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Profile rejected',
            data: {
              ...testProfileData,
              approvalStatus: 'Rejected',
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason
            }
          });
        }, 1000);
      });
      
      console.log('Profile rejected successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error rejecting profile:', error);
      throw error;
    }
  },

  // Test permission check
  testPermissionCheck: (userRole) => {
    console.log('Testing permission check...');
    const canApproveReject = ['tpo', 'superadmin'].includes(userRole);
    console.log(`User role: ${userRole}, Can approve/reject: ${canApproveReject}`);
    return canApproveReject;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testProfileApproval;
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('Profile Approval Test Suite Loaded');
  console.log('Available test functions:');
  console.log('- testLoadProfileData()');
  console.log('- testApproveProfile(studentId)');
  console.log('- testRejectProfile(studentId, reason)');
  console.log('- testPermissionCheck(userRole)');
  
  // Make available globally for testing
  window.testProfileApproval = testProfileApproval;
}
