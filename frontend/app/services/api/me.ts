import { getClient } from ".";

const getUserData = async () => {
    try {
        const response = await (await getClient()).get('me');
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default getUserData;