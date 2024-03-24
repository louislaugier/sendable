import apiClient from "..";

const linkedinAuth = async (data: any) => {
    console.log(data)
    try {
        const response = await apiClient.post('auth/linkedin', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default linkedinAuth;