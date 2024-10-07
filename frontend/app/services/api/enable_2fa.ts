import { getClient } from ".";

const enable2fa = async (data: any) => {
    try {
        const response = await (await getClient()).post('enable_2fa', data);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default enable2fa;