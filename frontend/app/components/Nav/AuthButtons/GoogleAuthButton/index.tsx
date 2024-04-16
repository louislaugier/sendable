import { Button } from "@nextui-org/button";
import { GoogleOAuthProvider, useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import GoogleIcon from "~/icons/logos/GoogleLogo";
import { googleOauthClientId } from "~/constants/oauth/clientIds";
import googleAuth from "~/services/api/auth/google";
import UserContext from "~/contexts/UserContext";

export default function GoogleAuthButton() {
    const [isLoading, setLoading] = useState(false);

    const { setUser } = useContext(UserContext)

    const onSuccess = async (tokenResponse: any) => {
        setLoading(true);

        try {
            let resp = await googleAuth({ access_token: tokenResponse.access_token });
            console.log(resp);
            // setUser
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
            <GoogleOneTap />
            <Button
                style={{ justifyContent: 'flex-start' }}
                isDisabled={isLoading}
                onClick={() => {
                    // setLoading(true);
                    googleLogin();
                }}
                variant="bordered"
                color="primary"
                startContent={<GoogleIcon />}
            >
                <p>{isLoading ? 'Loading...' : 'Log in with Google'}</p>
            </Button>
        </>
    )
}

export function GoogleOneTap() {
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

    return <></>
}