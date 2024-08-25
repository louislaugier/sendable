import apiClient from ".";

const emailSignup = async (data: any) => {
    try {
        const response = await apiClient.post('email_signup', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('409')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default emailSignup;