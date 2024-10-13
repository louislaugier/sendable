import { getClient } from ".";

const validateEmail = async (data: any, provider?: string) => {
    try {
        let url = 'validate_email';
        if (provider) {
            url += `?provider=${encodeURIComponent(provider)}`;
        }
        const response = await (await getClient()).post(url, data);
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
