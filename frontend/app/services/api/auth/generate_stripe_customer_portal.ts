import apiClient from "..";

const generateStripeCustomerPortal = async (data: any) => {
    try {
        const response = await apiClient.post('generate_stripe_customer_portal', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default generateStripeCustomerPortal;
