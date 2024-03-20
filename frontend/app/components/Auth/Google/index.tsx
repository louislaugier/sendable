import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import googleAuth from "~/services/api/auth/google";

export default function GoogleAuthButton() {

    useGoogleOneTapLogin({
        onSuccess: async (jwtResponse) => {
            console.log(jwtResponse.credential);
            try {
                let resp = await googleAuth({ jwt: jwtResponse.credential });
                console.log(resp);
            } catch { }
        },
        onError: () => {
            console.log('Login Failed');
        },
    });

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse.access_token);

            try {
                let resp = await googleAuth({ access_token: tokenResponse.access_token });
                console.log(resp);
            } catch { }
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