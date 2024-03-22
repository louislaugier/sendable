
import { useEffect, useState } from 'react';
import { zohoOauthClientId, zohoOauthRedirectUri } from '~/constants/oauth';


export default function ZohoforceAuthButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {

  }, []);

  const zohoLogin = async () => {
    const clientId = zohoOauthClientId;
    const redirectUri = encodeURIComponent(zohoOauthRedirectUri);
    // const scope = encodeURIComponent("ZohoCRM.modules.leads.READ,ZohoCRM.modules.contacts.READ,ZohoCRM.modules.vendors.READ,ZohoCRM.modules.users.READ");
    // const scope = encodeURIComponent("ZohoCRM.modules.leads,ZohoCRM.modules.contacts,ZohoCRM.modules.vendors,ZohoCRM.modules.users");
    const scope = encodeURIComponent("ZohoCRM.modules.ALL");
    const responseType = "code";
    window.location.href = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=${responseType}&access_type=offline&redirect_uri=${redirectUri}`;
  };

  return (
    <button disabled={isLoading} onClick={zohoLogin}>
      Log in with Zoho
    </button>
  );
}
