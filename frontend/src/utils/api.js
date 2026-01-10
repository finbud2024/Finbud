import axios from 'axios';

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // If VUE_APP_DEPLOY_URL is set, use it (for production via Netlify)
  if (process.env.VUE_APP_DEPLOY_URL) {
    return process.env.VUE_APP_DEPLOY_URL;
  }
  
  // For local development, detect if running on localhost
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Use localhost with Netlify Dev port
    return 'http://localhost:8888/.netlify/functions/server';
  }
  
  // Fallback to production URL if nothing else matches
  return 'https://finbud.net/.netlify/functions/server';
};

const API_BASE_URL = getApiUrl();
console.log('🌐 API Base URL:', API_BASE_URL);

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This ensures cookies are sent with every request
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
api.interceptors.request.use(
  config => {
    // You can add any request modifications here
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Redirect to login page if not authenticated
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL }; 