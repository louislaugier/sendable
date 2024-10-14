import { getClient } from "..";

const googleAuth = async (data: { accessToken?: string, jwt?: string }) => {
    try {
        const response = await (await getClient()).post('auth_google', data);
        let userData = response.data;
        
        return userData;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default googleAuth;
