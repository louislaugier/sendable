import { AuthCodeEvent } from "~/types/oauth";
import { User } from "~/types/user";
import { navigateToUrl } from "~/utils/url";
import { Dispatch, SetStateAction } from "react";

export const handleAuthCode = async (event: MessageEvent<AuthCodeEvent>, setUser: React.Dispatch<React.SetStateAction<User | null>>, setTemp2faUserId: Dispatch<SetStateAction<string | null>>, auth: (data: any) => Promise<any>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, authCodeKey: string, stateKey: string, salesforceCodeVerifierKey?: string) => {
    if (event.origin !== window.location.origin) {
        return;
    }

    if (event.data.type === stateKey) {
        const { code, state } = event.data;
        const storedState = sessionStorage.getItem(stateKey);

        if (code && state && storedState === state) {
            let codeVerifier = undefined
            if (salesforceCodeVerifierKey) {
                codeVerifier = sessionStorage.getItem(salesforceCodeVerifierKey!) || undefined;
            }

            try {
                setLoading(true);
                const res = await auth({ code, codeVerifier });
                if (res) {
                    if (res.email) {
                        setUser(res)
                        navigateToUrl('/dashboard')
                    } else if (res.is2faEnabled) {
                        setTemp2faUserId(res.id)
                    }
                }
            } catch (error) {
                console.error('OAuth login error:', error);
            } finally {
                setLoading(false);
                sessionStorage.removeItem(stateKey);
                sessionStorage.removeItem('current_oauth_state_key');
                if (salesforceCodeVerifierKey) {
                    sessionStorage.removeItem(salesforceCodeVerifierKey);
                }
            }
        } else {
            setLoading(false);
        }
    }
};

export const login = (
    setLoading: (isLoading: boolean) => void,
    uniqueStateValue: string,
    stateKey: string,
    authCodeKey: string,
    clientId: string,
    redirectUri: string,
    authUrl: string,
    codeChallenge?: string,
    scope?: string
) => {
    return new Promise<{ code: string, state: string } | null>((resolve, reject) => {
        const state = uniqueStateValue;
        sessionStorage.setItem(stateKey, state);
        sessionStorage.setItem('current_oauth_state_key', stateKey);  // Store the current state key

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            state: state
        });

        if (scope) {
            params.append('scope', scope);
        }

        if (codeChallenge) {
            params.append('code_challenge', codeChallenge);
            params.append('code_challenge_method', 'S256');
        }

        const url = `${authUrl}?${params.toString()}`;

        const popupWindow = window.open(url, 'OAuth Popup', 'width=600,height=600');

        if (popupWindow) {
            const checkClosed = setInterval(() => {
                if (popupWindow.closed) {
                    clearInterval(checkClosed);
                    setLoading(false);
                    resolve(null);
                }
            }, 500);

            const handleMessage = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return;

                if (event.data.state === state) {
                    window.removeEventListener('message', handleMessage);
                    clearInterval(checkClosed);
                    popupWindow.close();
                    resolve(event.data);
                }
            };

            window.addEventListener('message', handleMessage);
        } else {
            console.error("Failed to open popup window");
            setLoading(false);
            reject(new Error("Failed to open popup window"));
        }
    });
};
