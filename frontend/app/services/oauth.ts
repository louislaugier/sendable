import { AuthCodeEvent } from "~/types/oauth";
import { User } from "~/types/user";
import { navigateToUrl } from "~/utils/url";
import { Dispatch, SetStateAction } from "react";

export const handleAuthCode = (event: MessageEvent<AuthCodeEvent>, setUser: React.Dispatch<React.SetStateAction<User | null>>, setTemp2faUserId: Dispatch<SetStateAction<string | null>>, auth: (data: any) => Promise<any>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, authCodeKey: string, stateKey: string, salesforceCodeVerifierKey?: string) => {
    console.log("handleAuthCode called with event:", JSON.stringify(event.data));
    console.log("authCodeKey:", authCodeKey);
    console.log("stateKey:", stateKey);

    setLoading(true);

    if (event.origin !== window.location.origin) {
        console.log("Origin mismatch. Exiting handleAuthCode");
        return;
    }

    console.log("Event data type:", event.data.type);
    if (event.data.type === stateKey) {  // Changed from authCodeKey to stateKey
        const { code, state } = event.data;
        const storedState = sessionStorage.getItem(stateKey);
        console.log("Received code:", code);
        console.log("Received state:", state);
        console.log("Stored state:", storedState);

        if (code && state && storedState === state) {
            console.log("Code and state validated. Proceeding with auth.");
            sessionStorage.removeItem(stateKey);
            sessionStorage.removeItem('current_oauth_state_key');

            let codeVerifier = undefined
            if (salesforceCodeVerifierKey) {
                codeVerifier = sessionStorage.getItem(salesforceCodeVerifierKey!) || undefined;
                sessionStorage.removeItem(salesforceCodeVerifierKey);
            }

            console.log("Calling auth function with:", { code, codeVerifier });
            auth({ code, codeVerifier })
                .then((res: any) => {
                    console.log("Auth function response:", res);
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
                    console.error('OAuth login error:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            console.log("Code or state validation failed");
            setLoading(false);
        }
    } else {
        console.log("Event type does not match stateKey. No action taken.");
        setLoading(false);
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
        console.log(`Login function called for ${authCodeKey}`);
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
        console.log(`OAuth URL: ${url}`);

        const popupWindow = window.open(url, 'Login', 'width=800,height=600');

        if (popupWindow) {
            console.log("Popup window opened successfully");
            const checkPopup = setInterval(() => {
                if (popupWindow.closed) {
                    console.log("Popup window closed");
                    clearInterval(checkPopup);
                    setLoading(false);
                    resolve(null);
                }
            }, 500);

            const handleMessage = (event: MessageEvent) => {
                console.log("Received message:", event.data);
                console.log("Expected state:", state);
                console.log("Message origin:", event.origin);
                console.log("Window origin:", window.location.origin);
                if (event.origin === window.location.origin && event.data.state === state) {
                    console.log(`Received valid message for ${authCodeKey}`);
                    window.removeEventListener('message', handleMessage);
                    clearInterval(checkPopup);
                    popupWindow.close();
                    setLoading(false);
                    resolve(event.data);
                } else {
                    console.log("Message did not match expected criteria");
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
