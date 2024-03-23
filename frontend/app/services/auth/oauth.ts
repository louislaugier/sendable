import { AuthCodeEvent } from "~/types/oauth";
import { fetchSalesforcePKCE } from "../salesforce/pkce";

export const handleAuthCode = (event: MessageEvent<AuthCodeEvent>, auth: (data: any) => Promise<any>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, authCodeKey: string, stateKey: string, codeVerifierKey?: string) => {
    if (event.origin !== window.location.origin) {
        return;
    }

    if (event.data.type === authCodeKey) {
        const { code, state } = event.data;
        const storedState = sessionStorage.getItem(stateKey);

        if (code && state && storedState === state) {
            setLoading(true);

            sessionStorage.removeItem(stateKey);

            let codeVerifier = undefined
            if (codeVerifierKey) {
                codeVerifier = sessionStorage.getItem(codeVerifierKey!) || undefined;
                sessionStorage.removeItem(codeVerifierKey);
            }

            auth({ code, code_verifier: codeVerifier })
                .then(() => {
                    console.log('login ok')
                })
                .catch(error => {
                    console.error('Oauth login error:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }
};

export const login = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, uniqueStateValue: string, stateKey: string, authCodeKey: string, clientId: string, redirectUri: string, authUrl: string, codeVerifierKey?: string, scope?: string) => {
    setLoading(true);

    const loginUrl = new URL(authUrl);

    let pkceParams;
    if (codeVerifierKey) {
        pkceParams = await fetchSalesforcePKCE();
        sessionStorage.setItem(codeVerifierKey, pkceParams.code_verifier);

        loginUrl.searchParams.append('code_challenge', pkceParams.code_challenge);
        loginUrl.searchParams.append('code_challenge_method', 'S256');
    }

    sessionStorage.setItem(stateKey, uniqueStateValue);

    loginUrl.searchParams.append('client_id', clientId);
    loginUrl.searchParams.append('redirect_uri', redirectUri);
    loginUrl.searchParams.append('response_type', 'code');
    loginUrl.searchParams.append('state', uniqueStateValue);

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
            }
        } catch (error) {
            // Ignore CORS errors if the popup is not redirected yet
        }

        setTimeout(pollPopup, 500);
    };

    setTimeout(pollPopup, 500);
};

