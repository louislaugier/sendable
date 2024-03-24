import { useEffect, useState } from "react";
import { AuthCodeEvent } from "~/types/oauth";
import { hubspotOauthClientId } from "~/constants/oauth/clientIds";
import { hubspotAuthCodeKey, hubspotStateKey, hubspotUniqueStateValue } from "~/constants/oauth/stateKeys";
import { hubspotOauthRedirectUri } from "~/constants/oauth/urls";
import hubspotAuth from "~/services/api/auth/hubspot";
import { handleAuthCode, login } from "~/services/auth/oauth";
import { Button } from "@nextui-org/button";
import HubspotIcon from "~/components/icons/logos/Hubspot";

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
        <Button style={{ justifyContent: 'flex-start' }} isDisabled={isLoading} onClick={hubspotLogin} variant="bordered" startContent={<HubspotIcon />}>
            {isLoading ? 'Loading...' : 'Log in with HubSpot'}
        </Button>
    );
}
