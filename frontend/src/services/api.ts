import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// This function will be called from App.tsx or main.tsx to set up interceptors with notification capability
export const setupInterceptors = (showNotification: (message: string, type: 'success' | 'error' | 'info') => void) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error:', error.response.status, error.response.data);
        showNotification(error.response.data.detail || `API Error: ${error.response.status}`, 'error');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network Error:', error.request);
        showNotification("Network error. Please check your internet connection.", 'error');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
        showNotification("An unexpected error occurred.", 'error');
      }
      return Promise.reject(error);
    }
  );
};

export const connectionsApi = {
  getConnections: async () => {
    const response = await api.get('/connections');
    return response.data;
  },
  initiateConnection: async () => {
    const response = await api.post('/connections/connect');
    return response.data;
  },
  handleConnectionCallback: async (authorizationId: string, state: string) => {
    const response = await api.post('/connections/callback', { authorization_id: authorizationId, state: state });
    return response.data;
  },
};

export const dashboardApi = {
  getDashboardData: async (asOfDate?: string) => {
    let url = '/dashboard';
    if (asOfDate) {
      url += `?as_of_date=${asOfDate}`;
    }
    const response = await api.get(url);
    return response.data;
  },
};

// Add other API functions as needed for Dashboard, etc.
