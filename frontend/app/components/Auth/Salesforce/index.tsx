import { useEffect, useState } from 'react';
import { salesforceOauthClientId, salesforceOauthRedirectUri } from '~/constants/oauth';
import salesforceAuth from '~/services/api/auth/salesforce';
import { fetchSalesforcePKCE } from '~/services/salesforce/pkce';

const SALESFORCE_STATE_KEY = 'salesforceOauthState';
const SALESFORCE_CODE_VERIFIER_KEY = 'salesforceCodeVerifier';

export default function SalesforceAuthButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // Function to handle message event
    const handleAuthCode = (event: any) => {
      if (event.origin !== window.location.origin) {
        // Optionally check the origin if you want to be more secure
        return;
      }

      if (event.data?.type === 'salesforce-auth-code') {
        const { code, state } = event.data;
        const storedState = sessionStorage.getItem(SALESFORCE_STATE_KEY);

        if (code && state && storedState === state) {
          setLoading(true);
          sessionStorage.removeItem(SALESFORCE_STATE_KEY); // Clean up

          const codeVerifier = sessionStorage.getItem(SALESFORCE_CODE_VERIFIER_KEY);
          sessionStorage.removeItem(SALESFORCE_CODE_VERIFIER_KEY); // Remove the code verifier as well

          // Call the Salesforce auth function with the code
          salesforceAuth({ code, code_verifier: codeVerifier })
            .then(() => {
              // Set localStorage or handle auth success
              window.close(); // Close the popup once done
            }).catch(error => {
              console.error('Salesforce login error:', error);
            }).finally(() => {
              setLoading(false);
            });
        }
      }
    };

    // Listen for messages from the popup
    window.addEventListener('message', handleAuthCode);

    // Cleanup listener on unmount
    return () => window.removeEventListener('message', handleAuthCode);
  }, []);

  const salesforceLogin = async () => {
    setLoading(true);
    // Prepare PKCE and state parameters
    const pkceParams = await fetchSalesforcePKCE();
    sessionStorage.setItem(SALESFORCE_CODE_VERIFIER_KEY, pkceParams.code_verifier);

    // Generate a unique state value
    const stateValue = 'salesforce_unique_state_value';
    sessionStorage.setItem(SALESFORCE_STATE_KEY, stateValue);

    // Build the Salesforce login URL with query parameters
    const loginUrl = new URL('https://login.salesforce.com/services/oauth2/authorize');
    loginUrl.searchParams.append('response_type', 'code');
    loginUrl.searchParams.append('client_id', salesforceOauthClientId);
    loginUrl.searchParams.append('redirect_uri', salesforceOauthRedirectUri);
    loginUrl.searchParams.append('code_challenge', pkceParams.code_challenge);
    loginUrl.searchParams.append('code_challenge_method', 'S256');
    loginUrl.searchParams.append('state', stateValue);


    const popup = window.open(loginUrl.href, '_blank', 'width=500,height=600');

    // Poll the popup for the redirect with the auth code
    const pollPopup = () => {
      if (popup!.closed) {
        setLoading(false);
        return;
      }

      try {
        const popupUrl = new URL(popup!.location.href);
        if (popupUrl.origin === window.location.origin && popupUrl.searchParams.get('code')) {
          const code = popupUrl.searchParams.get('code');
          const state = popupUrl.searchParams.get('state');
          window.postMessage({ type: 'salesforce-auth-code', code, state }, window.location.origin);
          popup!.close();
        }
      } catch (error) {
        // Ignore CORS errors if the popup is not redirected yet
      }

      setTimeout(pollPopup, 500);
    };

    setTimeout(pollPopup, 500);
  };

  return (
    <button disabled={isLoading} onClick={salesforceLogin}>
      Log in with Salesforce
    </button>
  );
}
