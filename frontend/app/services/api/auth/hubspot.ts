import { getClient } from "..";

const hubspotAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_hubspot', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('user already exists with provider')) alert(error?.response?.data)
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default hubspotAuth;