import apiClient from ".";

const authEmail = async (data: any) => {
    try {
        const response = await apiClient.post('auth_email', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('401')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default authEmail;