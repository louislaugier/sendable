
import { useEffect, useState } from 'react';
import { AuthCodeEvent } from '~/components/types/oauth';
import { salesforceOauthClientId } from '~/constants/oauth/clientIds';
import { salesforceAuthCodeKey, salesforceCodeVerifierKey, salesforceStateKey, salesforceUniqueStateValue } from '~/constants/oauth/stateKeys';
import { salesforceOauthRedirectUri } from '~/constants/oauth/urls';
import salesforceAuth from '~/services/api/auth/salesforce';
import { handleAuthCode } from '~/services/auth/oauth';
import { fetchSalesforcePKCE } from '~/services/salesforce/pkce';

export default function SalesforceAuthButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handle = (event: MessageEvent<AuthCodeEvent>) => {
      handleAuthCode(event, salesforceAuth, setLoading, salesforceAuthCodeKey, salesforceStateKey, salesforceCodeVerifierKey);
    };

    window.addEventListener('message', handle);
    return () => window.removeEventListener('message', handle);
  }, []);

  const salesforceLogin = async () => {
    setLoading(true);
    // Prepare PKCE and state parameters
    const pkceParams = await fetchSalesforcePKCE();
    sessionStorage.setItem(salesforceCodeVerifierKey, pkceParams.code_verifier);

    // Generate a unique state value
    const stateValue = salesforceUniqueStateValue;
    sessionStorage.setItem(salesforceStateKey, stateValue);

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
          window.postMessage({ type: salesforceAuthCodeKey, code, state }, window.location.origin);
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
