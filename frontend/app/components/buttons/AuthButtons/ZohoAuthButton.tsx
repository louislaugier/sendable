import { useContext, useEffect, useState } from 'react';
import { AuthCodeEvent } from '~/types/oauth';
import { zohoAuthCodeKey, zohoStateKey, zohoUniqueStateValue } from '~/constants/oauth/stateKeys';
import zohoAuth from '~/services/api/auth/zoho';
import { Button } from '@nextui-org/button';
import ZohoIcon from '~/components/icons/logos/ZohoFullLogo';
import UserContext from '~/contexts/UserContext';
import { handleAuthCode, login } from '~/services/oauth';
import { Tooltip } from '@nextui-org/react';
import { siteName } from '~/constants/app';
import { zohoOauthClientId } from '~/constants/oauth/clientIds';
import { zohoOauthRedirectUri } from '~/constants/oauth/urls';

const url = 'https://accounts.zoho.com/oauth/v2/auth'

export default function ZohoAuthButton(props: any) {
  const { customText } = props;

  const [isLoading, setLoading] = useState(false);

  const { setUser, setTemp2faUserId } = useContext(UserContext)
  
  useEffect(() => {
    const handleAuthCallback = async (event: MessageEvent<AuthCodeEvent>) => {
      await handleAuthCode(event, setUser, setTemp2faUserId, zohoAuth, setLoading, zohoAuthCodeKey, zohoStateKey);
    };

    window.addEventListener('message', handleAuthCallback);
    return () => {
      window.removeEventListener('message', handleAuthCallback);
    };
  }, [setUser, setTemp2faUserId]);

  const zohoLogin = async () => {
    setLoading(true);
    try {
      const success = await login(setLoading, zohoUniqueStateValue, zohoStateKey, zohoAuthCodeKey, zohoOauthClientId, zohoOauthRedirectUri, url);
      if (!success) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Zoho login error:", error);
      setLoading(false);
    }
  };

  return (
    <Tooltip content={`Zoho SSO is temporarily disabled for authentication on ${siteName}. You may still import contacts from a Zoho CRM once logged in.`}>
      <div>
        <Button className='w-full' isDisabled style={{ justifyContent: 'flex-start' }} isLoading={isLoading} onClick={zohoLogin} variant="bordered" color="primary" startContent={!customText && <ZohoIcon />}>
          {isLoading ? 'Loading...' : customText ?? 'Log in with Zoho'}
        </Button>
      </div>
    </Tooltip>
  )
}
