import { getClient } from ".";

const generateApiKey = async (label: string) => {
    try {
        const response = await (await getClient()).get(`generate_api_key?label=${label}`);
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
};

export default generateApiKey;