import { useEffect } from 'react';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import googleAuth from '~/services/api/auth/google';
import facebookAuth from '~/services/api/auth/facebook';

// Extend the Window interface for the Facebook SDK
declare global {
    interface Window {
        FB: any; // Add the FB type to the global Window object to satisfy TypeScript
        fbAsyncInit: () => void;
    }
}

export default function Auth() {
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

    useEffect(() => {
        // Load the Facebook SDK script
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '1091186198591809',
                cookie: true,
                xfbml: true,
                version: 'v12.0',
            });

            window.FB.AppEvents.logPageView(); // Log a pageview event using Facebook Analytics
        };

        (function (d, s, id) { // Load the SDK asynchronously
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s) as HTMLScriptElement; // Cast as HTMLScriptElement
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode?.insertBefore(js, fjs); // Use optional chaining for parentNode
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    // Define the function to handle the Facebook login process here
    const facebookLogin = () => {
        window.FB.login(async (response: any) => {
            if (response.status === 'connected') {
                // The user is logged in and has authenticated your app
                console.log("Connected to Facebook!", response);
                // Additional logic can be added here such as fetching the user profile

                let resp = await facebookAuth({ access_token: response.accessToken });
                console.log(resp);
            } else {
                // The user is not logged in or hasn't authenticated your app
                console.warn("User cancelled login or did not fully authorize.");
            }
        }, { scope: 'public_profile,email' });
    };

    return (
        <>
            <button onClick={() => googleLogin()}>Login in with Google</button>
            <button onClick={facebookLogin}>Login with Facebook</button>
        </>
    );
}
