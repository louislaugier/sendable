import React, { useEffect, useState } from 'react';
import { domain, salesforceOauthClientId, salesforceOauthRedirectUri } from '~/constants/oauth';
import salesforceAuth from '~/services/api/auth/salesforce';
import { fetchSalesforcePKCE } from '~/services/salesforce/pkce';

const SALESFORCE_STATE_KEY = 'salesforceOauthState';
const SALESFORCE_CODE_VERIFIER_KEY = 'salesforceCodeVerifier';

export default function SalesforceAuthButton() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        const state = queryParams.get('state');
        const storedState = sessionStorage.getItem(SALESFORCE_STATE_KEY);

        if (code && state && storedState === state) {
            setLoading(true);
            sessionStorage.removeItem(SALESFORCE_STATE_KEY); // Clean up

            const codeVerifier = sessionStorage.getItem(SALESFORCE_CODE_VERIFIER_KEY);
            sessionStorage.removeItem(SALESFORCE_CODE_VERIFIER_KEY); // Remove the code verifier as well

            salesforceAuth({ code, code_verifier: codeVerifier }) // Call the Salesforce auth function
                // Assuming salesforceAuth resolves to indicate success or the final promise chain state
                .then(() => {
                    window.close(); // Close the popup once done, correct implementation
                })
                .catch(error => {
                    console.error('Salesforce login error:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    const salesforceLogin = async () => {
        setLoading(true);

        const pkceParams = await fetchSalesforcePKCE();
        sessionStorage.setItem(SALESFORCE_CODE_VERIFIER_KEY, pkceParams.code_verifier);

        // The stateValue could be any unique string. For enhanced security, this should be less predictable.
        const stateValue = 'salesforce_unique_state_value';
        sessionStorage.setItem(SALESFORCE_STATE_KEY, stateValue);

        const loginUrl = new URL('https://login.salesforce.com/services/oauth2/authorize');
        loginUrl.searchParams.append('response_type', 'code');
        loginUrl.searchParams.append('client_id', salesforceOauthClientId);
        loginUrl.searchParams.append('redirect_uri', salesforceOauthRedirectUri);
        loginUrl.searchParams.append('code_challenge', pkceParams.code_challenge);
        loginUrl.searchParams.append('code_challenge_method', 'S256');
        loginUrl.searchParams.append('state', stateValue);

        window.open(loginUrl.href, '_blank', 'width=500,height=600');
        setLoading(false);
    };

    return (
        <button disabled={isLoading} onClick={salesforceLogin}>
            Log in with Salesforce
        </button>
    );
}
