import apiClient from ".";

const enable2fa = async (data: any) => {
    try {
        const response = await apiClient.post('enable_2fa', data);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default enable2fa;