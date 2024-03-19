import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import googleAuth from "~/services/api/auth/google";

export default function GoogleAuthButton() {

    useGoogleOneTapLogin({
        onSuccess: async (jwtResponse) => {
            console.log(jwtResponse.credential);
            let resp = await googleAuth({ jwt: jwtResponse.credential });
            console.log(resp);
        },
        onError: () => {
            console.log('Login Failed');
        },
    });

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
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
            <button onClick={() => googleLogin()}>Login in with Google</button>
        </>
    )
}