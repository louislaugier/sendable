import apiClientInstance from "..";

const salesforceAuth = async (data: any) => {
    try {
        const response = await apiClientInstance.post('auth/salesforce', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default salesforceAuth;