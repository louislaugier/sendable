import EmailAuthButton from "./Email";
import GoogleAuthButton from "./Google";
import HubspotAuthButton from "./Hubspot";
import SalesforceAuthButton from "./Salesforce";
import ZohoforceAuthButton from "./Zoho";
import MailchimpforceAuthButton from "./Mailchimp";

export default function Auth() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
            <SalesforceAuthButton />
            <HubspotAuthButton />
            <ZohoforceAuthButton />

            <MailchimpforceAuthButton />
            
            <GoogleAuthButton />
            {/* <FacebookAuthButton /> */}
            {/* <AppleAuthButton /> */}

            <EmailAuthButton />
        </div>
    );
}
