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
import { AuthModalType } from "~/types/modal";

const url = 'https://login.mailchimp.com/oauth2/authorize'

export default function MailchimpAuthButton(props: { customText?: string, modalType?: AuthModalType }) {
  const { customText, modalType } = props;
  const [isLoading, setLoading] = useState(false);

  const { setUser, setTemp2faUserId } = useContext(UserContext)
  
  useEffect(() => {
    const handleAuthCallback = async (event: MessageEvent<AuthCodeEvent>) => {
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
      {isLoading ? 'Loading...' : customText ?? `${modalType === AuthModalType.Signup ? AuthModalType.Signup : AuthModalType.Login} with Mailchimp`}
    </Button>
  );
}
