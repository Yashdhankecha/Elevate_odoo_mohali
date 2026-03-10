import api from './api';

// Get current student's profile data
export const getStudentProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.success) {
      return response.user;
    }
    throw new Error(response.message || 'Failed to fetch profile');
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};

// Get student's detailed profile including all student-specific data
export const getStudentDetails = async (studentId) => {
  try {
    const response = await api.get(`/user/students/${studentId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch student details');
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw error;
  }
};

// Get student's applications with filtering
export const getStudentApplications = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const response = await api.get(`/user/applications?${queryParams.toString()}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch applications');
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Get student's placement statistics
export const getStudentStats = async () => {
  try {
    const response = await api.get('/user/student-stats');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch student statistics');
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    throw error;
  }
};

// Update student profile
export const updateStudentProfile = async (profileData) => {
  try {
    const response = await api.put('/user/student-profile', profileData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update profile');
  } catch (error) {
    console.error('Error updating student profile:', error);
    throw error;
  }
};

// Get student's skill progress
export const getSkillProgress = async () => {
  try {
    const response = await api.get('/user/skill-progress');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch skill progress');
  } catch (error) {
    console.error('Error fetching skill progress:', error);
    throw error;
  }
};

// Get student's practice session history
export const getPracticeHistory = async () => {
  try {
    const response = await api.get('/user/practice-history');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch practice history');
  } catch (error) {
    console.error('Error fetching practice history:', error);
    throw error;
  }
};

// Get student's achievements and certifications
export const getStudentAchievements = async () => {
  try {
    const response = await api.get('/user/achievements');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch achievements');
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};

// Get student's projects and internships
export const getStudentExperience = async () => {
  try {
    const response = await api.get('/user/experience');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch experience');
  } catch (error) {
    console.error('Error fetching experience:', error);
    throw error;
  }
};

// Get student's smart alerts and notifications
export const getStudentAlerts = async () => {
  try {
    const response = await api.get('/user/alerts');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch alerts');
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

// Get student's performance analytics
export const getPerformanceAnalytics = async (timeRange = '30days') => {
  try {
    const response = await api.get(`/user/performance-analytics?range=${timeRange}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch performance analytics');
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    throw error;
  }
};
