import { getClient } from "..";

const googleAuth = async (data: any) => {
    try {
        const response = await (await getClient()).post('auth_google', data);
        let userData = response.data;
        
        if (!userData.currentPlan) {
            userData.currentPlan = {
                type: 'Free',
                // Add other necessary properties for the free plan
            };
        }
        
        return userData;
    } catch (error) {
        console.error('Google Auth Error:', error);
        throw error;
    }
};

export default googleAuth;
