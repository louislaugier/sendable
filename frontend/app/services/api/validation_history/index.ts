import apiClient from "..";

const getValidationHistory = async (limit: number | undefined = undefined, offset: number | undefined = undefined) => {
    try {
        const response = await apiClient.get(`validation_history?limit=${limit ?? 10}&offset=${offset || 0}`);

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default getValidationHistory;