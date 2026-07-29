import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vitalis_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  // We keep this function so we don't break existing imports, 
  // but the interceptor handles the logic automatically now.
};

export const registerUser = (data) => apiClient.post('/auth/register', data);
export const loginUser = (data) => apiClient.post('/auth/login', data);
export const forgotPassword = (data) => apiClient.post('/auth/forgot-password', data);
export const resetPassword = (data) => apiClient.post('/auth/reset-password', data);
export const fetchProfile = () => apiClient.get('/user/profile');
export const updateProfile = (data) => apiClient.put('/user/profile', data);
export const changePassword = (data) => apiClient.put('/user/password', data);
export const submitSymptomCheck = (data) => apiClient.post('/symptoms/assess', data);
export const fetchSymptomHistory = () => apiClient.get('/symptoms/history');
export const analyzeReport = (data) => apiClient.post('/health/report', data);
export const fetchHistory = () => apiClient.get('/health/history');
export const getDoctors = (params) => apiClient.get('/doctors', { params });
export const bookAppointment = (data) => apiClient.post('/health/appointment', data);
export const searchMedicine = (query) => apiClient.get('/medicine/search', { params: { query } });
export const estimateCost = (data) => apiClient.post('/estimate', data);
export const sendAssistantMessage = (data) => apiClient.post('/assistant/chat', data);
export const fetchNotifications = () => apiClient.get('/user/notifications');
