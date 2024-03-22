
import { useEffect, useState } from 'react';

export default function MailchimpforceAuthButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {

  }, []);

  const mailchimpLogin = async () => {
  };

  return (
    <button disabled={isLoading} onClick={mailchimpLogin}>
      Log in with Mailchimp
    </button>
  );
}
