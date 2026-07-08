const Student        = require('../models/Student');
const Company        = require('../models/Company');
const TPO            = require('../models/TPO');
const ApiError       = require('../utils/ApiError');
const ApiResponse    = require('../utils/ApiResponse');
const asyncHandler   = require('../utils/asyncHandler');

/** GET /api/stats/public — no auth required */
const getPublicStats = asyncHandler(async (req, res) => {
  const JobPosting    = require('../models/JobPosting');
  const JobApplication = require('../models/JobApplication');

  const [totalStudents, totalCompanies, totalTPOs, placedStudents, activeJobs, totalApplications] =
    await Promise.all([
      Student.countDocuments({}),
      Company.countDocuments({ status: 'active' }),
      TPO.countDocuments({ status: 'active' }),
      Student.countDocuments({ isPlaced: true }),
      JobPosting.countDocuments({ isActive: true, status: 'active' }),
      JobApplication.countDocuments({}),
    ]);

  const placedWithPackage = await Student.find({
    isPlaced: true,
    'placementDetails.package.amount': { $gt: 0 },
  }).select('placementDetails.package.amount');

  const avgPackageLPA = placedWithPackage.length > 0
    ? parseFloat((
        placedWithPackage.reduce((s, st) => s + (st.placementDetails?.package?.amount || 0), 0)
        / placedWithPackage.length / 100000
      ).toFixed(1))
    : 0;

  const placementRate = totalStudents > 0
    ? Math.round((placedStudents / totalStudents) * 100)
    : 0;

  res.json(new ApiResponse(200, {
    totalStudents, totalCompanies, totalTPOs, placedStudents,
    placementRate, activeJobs, totalApplications, avgPackageLPA,
  }, 'Platform stats fetched'));
});

module.exports = { getPublicStats };
