import apiClient from ".";

const signup = async (data: any) => {
    try {
        const response = await apiClient.post('signup', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('409')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default signup;