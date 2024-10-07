import { getClient } from ".";

const updatePassword = async (data: any) => {
    try {
        const response = await (await getClient()).post('update_password', data);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default updatePassword;