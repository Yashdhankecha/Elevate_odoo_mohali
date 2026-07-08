const Student    = require('../models/Student');
const Company    = require('../models/Company');
const TPO        = require('../models/TPO');
const SuperAdmin = require('../models/SuperAdmin');
const User       = require('../models/User');
const ApiError    = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─── Helper: resolve Model from req.user ─────────────────────────────────────
const resolveModel = (user) => {
  const modelName = user.constructor.modelName;
  if (modelName === 'Student')    return Student;
  if (modelName === 'Company')    return Company;
  if (modelName === 'TPO')        return TPO;
  if (modelName === 'SuperAdmin') return SuperAdmin;
  return User;
};

// ─── 1. Get Students (TPO / Company view) ────────────────────────────────────

const getStudents = asyncHandler(async (req, res) => {
  if (!['tpo', 'company'].includes(req.user.role))
    throw new ApiError(403, 'Access denied. Only TPOs and Companies can view student data.');

  const { branch, graduationYear, isPlaced, minCGPA, maxCGPA, skills, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (branch)         filter.branch = branch;
  if (graduationYear) filter.graduationYear = parseInt(graduationYear);
  if (isPlaced !== undefined) filter.isPlaced = isPlaced === 'true';
  if (minCGPA) filter.cgpa = { $gte: parseFloat(minCGPA) };
  if (maxCGPA) filter.cgpa = { ...(filter.cgpa || {}), $lte: parseFloat(maxCGPA) };
  if (skills)  filter['skills.name'] = { $in: skills.split(',').map(s => s.trim()) };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [students, total, stats, branchStats] = await Promise.all([
    Student.find(filter).select('-password -emailVerificationOTP -passwordResetToken').sort({ cgpa: -1, name: 1 }).skip(skip).limit(parseInt(limit)),
    Student.countDocuments(filter),
    Student.aggregate([{ $group: { _id: null, totalStudents: { $sum: 1 }, placedStudents: { $sum: { $cond: ['$isPlaced', 1, 0] } }, avgCGPA: { $avg: '$cgpa' }, avgProfileCompletion: { $avg: '$profileCompletion' } } }]),
    Student.aggregate([{ $group: { _id: '$branch', count: { $sum: 1 }, placedCount: { $sum: { $cond: ['$isPlaced', 1, 0] } }, avgCGPA: { $avg: '$cgpa' } } }, { $sort: { count: -1 } }]),
  ]);

  res.json(new ApiResponse(200, {
    students,
    pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), total, hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)), hasPrev: parseInt(page) > 1 },
    statistics: stats[0] || { totalStudents: 0, placedStudents: 0, avgCGPA: 0, avgProfileCompletion: 0 },
    branchStats,
  }, 'Students fetched'));
});

// ─── 2. Get Single Student ────────────────────────────────────────────────────

const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.role === 'student' && req.user._id.toString() !== id)
    throw new ApiError(403, 'You can only view your own profile.');

  const student = await Student.findById(id).select('-password -emailVerificationOTP -passwordResetToken');
  if (!student) throw new ApiError(404, 'Student not found');
  res.json(new ApiResponse(200, student, 'Student fetched'));
});

// ─── 3. Get Applications (legacy student view) ────────────────────────────────

const getApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can view their applications.');
  const apps = req.user.student?.applications || [];
  res.json(new ApiResponse(200, { applications: apps, totalApplications: apps.length }, 'Applications fetched'));
});

// ─── 4. Student Stats ─────────────────────────────────────────────────────────

const getStudentStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can view their statistics.');
  const s = req.user.student || {};
  res.json(new ApiResponse(200, {
    profileCompletion: s.profileCompletion || 0, cgpa: s.cgpa || 0, branch: s.branch || '', graduationYear: s.graduationYear || 0,
    isPlaced: s.isPlaced || false, totalApplications: (s.applications || []).length,
    totalSkills: (s.skills || []).length, totalProjects: (s.projects || []).length,
    totalCertifications: (s.certifications || []).length, placementDetails: s.placementDetails || null,
  }, 'Student stats fetched'));
});

