import apiClient from "..";

const validateEmails = async (data: any) => {
    try {
        const response = await apiClient.post('validate_emails', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('429')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default validateEmails;