import { useEffect, useState } from "react";
import { AuthCodeEvent } from "~/components/types/oauth";
import { hubspotOauthClientId } from "~/constants/oauth/clientIds";
import { hubspotAuthCodeKey, hubspotStateKey, hubspotUniqueStateValue } from "~/constants/oauth/stateKeys";
import { hubspotOauthRedirectUri } from "~/constants/oauth/urls";
import hubspotAuth from "~/services/api/auth/hubspot";
import { handleAuthCode, login } from "~/services/auth/oauth";

const url = 'https://app-eu1.hubspot.com/oauth/authorize'
const scope = 'crm.objects.contacts.read'

export default function HubspotAuthButton() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const handle = (event: MessageEvent<AuthCodeEvent>) => {
            handleAuthCode(event, hubspotAuth, setLoading, hubspotAuthCodeKey, hubspotStateKey);
        };

        window.addEventListener('message', handle);
        return () => window.removeEventListener('message', handle);
    }, []);

    const hubspotLogin = async () => {
        await login(setLoading, hubspotUniqueStateValue, hubspotStateKey, hubspotAuthCodeKey, hubspotOauthClientId, hubspotOauthRedirectUri, url, undefined, scope);
    };

    return (
        <button disabled={isLoading} onClick={hubspotLogin}>
            {isLoading ? 'Logging in...' : 'Log in with HubSpot'}
        </button>
    );
}
