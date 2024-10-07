import { getClient } from ".";

const updateEmailAddress = async (data: any) => {
    try {
        const response = await (await getClient()).post('update_email_address', data);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default updateEmailAddress;