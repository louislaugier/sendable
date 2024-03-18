import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import googleAuth from "~/services/api/auth/google";

export default function Auth() {
    useGoogleOneTapLogin({
        onSuccess: async credentialResponse => {
            console.log(credentialResponse.credential);
            let resp = await googleAuth({ credential: credentialResponse.credential });
            console.log(resp);
        },
        onError: () => {
            console.log('Login Failed');
        },
    });

    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            console.log(tokenResponse.access_token);
            let resp = await googleAuth({ access_token: tokenResponse.access_token });
            console.log(resp);
        },
        onError: (e) => {
            console.log('Login Failed', e);
        },
    });
    return (
        <>
            <button onClick={() => login()}>Sign in with Google</button>
        </>
    )
}