import apiClient from ".";

const generateApiKey = async (label: string) => {
    try {
        const response = await apiClient.get(`generate_api_key?label=${label}`);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default generateApiKey;