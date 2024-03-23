import apiClient from "..";

export const facebookAuth = async (data: any) => {
    try {
        const response = await apiClient.post('auth/facebook', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default facebookAuth;