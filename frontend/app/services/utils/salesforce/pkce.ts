import salesforceApiClient from ".";

export const fetchSalesforcePKCE = async () => {
    try {
        // Endpoint provided by Salesforce to generate PKCE parameters
        const response = await salesforceApiClient.get('services/oauth2/pkce/generator');

        // We assume the server returns the structure { code_challenge, code_verifier }
        return response.data;
    } catch (error) {
        console.error('Error fetching Salesforce PKCE parameters:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};