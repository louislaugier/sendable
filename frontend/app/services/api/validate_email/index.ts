import { AxiosError } from "axios";
import apiClient from "..";

const validateEmail = async (data: any) => {
    try {
        const response = await apiClient.post('validate_email', data);
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

export default validateEmail;