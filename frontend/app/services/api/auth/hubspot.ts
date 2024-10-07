import { getClient } from "..";

const hubspotAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_hubspot', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default hubspotAuth;