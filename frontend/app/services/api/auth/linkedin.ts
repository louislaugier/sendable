import apiClient from "..";

const linkedinAuth = async (data: any) => {
    try {
        const response = await apiClient.post('oauth/linkedin', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default linkedinAuth;