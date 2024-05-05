import apiClient from "..";

const validateEmail = async (data: any) => {
    try {
        const response = await apiClient.post('validate_email', data);
        return response.data;
    } catch (error: any) {
        console.log(error?.message?.includes('429'), error.message)
        if (error?.message?.includes('429')) return 429
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default validateEmail;