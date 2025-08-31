const User = require('../models/User');

// Middleware to ensure TPO can only access their institute's data
const tpoInstituteAccess = async (req, res, next) => {
  try {
    // Get TPO's institute from user document
    const tpoUser = await User.findById(req.user._id);
    if (!tpoUser || !tpoUser.tpo || !tpoUser.tpo.instituteName) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found or institute not configured'
      });
    }

    // Add TPO's institute name to request for use in routes
    req.tpoInstitute = tpoUser.tpo.instituteName;
    next();
  } catch (error) {
    console.error('Error in TPO institute access middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Middleware to verify student belongs to TPO's institute
const verifyStudentInstitute = async (req, res, next) => {
  try {
    // Check for both 'id' and 'studentId' parameters to handle different route patterns
    const studentId = req.params.id || req.params.studentId;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }
    
    // Get TPO's institute
    const tpoUser = await User.findById(req.user._id);
    if (!tpoUser || !tpoUser.tpo || !tpoUser.tpo.instituteName) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get student and verify institute
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.student?.collegeName !== tpoUser.tpo.instituteName) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access students from your institute.'
      });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error('Error in verify student institute middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to build institute filter
const buildInstituteFilter = (tpoInstitute, additionalFilters = {}) => {
  return {
    role: 'student',
    'student.collegeName': tpoInstitute,
    ...additionalFilters
  };
};

// Helper function to verify institute access for bulk operations
const verifyBulkInstituteAccess = async (studentIds, tpoInstitute) => {
  const students = await User.find({
    _id: { $in: studentIds },
    role: 'student'
  });

  const unauthorizedStudents = students.filter(
    student => student.student?.collegeName !== tpoInstitute
  );

  if (unauthorizedStudents.length > 0) {
    throw new Error('Some students do not belong to your institute');
  }

  return students;
};

module.exports = {
  tpoInstituteAccess,
  verifyStudentInstitute,
  buildInstituteFilter,
  verifyBulkInstituteAccess
};
