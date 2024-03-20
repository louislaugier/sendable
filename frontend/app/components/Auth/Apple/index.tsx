// import React, { useEffect } from 'react';

// declare global {
//     interface Window {
//         AppleID: any; // Define AppleID object type
//     }
// }

// export default function AppleAuthButton() {
//     useEffect(() => {
//         const initializeAppleSignIn = () => {
//             window.AppleID.auth.init({
//                 clientId: '[CLIENT_ID]',
//                 scope: '[SCOPES]',
//                 redirectURI: '[REDIRECT_URI]',
//                 state: '[STATE]',
//                 nonce: '[NONCE]',
//                 usePopup: true
//             });

//             // Listen for authorization success.
//             document.addEventListener('AppleIDSignInOnSuccess', handleSuccess);

//             // Listen for authorization failures.
//             document.addEventListener('AppleIDSignInOnFailure', handleFailure);
//         };

//         const handleSuccess = (event: Event) => {
//             // Handle successful response.
//             console.log((event as CustomEvent).detail.data);
//         };

//         const handleFailure = (event: Event) => {
//             // Handle error.
//             console.log((event as CustomEvent).detail.error);
//         };

//         const script = document.createElement('script');
//         script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
//         script.async = true;
//         script.onload = () => {
//             initializeAppleSignIn();
//         };
//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//             // Clean up event listeners
//             document.removeEventListener('AppleIDSignInOnSuccess', handleSuccess);
//             document.removeEventListener('AppleIDSignInOnFailure', handleFailure);
//         };
//     }, []);

//     return (
//         <div id="appleid-signin" data-color="black" data-border="true" data-type="sign in"></div>
//     );
// };
