import apiClient from ".";

const resetPassword = async (data: any) => {
    try {
        const response = await apiClient.post('reset_password', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('429')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default resetPassword;