import { getClient } from "..";

const linkedinAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_linkedin', data);
        return response.data;
    } catch (error: any) {
        if (error?.response?.data.includes('user already exists with')) alert(error?.response?.data)
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default linkedinAuth;