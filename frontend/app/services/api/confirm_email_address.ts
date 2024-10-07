import { getClient } from ".";

const confirmEmail = async (data: any) => {
    try {
        const response = await (await getClient()).post('confirm_email_address', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('401')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default confirmEmail;