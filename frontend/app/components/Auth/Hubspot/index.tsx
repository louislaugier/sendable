import React, { useEffect, useState } from "react";
import { domain, hubspotOauthClientId, hubspotOauthRedirectUri } from "~/constants/oauth";
import hubspotAuth from "~/services/api/auth/hubspot";

const HUBSPOT_STATE_KEY = 'hubspotOauthState';

export default function HubspotAuthButton() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        const state = queryParams.get('state');
        const storedState = sessionStorage.getItem(HUBSPOT_STATE_KEY);

        if (code && state && storedState === state) {
            sessionStorage.removeItem(HUBSPOT_STATE_KEY); // Clean up
            setLoading(true);

            hubspotAuth({ code }) // Call the HubSpot auth function
                // Assuming hubspotAuth resolves to indicate success or the final promise chain state
                .then(() => {
                    window.close(); // Close the popup once done, correct implementation
                })
                .catch(error => {
                    console.error('Hubspot login error:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    const hubspotLogin = () => {
        setLoading(true);

        // The stateValue could be any unique string. For enhanced security, this should be less predictable.
        const stateValue = 'hubspot_unique_state_value';
        sessionStorage.setItem(HUBSPOT_STATE_KEY, stateValue);

        const loginUrl = new URL('https://app-eu1.hubspot.com/oauth/authorize');
        loginUrl.searchParams.append('client_id', hubspotOauthClientId);
        loginUrl.searchParams.append('scope', 'crm.objects.contacts.read');
        loginUrl.searchParams.append('redirect_uri', hubspotOauthRedirectUri);
        loginUrl.searchParams.append('response_type', 'code');
        loginUrl.searchParams.append('state', stateValue);

        window.open(loginUrl.href, '_blank', 'width=800,height=600');
        setLoading(false);
    };

    return (
        <button disabled={isLoading} onClick={hubspotLogin}>
            Log in with Hubspot
        </button>
    );
}
