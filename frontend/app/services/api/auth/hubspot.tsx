import apiClientInstance from "..";

const hubspotAuth = async (data: any) => {
    try {
        const response = await apiClientInstance.post('auth/hubspot', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default hubspotAuth;