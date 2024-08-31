import apiClient from ".";

const deleteProviderApiKey = async (data: any) => {
    try {
        const response = await apiClient.post('delete_provider_api_key', data);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default deleteProviderApiKey;