import apiClient from "..";

const linkedinAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_linkedin', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default linkedinAuth;