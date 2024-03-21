import { useEffect } from "react";
import { domain } from "~/constants/oauth";
import EmailAuthButton from "./Email";
import FacebookAuthButton from "./Facebook";
import GoogleAuthButton from "./Google";
import HubspotAuthButton from "./Hubspot";
import SalesforceAuthButton from "./Salesforce";

export default function Auth() {
    useEffect(() => {
        function handleAuthSuccess(event: any) {
            if (event.origin === domain && event.data.type === 'auth_success') {
                switch (event.data.service) {
                    case 'salesforce':
                        // Handle Salesforce auth success, e.g. redirect or load user profile
                        break;
                    case 'hubspot':
                        // Handle Hubspot auth success, e.g. redirect or load user profile
                        break;
                    default:
                        // No action or generic success handling
                        break;
                }

                // Redirect to a certain page if necessary, for example, a user dashboard
                window.location.href = '/'; // Replace with your dashboard URL
            }
        }

        window.addEventListener('message', handleAuthSuccess);

        return () => window.removeEventListener('message', handleAuthSuccess);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
            <SalesforceAuthButton />
            <HubspotAuthButton />
            <GoogleAuthButton />
            <EmailAuthButton />
            {/* <FacebookAuthButton /> */}
            {/* <AppleAuthButton /> */}
        </div>
    );
}
