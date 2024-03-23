
import { useEffect, useState } from 'react';
import { zohoOauthClientId } from '~/constants/oauth/clientIds';
import { zohoOauthRedirectUri } from '~/constants/oauth/urls';


export default function ZohoforceAuthButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {

  }, []);

  const zohoLogin = async () => {
    const scope = encodeURIComponent("ZohoCRM.modules.contacts.READ ZohoCRM.modules.leads.READ ZohoCRM.modules.vendors.READ ZohoCRM.users.READ");

    const responseType = "code";
    window.location.href = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${zohoOauthClientId}&response_type=${responseType}&access_type=offline&redirect_uri=${encodeURIComponent(zohoOauthRedirectUri)}`;
  };

  return <button disabled={isLoading} onClick={zohoLogin}>
    Log in with Zoho
  </button>;
}
