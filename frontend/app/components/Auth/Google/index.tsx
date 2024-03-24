import { Button } from "@nextui-org/button";
import { GoogleOAuthProvider, useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { MouseEventHandler, useState } from "react";
import GoogleIcon from "~/components/icons/logos/Google";
import { googleOauthClientId } from "~/constants/oauth/clientIds";
import googleAuth from "~/services/api/auth/google";

export default function GoogleAuthButton() {
    return (
        <GoogleOAuthProvider clientId={googleOauthClientId}>
            <GoogleAuthButtonComponent />
        </GoogleOAuthProvider>
    )
}

function GoogleAuthButtonComponent() {
    const [isLoading, setLoading] = useState(false);

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

    const onSuccess = async (tokenResponse: any) => {
        setLoading(true);

        try {
            let resp = await googleAuth({ access_token: tokenResponse.access_token });
            console.log(resp);
        } catch { }

        setLoading(false)
    }

    const onError = () => {
        console.log('Login failed');
        setLoading(false)
    }

    const googleLogin: any = useGoogleLogin({
        onSuccess,
        onError,
    });


    return (
        <>
            <Button
                style={{ justifyContent: 'flex-start' }}
                isDisabled={isLoading}
                onClick={() => {
                    // setLoading(true);
                    googleLogin();
                }}
                variant="bordered"
                startContent={<GoogleIcon />}
            >
                <p>{isLoading ? 'Loading...' : 'Log in with Google'}</p>
            </Button>
        </>
    )

}