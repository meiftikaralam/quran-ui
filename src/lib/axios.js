import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.alquran.cloud/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Prevent credentials from being sent with requests
  withCredentials: false,
});

// Add request interceptor to validate URLs
api.interceptors.request.use((config) => {
  // Ensure the URL is relative to our baseURL
  if (config.url && !config.url.startsWith('/')) {
    config.url = `/${config.url}`;
  }
  return config;
});

export default api; 