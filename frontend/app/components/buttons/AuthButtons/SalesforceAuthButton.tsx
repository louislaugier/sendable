
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

  const { setUser } = useContext(UserContext)

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handle = (event: MessageEvent<AuthCodeEvent>) => handleAuthCode(event, setUser, salesforceAuth, setLoading, salesforceAuthCodeKey, salesforceStateKey, salesforceCodeVerifierKey);

    window.addEventListener('message', handle);
    return () => window.removeEventListener('message', handle);
  }, []);

  const salesforceLogin = async () => {
    await login(setLoading, salesforceUniqueStateValue, salesforceStateKey, salesforceAuthCodeKey, salesforceOauthClientId, salesforceOauthRedirectUri, url, salesforceCodeVerifierKey);
  };

  return (
    <Button style={{ justifyContent: 'flex-start' }} isDisabled={isLoading} onClick={salesforceLogin} color='primary' variant="bordered" startContent={!customText && <SalesforceIcon />}>
      <p className='text-red'>{isLoading ? 'Loading...' : customText ?? 'Log in with Salesforce'}</p>
    </Button>
  );
}
