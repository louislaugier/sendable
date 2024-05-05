import { Button } from "@nextui-org/button";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import GoogleIcon from "~/icons/logos/GoogleLogo";
import googleAuth from "~/services/api/auth/google";
import UserContext from "~/contexts/UserContext";
import { navigateToUrl } from "~/utils/url";

export default function GoogleAuthButton() {
    const [isLoading, setLoading] = useState(false);

    const { setUser } = useContext(UserContext)

    const onSuccess = async (tokenResponse: any) => {
        setLoading(true);

        try {
            let res = await googleAuth({ access_token: tokenResponse.access_token });
            setUser(res)
            navigateToUrl('/dashboard')
        } catch { }

        setLoading(false)
    }

    const onError = () => {
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
        onSuccess: async (JWTResponse) => {
            try {
                await googleAuth({ jwt: JWTResponse.credential });
            } catch { }
        },
        onError: () => {
        },
    });

    return <></>
}