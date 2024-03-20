import { sha256 } from 'js-sha256';
import { useEffect, useState } from 'react';
// import { generateCodeChallenge } from '~/components/utils/pkce';
import { domain, salesforceOauthClientId } from '~/constants/oauth';
import salesforceAuth from '~/services/api/auth/salesforce';
import { fetchSalesforcePKCE } from '~/services/salesforce/pkce';


export default function SalesforceAuthButton(): JSX.Element {

    let isLoggedAttemptProcessed = false; // flag to track if the postMessage has been processed

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const codeFromUrl = queryParams.get('code');
        const errorFromUrl = queryParams.get('error');

        // If an error is present in the URL params and the window was opened by another window,
        // close it to indicate the process has been cancelled or failed.
        if (errorFromUrl && window.opener) {
            window.close();
            return; // Do not process further since there's an error
        }

        // Process the authorization code if it exists and the window has a parent window
        if (codeFromUrl && window.opener) {
            window.opener.postMessage({ type: 'salesforce_auth_code', code: codeFromUrl }, domain);
            // Remove code param from URL by updating state
            window.history.replaceState({}, '', window.location.pathname);
            window.close();
        }

        const handleMessage = async (event: MessageEvent) => {
            if (!isLoggedAttemptProcessed && event.origin === domain && event.data?.type === 'salesforce_auth_code') {
                isLoggedAttemptProcessed = true; // Set flag to true after processing message
                const { code } = event.data;

                // Update URL to reflect the code parameter
                window.history.replaceState({}, '', `${window.location.pathname}?code=${code}`);

                const codeVerifier = sessionStorage.getItem("codeVerifier");
                try { await salesforceAuth({ code, code_verifier: codeVerifier }) } catch { }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
            isLoggedAttemptProcessed = false; // Reset flag during cleanup
        };
    }, []);

    const salesforceLogin = async () => {
        sessionStorage.removeItem("key");

        const pkceParams = await fetchSalesforcePKCE();
        sessionStorage.setItem("codeVerifier", pkceParams.code_verifier);

        // This should be a callback URL where you handle the OAuth response
        const redirectUri = `${domain}`;

        // Construct the Salesforce login URL
        const loginUrl = `https://login.salesforce.com/services/oauth2/authorize?`
            + `response_type=code&client_id=${encodeURIComponent(salesforceOauthClientId)}`
            + `&redirect_uri=${encodeURIComponent(redirectUri)}`
            + `&code_challenge=${encodeURIComponent(pkceParams.code_challenge)}`
            + `&code_challenge_method=S256`;

        // Open Salesforce login in a new popup
        window.open(loginUrl, '_blank', 'width=500,height=600');
    };

    return (
        <button onClick={salesforceLogin}>Log in with Salesforce</button>
    );
}
