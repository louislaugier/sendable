import { useEffect } from "react";
import { facebookOauthClientId } from "~/constants/oauth/clientIds";
import facebookAuth from "~/services/api/auth/facebook";

// Extend the Window interface for the Facebook SDK
declare global {
    interface Window {
        FB: any; // Add the FB type to the global Window object to satisfy TypeScript
        fbAsyncInit: () => void;
    }
}

export default function FacebookAuthButton() {
    useEffect(() => {
        // Load the Facebook SDK script
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: facebookOauthClientId,
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

    const facebookLogin = () => {
        window.FB.login((response: any) => {
            handleFacebookResponse(response);
        }, { scope: 'public_profile,email' });
    };

    const handleFacebookResponse = async (response: any) => {
        if (response.status === 'connected') {
            // The user is logged in and has authenticated your app
            console.log("Connected to Facebook!", response);
            // Additional logic can be added here such as fetching the user profile
            try {
                let resp = await facebookAuth({ access_token: response.authResponse.accessToken });
                console.log(resp);
            } catch { }
        } else {
            // The user is not logged in or hasn't authenticated your app
            console.warn("User cancelled login or did not fully authorize.");
        }
    };

    return (
        <>
            <button onClick={facebookLogin}>Login with Facebook</button>
        </>
    )
}