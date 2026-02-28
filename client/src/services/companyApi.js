import { apiCall } from '../utils/api';

// Job Management APIs
export const getCompanyJobs = async () => {
  try {
    const response = await apiCall('GET', '/company/jobs');
    return response.data;
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

export const getJobDetails = async (jobId) => {
  try {
    const response = await apiCall('GET', `/company/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

export const getJobApplications = async (jobId) => {
  try {
    const response = await apiCall('GET', `/company/jobs/${jobId}/applications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

// Interview Scheduling APIs
export const getCompanyInterviews = async () => {
  try {
    const response = await apiCall('GET', '/company/interviews');
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getCompanyProfile = async () => {
  try {
    const response = await apiCall('GET', '/company/profile');
    return response.data;
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

// Applications Tracking APIs
export const getAllApplications = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await apiCall('GET', `/company/applications?${queryParams}`);
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error('Error fetching application details:', error);
    throw error;
  }
};
