import apiClient from ".";

const deleteAccount = async () => {
    try {
        const response = await apiClient.get('delete_account');
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default deleteAccount;