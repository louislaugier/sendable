import apiClient from "..";

const getValidationHistory = async () => {
    try {
        const response = await apiClient.get('validation_history');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default getValidationHistory;