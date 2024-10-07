import apiClient from "..";

const mailchimpAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_mailchimp', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default mailchimpAuth;