// ─── 5. Skill Progress ────────────────────────────────────────────────────────

const getSkillProgress = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can view skill progress.');
  const proficiencyMap = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
  let skills = (req.user.student?.skills || []).map(s => ({ name: s.name, proficiency: s.proficiency, progress: proficiencyMap[s.proficiency] || 0 }));
  if (!skills.length) skills = [
    { name: 'Data Structures & Algorithms', proficiency: 'Beginner', progress: 25 },
    { name: 'System Design', proficiency: 'Beginner', progress: 20 },
    { name: 'Web Development', proficiency: 'Beginner', progress: 40 },
  ];
  res.json(new ApiResponse(200, skills, 'Skill progress fetched'));
});

// ─── 6. Practice History ──────────────────────────────────────────────────────

const getPracticeHistory = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can view practice history.');
  const history = [
    { topic: 'Arrays & Strings',       accuracy: 95, date: new Date(Date.now() - 2  * 86400000) },
    { topic: 'Graphs',                 accuracy: 91, date: new Date(Date.now() - 7  * 86400000) },
    { topic: 'Dynamic Programming',    accuracy: 78, date: new Date(Date.now() - 10 * 86400000) },
    { topic: 'Trees',                  accuracy: 88, date: new Date(Date.now() - 14 * 86400000) },
  ];
  res.json(new ApiResponse(200, history, 'Practice history fetched'));
});

// ─── 7. Achievements ──────────────────────────────────────────────────────────

const getAchievements = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can view achievements.');
  const s = req.user.student || {};
  res.json(new ApiResponse(200, { achievements: s.achievements || [], certifications: s.certifications || [], totalAchievements: (s.achievements || []).length, totalCertifications: (s.certifications || []).length }, 'Achievements fetched'));
});

// ─── 8. Experience (projects + internships) ───────────────────────────────────

const getExperience = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can view experience.');
  const s = req.user.student || {};
  res.json(new ApiResponse(200, { projects: s.projects || [], internships: s.internships || [], totalProjects: (s.projects || []).length, totalInternships: (s.internships || []).length }, 'Experience fetched'));
});

// ─── 9. Smart Alerts ─────────────────────────────────────────────────────────

const getAlerts = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can view alerts.');
  const s = req.user.student || {};
  const apps = s.applications || [];
  const alerts = [];

  if (apps.length < 5) alerts.push({ type: 'application', priority: 'medium', title: 'Increase Your Applications', message: `You have applied to only ${apps.length} companies. Consider applying to more.`, action: 'Browse Jobs', actionUrl: '/jobs', date: new Date() });
  if ((s.profileCompletion || 0) < 80) alerts.push({ type: 'profile', priority: 'low', title: 'Complete Your Profile', message: `Your profile is ${s.profileCompletion || 0}% complete.`, action: 'Complete Profile', actionUrl: '/profile', date: new Date() });
  if ((s.skills || []).length < 3) alerts.push({ type: 'skills', priority: 'medium', title: 'Add More Skills', message: `You have only ${(s.skills || []).length} skills listed.`, action: 'Add Skills', actionUrl: '/profile', date: new Date() });

  res.json(new ApiResponse(200, { alerts, totalAlerts: alerts.length, priorityCounts: { high: alerts.filter(a => a.priority === 'high').length, medium: alerts.filter(a => a.priority === 'medium').length, low: alerts.filter(a => a.priority === 'low').length } }, 'Alerts fetched'));
});

// ─── 10. Performance Analytics ───────────────────────────────────────────────

