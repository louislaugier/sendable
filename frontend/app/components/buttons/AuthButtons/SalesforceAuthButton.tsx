import { useContext, useEffect, useState } from 'react';
import { AuthCodeEvent } from '~/types/oauth';
import { salesforceOauthClientId } from '~/constants/oauth/clientIds';
import { salesforceAuthCodeKey, salesforceCodeVerifierKey, salesforceStateKey, salesforceUniqueStateValue } from '~/constants/oauth/stateKeys';
import { salesforceOauthRedirectUri } from '~/constants/oauth/urls';
import salesforceAuth from '~/services/api/auth/salesforce';
import { Button } from '@nextui-org/button';
import SalesforceIcon from '~/components/icons/logos/SalesforceFullLogo';
import UserContext from '~/contexts/UserContext';
import { handleAuthCode, login } from '~/services/oauth';

const url = 'https://login.salesforce.com/services/oauth2/authorize'

export default function SalesforceAuthButton(props: any) {
  const { customText } = props;

  const [isLoading, setLoading] = useState(false);

  const { setUser, setTemp2faUserId } = useContext(UserContext)
  
  useEffect(() => {
    const handleAuthCallback = async (event: MessageEvent<AuthCodeEvent>) => {
      await handleAuthCode(event, setUser, setTemp2faUserId, salesforceAuth, setLoading, salesforceAuthCodeKey, salesforceStateKey, salesforceCodeVerifierKey);
    };

    window.addEventListener('message', handleAuthCallback);
    return () => {
      window.removeEventListener('message', handleAuthCallback);
    };
  }, [setUser, setTemp2faUserId]);

  const salesforceLogin = async () => {
    setLoading(true);
    try {
      const success = await login(setLoading, salesforceUniqueStateValue, salesforceStateKey, salesforceAuthCodeKey, salesforceOauthClientId, salesforceOauthRedirectUri, url, salesforceCodeVerifierKey);
      if (!success) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Salesforce login error:", error);
      setLoading(false);
    }
  };

  return (
    <Button style={{ justifyContent: 'flex-start' }} isLoading={isLoading} onClick={salesforceLogin} color='primary' variant="bordered" startContent={!customText && <SalesforceIcon />}>
      <p className='text-red'>{isLoading ? 'Loading...' : customText ?? 'Log in with Salesforce'}</p>
    </Button>
  );
}
