import axios from 'axios';
import { salesforceAppUrl } from '~/constants/oauth';

export const salesforceApiClientInstance = axios.create({
    baseURL: `https://bypass-all-cors-sf7k.onrender.com/${salesforceAppUrl}`, // Replace with your Salesforce domain
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        // Add other default Salesforce API headers if needed
    },
});

salesforceApiClientInstance.interceptors.request.use(
    (config) => {
        // Modify the request config here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

salesforceApiClientInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses here
        return response;
    },
    (error) => {
        // Handle errors here
        return Promise.reject(error);
    }
);

export default salesforceApiClientInstance;
