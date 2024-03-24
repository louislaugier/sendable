import { useEffect, useState } from 'react';
import { AuthCodeEvent } from '~/types/oauth';
import { mailchimpOauthClientId } from '~/constants/oauth/clientIds';
import { mailchimpAuthCodeKey, mailchimpStateKey, mailchimpUniqueStateValue } from '~/constants/oauth/stateKeys';
import { mailchimpOauthRedirectUri } from '~/constants/oauth/urls';
import mailchimpAuth from '~/services/api/auth/mailchimp';
import { handleAuthCode, login } from '~/services/auth/oauth';
import { Button } from '@nextui-org/button';
import MailchimpIcon from '~/components/icons/logos/Mailchimp';

const url = 'https://login.mailchimp.com/oauth2/authorize'

export default function MailchimpAuthButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handle = (event: MessageEvent<AuthCodeEvent>) => {
      handleAuthCode(event, mailchimpAuth, setLoading, mailchimpAuthCodeKey, mailchimpStateKey);
    };

    window.addEventListener('message', handle);
    return () => window.removeEventListener('message', handle);
  }, []);

  const mailchimpLogin = async () => {
    await login(setLoading, mailchimpUniqueStateValue, mailchimpStateKey, mailchimpAuthCodeKey, mailchimpOauthClientId, mailchimpOauthRedirectUri, url);
  };

  return (
    <Button style={{ justifyContent: 'flex-start' }} isDisabled={isLoading} onClick={mailchimpLogin} variant="bordered" startContent={<MailchimpIcon />}>
      <p style={{ marginLeft: "7px" }}>{isLoading ? 'Loading...' : 'Log in with Mailchimp'}</p>
    </Button>
  );
}