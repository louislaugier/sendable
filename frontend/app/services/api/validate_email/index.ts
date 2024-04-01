import apiClient from "..";

const validateEmail = async (data: any) => {
    try {
        const response = await apiClient.post('validate_email', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default validateEmail;