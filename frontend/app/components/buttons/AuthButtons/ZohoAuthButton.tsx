import { useContext, useEffect, useState } from 'react';
import { AuthCodeEvent } from '~/types/oauth';
// import { zohoOauthClientId } from '~/constants/oauth/clientIds';
// import { zohoAuthCodeKey, zohoStateKey, zohoUniqueStateValue } from '~/constants/oauth/stateKeys';
import { zohoAuthCodeKey, zohoStateKey } from '~/constants/oauth/stateKeys';
// import { zohoOauthRedirectUri } from '~/constants/oauth/urls';
import zohoAuth from '~/services/api/auth/zoho';
import { Button } from '@nextui-org/button';
import ZohoIcon from '~/components/icons/logos/ZohoFullLogo';
import UserContext from '~/contexts/UserContext';
import { handleAuthCode, login } from '~/services/oauth';
import { Tooltip } from '@nextui-org/react';
import { siteName } from '~/constants/app';

// const url = 'https://accounts.zoho.com/oauth/v2/auth'
// const scope = 'ZohoCRM.modules.contacts.READ ZohoCRM.modules.leads.READ ZohoCRM.modules.vendors.READ ZohoCRM.modules.accounts.READ ZohoCRM.users.READ'

export default function ZohoAuthButton(props: any) {
  const { customText } = props;

  const [isLoading, setLoading] = useState(false);

  const { setUser, setTemp2faUserId } = useContext(UserContext)
  useEffect(() => {
    const handle = (event: MessageEvent<AuthCodeEvent>) => {
      handleAuthCode(event, setUser, setTemp2faUserId, zohoAuth, setLoading, zohoAuthCodeKey, zohoStateKey);
    };

    window.addEventListener('message', handle);
    return () => window.removeEventListener('message', handle);
  }, []);

  // const zohoLogin = async () => {
  //   await login(setLoading, zohoUniqueStateValue, zohoStateKey, zohoAuthCodeKey, zohoOauthClientId, zohoOauthRedirectUri, url, undefined, scope);
  // };

  return (
    // <Button style={{ justifyContent: 'flex-start' }} isLoading={isLoading} onClick={zohoLogin} variant="bordered" color="primary" startContent={!customText && <ZohoIcon />}>
    <Tooltip content={`Zoho SSO is temporarily disabled for authentication on ${siteName}. You may still import contacts from a Zoho CRM once logged in.`}>
      <div>
        <Button className='w-full' isDisabled style={{ justifyContent: 'flex-start' }} isLoading={isLoading} variant="bordered" color="primary" startContent={!customText && <ZohoIcon />}>
          {isLoading ? 'Loading...' : customText ?? 'Log in with Zoho'}
        </Button>
      </div>
    </Tooltip>
  )
}
