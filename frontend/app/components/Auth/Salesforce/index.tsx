
import { useEffect, useState } from 'react';
import { AuthCodeEvent } from '~/components/types/oauth';
import { salesforceOauthClientId } from '~/constants/oauth/clientIds';
import { salesforceAuthCodeKey, salesforceCodeVerifierKey, salesforceStateKey, salesforceUniqueStateValue } from '~/constants/oauth/stateKeys';
import { salesforceOauthRedirectUri } from '~/constants/oauth/urls';
import salesforceAuth from '~/services/api/auth/salesforce';
import { handleAuthCode, login } from '~/services/auth/oauth';

const url = 'https://login.salesforce.com/services/oauth2/authorize'

export default function SalesforceAuthButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handle = (event: MessageEvent<AuthCodeEvent>) => handleAuthCode(event, salesforceAuth, setLoading, salesforceAuthCodeKey, salesforceStateKey, salesforceCodeVerifierKey);

    window.addEventListener('message', handle);
    return () => window.removeEventListener('message', handle);
  }, []);



  const salesforceLogin = async () => {
    await login(setLoading, salesforceUniqueStateValue, salesforceStateKey, salesforceAuthCodeKey, salesforceOauthClientId, salesforceOauthRedirectUri, url, salesforceCodeVerifierKey);
  };

  return (
    <button disabled={isLoading} onClick={salesforceLogin}>
      Log in with Salesforce
    </button>
  );
}
