import { getClient } from ".";

const disable2fa = async (data: any) => {
    try {
        const response = await (await getClient()).post('disable_2fa', data);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default disable2fa;