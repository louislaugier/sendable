import axios from 'axios';
import { apiBaseUrl } from '~/constants/oauth';

export const apiClientInstance = axios.create({
  baseURL: apiBaseUrl, // Set your base URL here
  timeout: 10000, // Specify a timeout (in milliseconds) for requests
  headers: {
    'Content-Type': 'application/json', // Example of default headers
    // Add other default headers if needed
  },
});

// Optional: Add interceptors for request and response
apiClientInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here, e.g., adding authorization headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClientInstance.interceptors.response.use(
  (response) => {
    // You can handle successful responses here
    return response;
  },
  (error) => {
    // You can handle errors here
    return Promise.reject(error);
  }
);

export default apiClientInstance;
