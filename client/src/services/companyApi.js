import { apiCall } from '../utils/api';

// Job Management APIs
export const getCompanyJobs = async () => {
  try {
    const response = await apiCall('GET', '/api/company/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    throw error;
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await apiCall('POST', '/api/company/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await apiCall('PUT', `/api/company/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await apiCall('DELETE', `/api/company/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export const getJobApplications = async (jobId) => {
  try {
    const response = await apiCall('GET', `/api/company/jobs/${jobId}/applications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

// Interview Scheduling APIs
export const getCompanyInterviews = async () => {
  try {
    const response = await apiCall('GET', '/api/company/interviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching company interviews:', error);
    throw error;
  }
};

export const createInterview = async (interviewData) => {
  try {
    const response = await apiCall('POST', '/api/company/interviews', interviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating interview:', error);
    throw error;
  }
};

export const updateInterview = async (interviewId, interviewData) => {
  try {
    const response = await apiCall('PUT', `/api/company/interviews/${interviewId}`, interviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating interview:', error);
    throw error;
  }
};

export const deleteInterview = async (interviewId) => {
  try {
    const response = await apiCall('DELETE', `/api/company/interviews/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting interview:', error);
    throw error;
  }
};

export const updateInterviewStatus = async (interviewId, status) => {
  try {
    const response = await apiCall('PATCH', `/api/company/interviews/${interviewId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating interview status:', error);
    throw error;
  }
};

// Company Dashboard APIs
export const getCompanyDashboardStats = async () => {
  try {
    const response = await apiCall('GET', '/api/company/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getCompanyProfile = async () => {
  try {
    const response = await apiCall('GET', '/api/company/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching company profile:', error);
    throw error;
  }
};

export const updateCompanyProfile = async (profileData) => {
  try {
    const response = await apiCall('PUT', '/api/company/profile', profileData);
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
    const response = await apiCall('GET', `/api/company/applications?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await apiCall('PATCH', `/api/company/applications/${applicationId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

export const getApplicationDetails = async (applicationId) => {
  try {
    const response = await apiCall('GET', `/api/company/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching application details:', error);
    throw error;
  }
};
