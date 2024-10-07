import { getClient } from ".";

const upsertProviderApiKey = async (data: any) => {
    try {
        const response = await (await getClient()).post('upsert_provider_api_key', data);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('401')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default upsertProviderApiKey;