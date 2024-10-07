import { getClient } from ".";

const getValidationHistory = async (limit: number | undefined = undefined, offset: number | undefined = undefined) => {
    if (!(await getClient()).defaults.headers.common['Authorization']) return
    
    try {
        const response = await (await getClient()).get(`validation_history?limit=${limit ?? 10}&offset=${offset || 0}`);

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default getValidationHistory;