const getPerformanceAnalytics = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can view analytics.');
  const apps = req.user.student?.applications || [];
  const total    = apps.length;
  const selected = apps.filter(a => a.status === 'Selected').length;
  const interviewed = apps.filter(a => ['Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected'].includes(a.status)).length;

  res.json(new ApiResponse(200, {
    successRate:  total > 0 ? Math.round(selected / total * 100) : 0,
    interviewRate: total > 0 ? Math.round(interviewed / total * 100) : 0,
    totalApplications: total, selectedApplications: selected, interviewApplications: interviewed,
    monthlyData: [{ month: 'Jan', value: 60 }, { month: 'Feb', value: 65 }, { month: 'Mar', value: 70 }, { month: 'Apr', value: 75 }, { month: 'May', value: 78 }, { month: 'Jun', value: 82 }],
    statusDistribution: [{ name: 'Successful', value: selected, color: '#34d399' }, { name: 'In Progress', value: interviewed - selected, color: '#fbbf24' }, { name: 'Other', value: total - interviewed, color: '#f87171' }],
  }, 'Analytics fetched'));
});

// ─── 11. Update Student Profile (legacy) ─────────────────────────────────────

const updateStudentProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') throw new ApiError(403, 'Only students can update their profile.');
  const allowed = ['name', 'phoneNumber', 'address', 'skills', 'workMode', 'expectedPackage', 'profilePicture'];
  const $set = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) $set[k] = req.body[k]; });
  const updated = await Student.findByIdAndUpdate(req.user._id, { $set }, { new: true, runValidators: false }).select('-password');
  if (!updated) throw new ApiError(404, 'Student not found');
  res.json(new ApiResponse(200, { user: updated, profileCompletion: updated.profileCompletion || 0 }, 'Profile updated successfully!'));
});

// ─── 12. Get Profile (any role) ──────────────────────────────────────────────

const getProfile = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, 'Profile fetched'));
});

// ─── 13. Update Profile (any role) ───────────────────────────────────────────

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, designation, department, profilePicture, bio, location, linkedin, github } = req.body;
  const updateFields = {};

  // Email uniqueness check
  if (email && email !== req.user.email) {
    const exists = await Student.findOne({ email }) || await Company.findOne({ email }) || await TPO.findOne({ email }) || await SuperAdmin.findOne({ email }) || await User.findOne({ email });
    if (exists) throw new ApiError(400, 'Email already taken');
    updateFields.email = email;
  }

  const fields = { name, phone, designation, department, profilePicture, bio, location, linkedin, github };
  Object.entries(fields).forEach(([k, v]) => { if (v !== undefined) updateFields[k] = v; });

  if (!Object.keys(updateFields).length) return res.json(new ApiResponse(200, req.user, 'No changes to update'));

  const Model = resolveModel(req.user);
  const updatedUser = await Model.findByIdAndUpdate(req.user._id, updateFields, { new: true }).select('-password');
  res.json(new ApiResponse(200, updatedUser, 'Profile updated successfully!'));
});

// ─── 14. Change Password ──────────────────────────────────────────────────────

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new ApiError(400, 'Current and new password are required');

  // Find user with password from their respective model
  const Model = resolveModel(req.user);
  const user  = await Model.findById(req.user._id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await user.comparePassword(currentPassword);
  if (!valid) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();
  res.json(new ApiResponse(200, null, 'Password changed successfully'));
});

// ─── 15. Delete Account ───────────────────────────────────────────────────────

const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) throw new ApiError(400, 'Password is required to delete account');

  const Model = resolveModel(req.user);
  const user  = await Model.findById(req.user._id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await user.comparePassword(password);
  if (!valid) throw new ApiError(400, 'Password is incorrect');

  await Model.findByIdAndDelete(req.user._id);
  res.json(new ApiResponse(200, null, 'Account deleted successfully'));
});

module.exports = {
  getStudents, getStudent,
  getApplications, getStudentStats, getSkillProgress, getPracticeHistory,
  getAchievements, getExperience, getAlerts, getPerformanceAnalytics,
  updateStudentProfile, getProfile, updateProfile, changePassword, deleteAccount,
};
