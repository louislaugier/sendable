import apiClient from ".";

const disable2fa = async () => {
    try {
        const response = await apiClient.get('disable_2fa');
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default disable2fa;