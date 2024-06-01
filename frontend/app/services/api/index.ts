import axios from 'axios';
import { apiBaseUrl } from '~/constants/api';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// apiClient.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default apiClient;
