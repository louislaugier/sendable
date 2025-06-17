import { useContext, useEffect, useState } from "react";
import { AuthCodeEvent } from "~/types/oauth";
import { hubspotOauthClientId } from "~/constants/oauth/clientIds";
import { hubspotAuthCodeKey, hubspotStateKey, hubspotUniqueStateValue } from "~/constants/oauth/stateKeys";
import { hubspotOauthRedirectUri } from "~/constants/oauth/urls";
import hubspotAuth from "~/services/api/auth/hubspot";
import { Button } from "@nextui-org/button";
import HubspotIcon from "~/components/icons/logos/HubspotLogo";
import UserContext from "~/contexts/UserContext";
import { handleAuthCode, login } from "~/services/oauth";
import { AuthModalType } from "~/types/modal";

const url = 'https://app-eu1.hubspot.com/oauth/authorize'
const scope = 'crm.objects.contacts.read'

export default function HubspotAuthButton(props: { customText?: string, modalType?: AuthModalType }) {
    const { customText, modalType } = props;

    const [isLoading, setLoading] = useState(false);

    const { setUser, setTemp2faUserId } = useContext(UserContext)

    useEffect(() => {
        const handleAuthCallback = async (event: MessageEvent<AuthCodeEvent>) => {
            await handleAuthCode(event, setUser, setTemp2faUserId, hubspotAuth, setLoading, hubspotAuthCodeKey, hubspotStateKey);
        };

        window.addEventListener('message', handleAuthCallback);
        return () => {
            window.removeEventListener('message', handleAuthCallback);
        };
    }, [setUser, setTemp2faUserId]);

    const hubspotLogin = async () => {
        setLoading(true);
        try {
            const success = await login(setLoading, hubspotUniqueStateValue, hubspotStateKey, hubspotAuthCodeKey, hubspotOauthClientId, hubspotOauthRedirectUri, url, undefined, scope);
            if (!success) {
                setLoading(false);
            }
        } catch (error) {
            console.error("HubSpot login error:", error);
            setLoading(false);
        }
    };

    return (
        <Button style={{ justifyContent: 'flex-start' }} isLoading={isLoading} onClick={hubspotLogin} variant="bordered" color="primary" startContent={!customText && <HubspotIcon />}>
            {isLoading ? 'Loading...' : customText ?? `${modalType === AuthModalType.Signup ? AuthModalType.Signup : AuthModalType.Login} with HubSpot`}
        </Button>
    );
}
