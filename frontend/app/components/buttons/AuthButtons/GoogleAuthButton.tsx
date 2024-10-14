import { Button } from "@nextui-org/button";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import GoogleIcon from "~/components/icons/logos/GoogleLogo";
import googleAuth from "~/services/api/auth/google";
import UserContext from "~/contexts/UserContext";
import { navigateToUrl } from "~/utils/url";

export function GoogleOneTap() {
    const { setUser, setTemp2faUserId } = useContext(UserContext);

    useGoogleOneTapLogin({
        onSuccess: async (credentialResponse) => {
            try {
                let res = await googleAuth({ jwt: credentialResponse.credential });
                if (res.email) {
                    setUser(res);
                    navigateToUrl('/dashboard');
                } else if (res.is2faEnabled) {
                    setTemp2faUserId(res.id);
                }
            } catch (error) {
                console.error("Google One Tap login error:", error);
            }
        },
        onError: () => {
            console.error("Google One Tap login failed");
        },
    });

    return null; // This component doesn't render anything
}

export default function GoogleAuthButton() {
    const [isLoading, setLoading] = useState(false);
    const { setUser, setTemp2faUserId } = useContext(UserContext)

    const onSuccess = async (tokenResponse: any) => {
        setLoading(true);

        try {
            let res = await googleAuth({ accessToken: tokenResponse.access_token });

            if (res.email && res.currentPlan && res.jwt) {
                setUser(res);
                localStorage.setItem('user', JSON.stringify(res));
                navigateToUrl('/dashboard');
            } else if (res.is2faEnabled) {
                setTemp2faUserId(res.id);
            } else {
                throw new Error('Incomplete user data received');
            }
        } catch (error) {
            console.error('Google Auth Error:', error);
            // Handle the error, maybe show an error message to the user
        } finally {
            setLoading(false);
        }
    }

    const onError = () => {
        console.error("Google login failed");
        setLoading(false);
    }

    const googleLogin = useGoogleLogin({
        onSuccess,
        onError,
        onNonOAuthError: onError,
    });

    const handleGoogleLogin = () => {
        setLoading(true);
        googleLogin();
    };

    return (
        <>
            <GoogleOneTap />
            <Button
                style={{ justifyContent: 'flex-start' }}
                isLoading={isLoading}
                onClick={handleGoogleLogin}
                variant="bordered"
                color="primary"
                startContent={<GoogleIcon />}
            >
                <p>{isLoading ? 'Loading...' : 'Log in with Google'}</p>
            </Button>
        </>
    )
}
