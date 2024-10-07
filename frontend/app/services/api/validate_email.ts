import { getClient } from ".";

const validateEmail = async (data: any) => {
    try {
        const response = await (await getClient()).post('validate_email', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('429')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default validateEmail;