const User = require('../models/User');
const TPO = require('../models/TPO');
const Student = require('../models/Student');

// Middleware to ensure TPO can only access their institute's data
const tpoInstituteAccess = async (req, res, next) => {
  try {
    let instituteName = null;

    // If req.user is already a Mongoose TPO document with instituteName, use it directly
    if (req.user?.instituteName) {
      instituteName = req.user.instituteName;
    } else {
      // Otherwise fetch from TPO collection (req.user may be a plain JWT-decoded object)
      const tpoDoc = await TPO.findById(req.user?._id).select('instituteName');
      if (tpoDoc) {
        instituteName = tpoDoc.instituteName;
        req.user.instituteName = instituteName; // cache it on the request
      } else {
        // Legacy: try User collection
        const legacyUser = await User.findById(req.user?._id).select('tpo role');
        if (legacyUser?.role === 'tpo') {
          instituteName = legacyUser.tpo?.instituteName;
        }
      }
    }

    if (!instituteName) {
      return res.status(400).json({
        success: false,
        message: 'Institute not configured for this TPO account'
      });
    }

    console.log('[tpoInstituteAccess] resolved institute:', instituteName, '| for user:', req.user?._id);
    req.tpoInstitute = instituteName;
    next();
  } catch (error) {
    console.error('[tpoInstituteAccess] ERROR:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
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

    // Get TPO's institute (already set by previous middleware usually, but let's be safe)
    let instituteName = req.tpoInstitute;
    if (!instituteName) {
      let tpoUser = req.user;
      if (!tpoUser || tpoUser.constructor.modelName !== 'TPO') {
        tpoUser = await TPO.findById(req.user._id);
      }

      if (tpoUser && tpoUser.constructor.modelName === 'TPO') {
        instituteName = tpoUser.instituteName;
      } else {
        // Legacy
        const user = await User.findById(req.user._id);
        if (user && user.tpo) instituteName = user.tpo.instituteName;
      }
    }

    if (!instituteName) {
      return res.status(404).json({
        success: false,
        message: 'TPO profile not found'
      });
    }

    // Get student and verify institute
    // Try Student collection first
    let student = await Student.findById(studentId);

    // Fallback to User collection
    if (!student) {
      student = await User.findById(studentId);
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check institute match
    let studentCollege = null;
    if (student.constructor.modelName === 'Student') {
      studentCollege = student.collegeName;
    } else if (student.student) {
      studentCollege = student.student.collegeName;
    }

    if (studentCollege !== instituteName) {
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
    collegeName: tpoInstitute,
    ...additionalFilters
  };
};

// Helper function to verify institute access for bulk operations
const verifyBulkInstituteAccess = async (studentIds, tpoInstitute) => {
  // Try Student collection
  const students = await Student.find({
    _id: { $in: studentIds }
  });

  const unauthorizedStudents = students.filter(
    student => student.collegeName !== tpoInstitute
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
