import axios from 'axios';

const API_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.hostname}:5000/api` 
  : 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),
  
  // Health
  getHealth: () => apiClient.get('/health'),

  // Patients
  getPatients: (params) => apiClient.get('/patients', { params }),
  getPatientById: (id) => apiClient.get(`/patients/${id}`),
  createPatient: (data) => apiClient.post('/patients', data),

  // AI Analysis
  analyzePatient: (id) => apiClient.post(`/patients/${id}/analyze`),

  // Clusters & Analytics
  getClusters: () => apiClient.get('/clusters'),
  getAnalytics: () => apiClient.get('/analytics'),

  // Simulation
  runSimulation: (params) => apiClient.post('/simulation', params)
};

export default api;

