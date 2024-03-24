import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import LinkedinIcon from "~/components/icons/logos/Linkedin";
import { linkedinOauthClientId } from "~/constants/oauth/clientIds";
import { linkedinAuthCodeKey, linkedinStateKey, linkedinUniqueStateValue } from "~/constants/oauth/stateKeys";
import { linkedinOauthRedirectUri } from "~/constants/oauth/urls";
import linkedinAuth from "~/services/api/auth/linkedin";
import { handleAuthCode, login } from "~/services/auth/oauth";
import { AuthCodeEvent } from "~/types/oauth";

const url = 'https://www.linkedin.com/oauth/v2/authorization'
const scope = 'email'

export default function LinkedinAuthButton() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const handle = (event: MessageEvent<AuthCodeEvent>) => {
            handleAuthCode(event, linkedinAuth, setLoading, linkedinAuthCodeKey, linkedinStateKey);
        };

        window.addEventListener('message', handle);
        return () => window.removeEventListener('message', handle);
    }, []);

    const linkedinLogin = async () => {
        await login(setLoading, linkedinUniqueStateValue, linkedinStateKey, linkedinAuthCodeKey, linkedinOauthClientId, linkedinOauthRedirectUri, url, undefined, scope);
    };

    return (
        <Button style={{ justifyContent: 'flex-start' }} isDisabled={isLoading} onClick={linkedinLogin} variant="bordered" startContent={<LinkedinIcon />}>
            {isLoading ? 'Loading' : 'Log in with LinkedIn'}
        </Button>
    );
}
