import apiClient from "..";

const salesforceAuth = async (data: any) => {
    try {
        const response = await apiClient.post('oauth/salesforce', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default salesforceAuth;