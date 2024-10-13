import { AuthCodeEvent } from "~/types/oauth";
import { User } from "~/types/user";
import { navigateToUrl } from "~/utils/url";
import { fetchSalesforcePKCE } from "./utils/salesforce/pkce";
import { Dispatch, SetStateAction } from "react";
import { useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';

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

export const login = (
    setLoading: (isLoading: boolean) => void,
    uniqueStateValue: string,
    stateKey: string,
    provider: string,
    clientId: string,
    redirectUri: string,
    authUrl: string,
    codeChallenge?: string,
    scope?: string
) => {
    return new Promise<{ code: string, state: string } | null>((resolve, reject) => {
        console.log(`Login function called for ${provider}`);
        const state = uniqueStateValue;
        sessionStorage.setItem(stateKey, state);

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
                    console.log(`Received valid message for ${provider}`);
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

export default function Index() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (code && state) {
      window.opener.postMessage({ type: state, code, state }, window.location.origin);
      window.close();
    } else if (error) {
      window.opener.postMessage({ type: 'error', error }, window.location.origin);
      window.close();
    }
  }, [searchParams]);

  // Rest of your homepage component...
}
