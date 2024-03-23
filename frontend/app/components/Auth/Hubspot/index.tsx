import { useEffect, useState } from "react";
import { AuthCodeEvent } from "~/components/types/oauth";
import { hubspotOauthClientId } from "~/constants/oauth/clientIds";
import { hubspotAuthCodeKey, hubspotStateKey, hubspotUniqueStateValue } from "~/constants/oauth/stateKeys";
import { hubspotOauthRedirectUri } from "~/constants/oauth/urls";
import hubspotAuth from "~/services/api/auth/hubspot";
import { handleAuthCode } from "~/services/auth/oauth";

export default function HubspotAuthButton() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const handle = (event: MessageEvent<AuthCodeEvent>) => {
            handleAuthCode(event, hubspotAuth, setLoading, hubspotAuthCodeKey, hubspotStateKey);
        };

        window.addEventListener('message', handle);
        return () => window.removeEventListener('message', handle);
    }, []);

    const hubspotLogin = () => {
        setLoading(true);

        const stateValue = hubspotUniqueStateValue;
        sessionStorage.setItem(hubspotStateKey, stateValue);

        const loginUrl = new URL('https://app-eu1.hubspot.com/oauth/authorize');
        loginUrl.searchParams.append('client_id', hubspotOauthClientId);
        loginUrl.searchParams.append('scope', 'crm.objects.contacts.read');
        loginUrl.searchParams.append('redirect_uri', hubspotOauthRedirectUri);
        loginUrl.searchParams.append('response_type', 'code');
        loginUrl.searchParams.append('state', stateValue);

        const popup = window.open(loginUrl.href, '_blank', 'width=800,height=600');

        // Poll the popup for the redirect with the auth code
        const pollPopup = () => {
            if (popup!.closed) {
                setLoading(false);
                return;
            }

            try {
                const popupUrl = new URL(popup!.location.href);
                if (popupUrl.origin === window.location.origin && popupUrl.searchParams.get('code')) {
                    const code = popupUrl.searchParams.get('code');
                    const state = popupUrl.searchParams.get('state');
                    window.postMessage({ type: 'hubspot-auth-code', code, state }, window.location.origin);
                    popup!.close();
                }
            } catch (error) {
                // Ignore CORS errors if the popup is not redirected yet
            }

            setTimeout(pollPopup, 500);
        };

        setTimeout(pollPopup, 500);
    };

    return (
        <button disabled={isLoading} onClick={hubspotLogin}>
            Log in with HubSpot
        </button>
    );
}
