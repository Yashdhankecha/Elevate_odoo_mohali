import { apiCall } from '../utils/api';

// Job Management APIs
export const getCompanyJobs = async () => {
  try {
    const response = await apiCall('GET', '/company/jobs');
    const body = response.data;
    // API returns { success, data: [...], message } — unwrap to array
    const jobs = Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
    return jobs;
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    throw error;
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await apiCall('POST', '/company/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await apiCall('PUT', `/company/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await apiCall('DELETE', `/company/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// ===== Comprehensive Job Posting APIs =====

export const createJobPosting = async (jobData) => {
  try {
    const response = await apiCall('POST', '/company/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job posting:', error);
    throw error;
  }
};

export const updateJobPosting = async (jobId, jobData) => {
  try {
    const response = await apiCall('PUT', `/company/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error updating job posting:', error);
    throw error;
  }
};

export const saveJobDraft = async (jobId, draftData) => {
  try {
    const response = await apiCall('PATCH', `/company/jobs/${jobId}/draft`, draftData);
    return response.data;
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
};

export const submitJobPosting = async (jobId) => {
  try {
    const response = await apiCall('POST', `/company/jobs/${jobId}/submit`);
    return response.data;
  } catch (error) {
    console.error('Error submitting job:', error);
    throw error;
  }
};

export const toggleJobActive = async (jobId) => {
  try {
    const response = await apiCall('PATCH', `/company/jobs/${jobId}/toggle-active`);
    const body = response.data;
    // Merge inner data with outer message so consumers get both isActive/status and message
    const inner = body?.data ?? {};
    return { message: body?.message, ...inner };
  } catch (error) {
    console.error('Error toggling job status:', error);
    throw error;
  }
};

export const getJobDetails = async (jobId) => {
  try {
    const response = await apiCall('GET', `/company/jobs/${jobId}`);
    const body = response.data;
    return body?.data ?? body ?? {};
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

export const getJobApplications = async (jobId) => {
  try {
    const response = await apiCall('GET', `/company/jobs/${jobId}/applications`);
    const body = response.data;
    return Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

// Interview Scheduling APIs
export const getCompanyInterviews = async () => {
  try {
    const response = await apiCall('GET', '/company/interviews');
    const body = response.data;
    return Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
  } catch (error) {
    console.error('Error fetching company interviews:', error);
    throw error;
  }
};

export const createInterview = async (interviewData) => {
  try {
    const response = await apiCall('POST', '/company/interviews', interviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating interview:', error);
    throw error;
  }
};

export const updateInterview = async (interviewId, interviewData) => {
  try {
    const response = await apiCall('PUT', `/company/interviews/${interviewId}`, interviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating interview:', error);
    throw error;
  }
};

export const deleteInterview = async (interviewId) => {
  try {
    const response = await apiCall('DELETE', `/company/interviews/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting interview:', error);
    throw error;
  }
};

export const updateInterviewStatus = async (interviewId, status) => {
  try {
    const response = await apiCall('PATCH', `/company/interviews/${interviewId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating interview status:', error);
    throw error;
  }
};

// Company Dashboard APIs
export const getCompanyDashboardStats = async () => {
  try {
    const response = await apiCall('GET', '/company/dashboard/stats');
    const body = response.data;
    // Unwrap nested data object if present
    return body?.data ?? body ?? {};
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getCompanyProfile = async () => {
  try {
    const response = await apiCall('GET', '/company/profile');
    const body = response.data;
    return body?.data ?? body ?? {};
  } catch (error) {
    console.error('Error fetching company profile:', error);
    throw error;
  }
};

export const updateCompanyProfile = async (profileData) => {
  try {
    const response = await apiCall('PUT', '/company/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating company profile:', error);
    throw error;
  }
};

export const uploadCompanyLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await apiCall('POST', '/company/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const body = response.data;
    // URL may be nested under body.data.url or body.url
    return body?.data?.url ?? body?.url ?? '';
  } catch (error) {
    console.error('Error uploading company logo:', error);
    throw error;
  }
};

// Applications Tracking APIs
export const getAllApplications = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await apiCall('GET', `/company/applications?${queryParams}`);
    const body = response.data;
    // API returns { success, data: [...], message } — unwrap to array
    const apps = Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
    return apps;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await apiCall('PATCH', `/company/applications/${applicationId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

export const getApplicationDetails = async (applicationId) => {
  try {
    const response = await apiCall('GET', `/company/applications/${applicationId}`);
    const body = response.data;
    return body?.data ?? body ?? {};
  } catch (error) {
    console.error('Error fetching application details:', error);
    throw error;
  }
};

// Fetch list of all active TPOs (colleges) for on-campus drive targeting
export const getTPOList = async () => {
  try {
    const response = await apiCall('GET', '/company/tpo-list');
    const body = response.data;
    return Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
  } catch (error) {
    console.error('Error fetching TPO list:', error);
    throw error;
  }
};

export const advanceApplicantsToRound = async (jobId, applicantIds, newStatus, roundName) => {
  try {
    const response = await apiCall('POST', `/company/jobs/${jobId}/advance-round`, {
      applicantIds,
      newStatus,
      roundName
    });
    return response.data;
  } catch (error) {
    console.error('Error updating applicants status:', error);
    throw error;
  }
};

export const getCompanyAnalytics = async (period = '2024') => {
  try {
    const response = await apiCall('GET', `/company/analytics?period=${period}`);
    const body = response.data;
    return body?.data ?? body ?? {};
  } catch (error) {
    console.error('Error fetching company analytics:', error);
    throw error;
  }
};
