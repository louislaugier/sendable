import { Button } from "@nextui-org/button";
import { useContext, useEffect, useState } from "react";
import LinkedinIcon from "~/components/icons/logos/LinkedinLogo";
import { linkedinOauthClientId } from "~/constants/oauth/clientIds";
import { linkedinAuthCodeKey, linkedinStateKey, linkedinUniqueStateValue } from "~/constants/oauth/stateKeys";
import { linkedinOauthRedirectUri } from "~/constants/oauth/urls";
import linkedinAuth from "~/services/api/auth/linkedin";
import { AuthCodeEvent } from "~/types/oauth";
import UserContext from "~/contexts/UserContext";
import { handleAuthCode, login } from "~/services/oauth";
import { AuthModalType } from "~/types/modal";

const url = 'https://www.linkedin.com/oauth/v2/authorization'
const scope = 'email openid'

export default function LinkedinAuthButton({ modalType }: { modalType?: AuthModalType }) {
    const [isLoading, setLoading] = useState(false);

    const { setUser, setTemp2faUserId } = useContext(UserContext)
    
    useEffect(() => {
        const handleAuthCallback = async (event: MessageEvent<AuthCodeEvent>) => {
            await handleAuthCode(event, setUser, setTemp2faUserId, linkedinAuth, setLoading, linkedinAuthCodeKey, linkedinStateKey);
        };

        window.addEventListener('message', handleAuthCallback);
        return () => {
            window.removeEventListener('message', handleAuthCallback);
        };
    }, [setUser, setTemp2faUserId]);

    const linkedinLogin = async () => {
        setLoading(true);
        try {
            const success = await login(setLoading, linkedinUniqueStateValue, linkedinStateKey, linkedinAuthCodeKey, linkedinOauthClientId, linkedinOauthRedirectUri, url, undefined, scope);
            if (!success) {
                setLoading(false);
            }
        } catch (error) {
            console.error("LinkedIn login error:", error);
            setLoading(false);
        }
    };

    return (
        <Button style={{ justifyContent: 'flex-start' }} isLoading={isLoading} onClick={linkedinLogin} variant="bordered" color="primary" startContent={<LinkedinIcon />}>
            {isLoading ? 'Loading...' : `${modalType === AuthModalType.Signup ? AuthModalType.Signup : AuthModalType.Login} with LinkedIn`}
        </Button>
    );
}
