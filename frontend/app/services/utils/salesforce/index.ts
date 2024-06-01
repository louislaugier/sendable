import axios from 'axios';
import { salesforceAppUrl } from '~/constants/oauth/urls';

export const salesforceApiClient = axios.create({
    baseURL: `https://bypass-all-cors-sf7k.onrender.com/${salesforceAppUrl}`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default salesforceApiClient;
