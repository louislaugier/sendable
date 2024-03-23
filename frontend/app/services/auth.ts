export const handleAuthCode = (
    type: string,
    stateKey: string,
    sessionKeys: string[],
    authService: any,
    setLoading: any
) => (event: MessageEvent<{ type: string, code: string, state: string }>) => {
    if (event.origin !== window.location.origin) {
        return;
    }
    if (event.data.type === type) {
        const { code, state } = event.data;
        const storedState = sessionStorage.getItem(stateKey);

        if (code && state && storedState === state) {
            setLoading(true);
            sessionKeys.forEach(key => sessionStorage.removeItem(key));
            authService({ code })
                .then(() => {
                    console.log('login ok')
                })
                .catch((error: any) => {
                    console.error(`${type} login error:`, error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }
};

export const createLoginFunction = (
    clientId: string,
    redirectUri: string,
    stateKey: string,
    setLoading: any,
    loginUrl: string,
    additionalParams?: { [param: string]: string }
) => {
    return () => {
        setLoading(true);
        const stateValue = `${stateKey}_unique_state_value`;
        sessionStorage.setItem(stateKey, stateValue);

        const url = new URL(loginUrl);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('redirect_uri', redirectUri);
        url.searchParams.append('state', stateValue);
        if (additionalParams) {
            Object.entries(additionalParams).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const popup = window.open(url.href, '_blank', 'width=800,height=600');

        const pollPopup = () => {
            if (!popup || popup.closed) {
                setLoading(false);
                return;
            }

            try {
                const popupUrl = new URL(popup.location.href);
                if (popupUrl.origin === window.location.origin && popupUrl.searchParams.get('code')) {
                    const code = popupUrl.searchParams.get('code')!;
                    const state = popupUrl.searchParams.get('state')!;
                    window.postMessage({ type: stateKey, code, state }, window.location.origin);
                    if (popup) popup.close();
                }
            } catch (error) {
                // Ignore CORS errors if the popup is not redirected yet
            }

            setTimeout(pollPopup, 500);
        };

        setTimeout(pollPopup, 500);
    }
};
