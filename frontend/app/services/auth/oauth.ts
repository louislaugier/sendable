import { AuthCodeEvent } from "~/components/types/oauth";

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
                    console.error('Salesforce login error:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }
};