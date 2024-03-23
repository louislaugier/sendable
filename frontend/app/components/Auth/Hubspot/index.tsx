import { useEffect, useState } from "react";
import { HubspotAuthCodeEvent } from "~/components/types/oauth";
import { hubspotOauthClientId } from "~/constants/oauth/clientIds";
import { hubspotStateKey } from "~/constants/oauth/stateKeys";
import { hubspotOauthRedirectUri } from "~/constants/oauth/urls";
import hubspotAuth from "~/services/api/auth/hubspot";

export default function HubspotAuthButton() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const handleAuthCode = (event: MessageEvent<HubspotAuthCodeEvent>) => {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data.type === 'hubspot-auth-code') {
                const { code, state } = event.data;
                const storedState = sessionStorage.getItem(hubspotStateKey);

                if (code && state && storedState === state) {
                    setLoading(true);
                    sessionStorage.removeItem(hubspotStateKey);
                    hubspotAuth({ code: code! }) // Assuming code is non-nullable in the auth function
                        .then(() => {
                            console.log('login ok')
                        })
                        .catch(error => {
                            console.error('HubSpot login error:', error);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }
            }
        };

        window.addEventListener('message', handleAuthCode);
        return () => window.removeEventListener('message', handleAuthCode);
    }, []);

    const hubspotLogin = () => {
        setLoading(true);

        const stateValue = 'hubspot_unique_state_value';
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
