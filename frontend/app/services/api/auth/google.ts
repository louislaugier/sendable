import apiClient from "..";

const googleAuth = async (data: any) => {
    try {
        const response = await apiClient.post('auth_google', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default googleAuth;