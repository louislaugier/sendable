import apiClient from ".";

const getUserData = async () => {
    try {
        const response = await apiClient.get('me');
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default getUserData;