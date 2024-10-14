import { getClient } from "..";

const googleAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_google', data);
        return response.data;
    } catch (error) {
        console.error('Google Auth Error:', error);
        throw error; // Re-throw the error so it can be caught in the component
    }
};

export default googleAuth;
