import apiClient from "..";

const hubspotAuth = async (data: any) => {
    try {
        const response = await apiClient.post('oauth/hubspot', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default hubspotAuth;