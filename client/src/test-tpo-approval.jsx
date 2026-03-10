// Test file for TPO Profile Approval functionality
// This file can be used to test the TPO approval features

// Test data for TPO approval
const testTPOData = {
  _id: 'test-tpo-id',
  name: 'TPO User',
  email: 'tpo@example.com',
  role: 'tpo',
  tpo: {
    instituteName: 'Test University'
  }
};

const testStudentData = {
  _id: 'test-student-id',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'student',
  approvalStatus: 'Pending',
  student: {
    collegeName: 'Test University',
    branch: 'Computer Science'
  }
};

// Test functions
const testTPOApproval = {
  // Test TPO authentication
  testTPOAuth: () => {
    console.log('Testing TPO authentication...');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isTPO = user.role === 'tpo';
    console.log(`User role: ${user.role}, Is TPO: ${isTPO}`);
    return isTPO;
  },

  // Test student approval
  testApproveStudent: async (studentId) => {
    console.log('Testing student approval...');
    try {
      // Simulate API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Student profile approved successfully',
            data: {
              ...testStudentData,
              approvalStatus: 'Approved',
              approvedAt: new Date().toISOString()
            }
          });
        }, 1000);
      });
      
      console.log('Student approved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error approving student:', error);
      throw error;
    }
  },

  // Test student rejection
  testRejectStudent: async (studentId, reason) => {
    console.log('Testing student rejection...');
    try {
      // Simulate API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Student profile rejected',
            data: {
              ...testStudentData,
              approvalStatus: 'Rejected',
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason
            }
          });
        }, 1000);
      });
      
      console.log('Student rejected successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error rejecting student:', error);
      throw error;
    }
  },

  // Test API endpoint simulation
  testAPIEndpoints: async () => {
    console.log('Testing API endpoints...');
    
    try {
      // Test approve endpoint
      console.log('Testing PUT /api/tpo/students/:id/approve');
      const approveResponse = await fetch('/api/tpo/students/test-student-id/approve', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Approve endpoint response:', approveResponse.status);

      // Test reject endpoint
      console.log('Testing PUT /api/tpo/students/:id/reject');
      const rejectResponse = await fetch('/api/tpo/students/test-student-id/reject', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason: 'Test rejection reason' })
      });
      console.log('Reject endpoint response:', rejectResponse.status);

    } catch (error) {
      console.error('API endpoint test error:', error);
    }
  },

  // Test middleware functionality
  testMiddleware: () => {
    console.log('Testing middleware functionality...');
    
    // Test TPO role check
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const hasTPORole = user.role === 'tpo';
    console.log(`TPO role check: ${hasTPORole}`);

    // Test institute access
    const hasInstitute = user.tpo && user.tpo.instituteName;
    console.log(`Institute access check: ${hasInstitute}`);

    return {
      hasTPORole,
      hasInstitute,
      instituteName: user.tpo?.instituteName
    };
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testTPOApproval;
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('TPO Approval Test Suite Loaded');
  console.log('Available test functions:');
  console.log('- testTPOAuth()');
  console.log('- testApproveStudent(studentId)');
  console.log('- testRejectStudent(studentId, reason)');
  console.log('- testAPIEndpoints()');
  console.log('- testMiddleware()');
  
  // Make available globally for testing
  window.testTPOApproval = testTPOApproval;
}
