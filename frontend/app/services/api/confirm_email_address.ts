import { getClient } from ".";

interface ConfirmEmailParams {
    email: string;
    code: string;
    isNewAccount?: boolean;
    isZohoConfirmation?: boolean;
}

const confirmEmail = async (params: ConfirmEmailParams) => {
    try {
        const queryParams = new URLSearchParams({
            email: params.email,
            code: params.code,
            isNewAccount: params.isNewAccount ? 'true' : 'false',
            isZohoConfirmation: params.isZohoConfirmation ? 'true' : 'false'
        });

        const response = await (await getClient()).get(`confirm_email_address?${queryParams}`);
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('401')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default confirmEmail;