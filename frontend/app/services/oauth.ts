import { AuthCodeEvent } from "~/types/oauth";
import { User } from "~/types/user";
import { navigateToUrl } from "~/utils/url";
import { fetchSalesforcePKCE } from "./utils/salesforce/pkce";
import { Dispatch, SetStateAction } from "react";

export const handleAuthCode = (event: MessageEvent<AuthCodeEvent>, setUser: React.Dispatch<React.SetStateAction<User | null>>, setTemp2faUserId: Dispatch<SetStateAction<string | null>>, auth: (data: any) => Promise<any>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, authCodeKey: string, stateKey: string, salesforceCodeVerifierKey?: string) => {
    setLoading(true);

    if (event.origin !== window.location.origin) {
        return;
    }

    if (event.data.type === authCodeKey) {
        const { code, state } = event.data;
        const storedState = sessionStorage.getItem(stateKey);

        if (code && state && storedState === state) {

            sessionStorage.removeItem(stateKey);

            let codeVerifier = undefined
            if (salesforceCodeVerifierKey) {
                codeVerifier = sessionStorage.getItem(salesforceCodeVerifierKey!) || undefined;
                sessionStorage.removeItem(salesforceCodeVerifierKey);
            }

            auth({ code, codeVerifier })
                .then((res: any) => {
                    if (res) {
                        if (res.email) {
                            setUser(res)
                            navigateToUrl('/dashboard')
                        } else if (res.is2faEnabled) {
                            setTemp2faUserId(res.id)
                        }
                    }
                })
                .catch(error => {
                    console.error('Oauth login error:', error);
                })
        }
    }

    setLoading(false);
};

export const login = async (setLoading: (isLoading: boolean) => void, uniqueStateValue: string, stateKey: string, authCodeKey: string, clientId: string, redirectUri: string, authUrl: string, codeChallenge?: string, scope?: string) => {
    setLoading(true);

    const loginUrl = new URL(authUrl);

    sessionStorage.setItem(stateKey, uniqueStateValue);

    loginUrl.searchParams.append('client_id', clientId);
    loginUrl.searchParams.append('redirect_uri', redirectUri);
    loginUrl.searchParams.append('response_type', 'code');
    loginUrl.searchParams.append('state', uniqueStateValue);

    if (codeChallenge) {
        loginUrl.searchParams.append('code_challenge', codeChallenge);
        loginUrl.searchParams.append('code_challenge_method', 'S256');
    }

    if (scope) loginUrl.searchParams.append('scope', scope);

    const popup = window.open(loginUrl.href, '_blank', 'width=500,height=600');

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
                window.postMessage({ type: authCodeKey, code, state }, window.location.origin);
                popup!.close();
                setLoading(false);  // Reset loading state when auth is complete
            }
        } catch (error) {
            // Ignore CORS errors if the popup is not redirected yet
        }

        setTimeout(pollPopup, 500);
    };

    setTimeout(pollPopup, 500);
};
