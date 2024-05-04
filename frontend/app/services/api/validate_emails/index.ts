import { AxiosError } from "axios";
import apiClient from "..";

const validateEmails = async (data: any) => {
    try {
        const response = await apiClient.post('validate_emails', data);
        return response.data;
    } catch (error: any) {
        if (error.response && (error as AxiosError).response?.status === 429) {
            console.error('Too many requests error:', error);
            throw new Error('Too many requests');
        } else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default validateEmails;