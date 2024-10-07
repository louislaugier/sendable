import { getClient } from ".";

const resetPassword = async (data: any) => {
    try {
        const response = await (await getClient()).post('reset_password', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('400') || error?.message?.includes('404') ) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default resetPassword;