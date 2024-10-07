import apiClient from "..";

const zohoAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_zoho', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default zohoAuth;