import { getClient } from ".";

const emailSignup = async (data: any) => {
    try {
        const response = await (await getClient()).post('email_signup', data);
        return response.data;
    } catch (error: any) {
        if (error?.response?.data.includes('user already exists with') || error?.response?.data.includes('address already in use')) alert(error?.response?.data)
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default emailSignup;