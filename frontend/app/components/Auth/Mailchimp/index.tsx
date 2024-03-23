import { useEffect, useState } from 'react';
import { mailchimpOauthClientId } from '~/constants/oauth/clientIds';
import { mailchimpOauthRedirectUri } from '~/constants/oauth/urls';

export default function MailchimpAuthButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // Code for handling authentication callback can be added here
  }, []);

  const mailchimpLogin = async () => {
    try {
      setLoading(true);
      // Redirect user to Mailchimp authentication URL
      window.location.href = `https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=${mailchimpOauthClientId}&redirect_uri=${mailchimpOauthRedirectUri}`;
    } catch (error) {
      console.error('Error occurred during Mailchimp login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={isLoading} onClick={mailchimpLogin}>
      {isLoading ? 'Logging in...' : 'Log in with Mailchimp'}
    </button>
  );
}