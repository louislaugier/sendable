import { getClient } from "..";

const salesforceAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_salesforce', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default salesforceAuth;