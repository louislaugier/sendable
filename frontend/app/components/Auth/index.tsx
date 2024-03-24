import { Divider } from "@nextui-org/divider";
import EmailAuthButton from "./Email";
import GoogleAuthButton from "./Google";
import HubspotAuthButton from "./Hubspot";
import LinkedinAuthButton from "./Linkedin";
import MailchimpAuthButton from "./Mailchimp";
import SalesforceAuthButton from "./Salesforce";
import ZohoAuthButton from "./Zoho";

export default function Auth() {
    return (
        <div className="flex flex-col py-4" style={{ width: '300px', alignItems: 'center' }}>
            <div className="gap-2 flex flex-col" style={{ width: '220px' }}>

                <SalesforceAuthButton />
                <HubspotAuthButton />
                <ZohoAuthButton />
                <MailchimpAuthButton />
            </div>

            <Divider className="my-4" />

            <div className="gap-2 flex flex-col" style={{ width: '220px' }}>
                <LinkedinAuthButton />
                <GoogleAuthButton />

                {/* <FacebookAuthButton /> */}
                {/* <AppleAuthButton /> */}
            </div>



            <Divider className="my-4" />
            <div className="gap-2 flex flex-col" style={{ width: '220px' }}>
                <EmailAuthButton />
            </div>
        </div>
    );
}
