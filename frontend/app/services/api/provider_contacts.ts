import { ContactProviderType } from "~/types/contactProvider";
import { getClient } from ".";

const getProviderContacts = async (provider: ContactProviderType, code?: string, codeVerifier?: string) => {
    if (!(await getClient()).defaults.headers.common['Authorization']) return;

    try {
        const params: Record<string, string> = {
            provider: provider,
        };

        if (codeVerifier) params.codeVerifier = codeVerifier;

        const response = await (await getClient()).get('provider_contacts', { params });

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default getProviderContacts;
