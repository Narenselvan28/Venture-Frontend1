import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for cookies
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Inject Dev Role for Auth Bypass
    const devRole = localStorage.getItem('userRole') || 'AGENT';
    config.headers['x-dev-role'] = devRole;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Methods

// 1. Firebase Storage Upload
export const uploadToFirebase = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/firebase/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

// 2. ML Analysis of Evidence
export const analyzeEvidence = async (files, stageId, coordinates, jobId, contractorId) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('stageId', stageId);
  formData.append('jobId', jobId);
  formData.append('contractorId', contractorId);
  formData.append('latitude', coordinates.latitude);
  formData.append('longitude', coordinates.longitude);
  formData.append('timestamp', new Date().toISOString());

  const response = await api.post('/ml/analyze-evidence', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

// 3. Job Recommendations
export const getJobRecommendations = async (contractorId) => {
  const response = await api.get(`/ml/recommend-jobs/${contractorId}`);
  return response.data;
};

// 4. Job Fraud Detection
export const detectFakeJob = async (jobData) => {
  const response = await api.post('/ml/detect-fake', jobData);
  return response.data;
};

// 5. Timeline Endpoints
export const getTimelines = async () => api.get('/timeline');
export const getTimeline = async (id) => api.get(`/timeline/${id}`);
export const createTimeline = async (data) => api.post('/timeline', data);

// 6. Job Endpoints
export const getJobs = async () => api.get('/jobs');
export const getJob = async (id) => api.get(`/jobs/${id}`);
export const createJob = async (data) => api.post('/jobs', data);


export default api;
