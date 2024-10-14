import { useContext, useEffect, useState } from 'react';
import { AuthCodeEvent } from '~/types/oauth';
import { mailchimpOauthClientId } from '~/constants/oauth/clientIds';
import { mailchimpAuthCodeKey, mailchimpStateKey, mailchimpUniqueStateValue } from '~/constants/oauth/stateKeys';
import { mailchimpOauthRedirectUri } from '~/constants/oauth/urls';
import mailchimpAuth from '~/services/api/auth/mailchimp';
import { Button } from '@nextui-org/button';
import MailchimpIcon from '~/components/icons/logos/MailchimpLogo';
import UserContext from '~/contexts/UserContext';
import { handleAuthCode, login } from '~/services/oauth';

const url = 'https://login.mailchimp.com/oauth2/authorize'

export default function MailchimpAuthButton(props: any) {
  const { customText } = props;
  const [isLoading, setLoading] = useState(false);

  const { setUser, setTemp2faUserId } = useContext(UserContext)
  
  useEffect(() => {
    const handleAuthCallback = async (event: MessageEvent<AuthCodeEvent>) => {
      console.log("MailchimpAuthButton received message event:", event);
      await handleAuthCode(event, setUser, setTemp2faUserId, mailchimpAuth, setLoading, mailchimpAuthCodeKey, mailchimpStateKey);
    };

    window.addEventListener('message', handleAuthCallback);
    return () => {
      window.removeEventListener('message', handleAuthCallback);
    };
  }, [setUser, setTemp2faUserId]);

  const mailchimpLogin = async () => {
    setLoading(true);
    try {
      const success = await login(setLoading, mailchimpUniqueStateValue, mailchimpStateKey, mailchimpAuthCodeKey, mailchimpOauthClientId, mailchimpOauthRedirectUri, url);
      if (!success) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Mailchimp login error:", error);
      setLoading(false);
    }
  };

  return (
    <Button style={{ justifyContent: 'flex-start' }} isLoading={isLoading} onClick={mailchimpLogin} variant="bordered" color="primary" startContent={!customText && <MailchimpIcon />}>
      <p style={{ marginLeft: customText ? "0px" : "7px" }}>{isLoading ? 'Loading...' : customText ? customText : 'Log in with Mailchimp'}</p>
    </Button>
  );
}
