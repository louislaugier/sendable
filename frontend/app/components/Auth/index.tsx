import EmailAuthButton from "./Email";
import FacebookAuthButton from "./Facebook";
import GoogleAuthButton from "./Google";
import HubspotAuthButton from "./Hubspot";
import SalesforceAuthButton from "./Salesforce";

export default function Auth() {
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
