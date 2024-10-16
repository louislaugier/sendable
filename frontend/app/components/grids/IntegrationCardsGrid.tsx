import { useState, useContext, ReactElement } from "react";
import HubspotAuthButton from "../buttons/AuthButtons/HubspotAuthButton";
import MailchimpAuthButton from "../buttons/AuthButtons/MailchimpAuthButton";
import SalesforceAuthButton from "../buttons/AuthButtons/SalesforceAuthButton";
import ZohoAuthButton from "../buttons/AuthButtons/ZohoAuthButton";
import IntegrationCard from "../cards/IntegrationCard";
import BrevoFullLogo from "../icons/logos/BrevoFullLogo";
import HubspotFullLogo from "../icons/logos/HubspotFullLogo";
import MailchimpFullLogo from "../icons/logos/MailchimpFullLogo";
import SalesforceFullLogo from "../icons/logos/SalesforceFullLogo";
import SendgridFullLogo from "../icons/logos/SendgridFullLogo";
import ZohoFullLogo from "../icons/logos/ZohoFullLogo";
import UserContext from "~/contexts/UserContext";

interface IntegrationCardProps {
  resetHistory: () => void;
  signupBtn?: ReactElement;
  title: string;
  url: string;
  description: string;
  hasLoginFeature?: boolean;
  logo: ReactElement;
  isGuest: boolean;
}

export default function IntegrationCardsGrid({ resetHistory }: { resetHistory: () => void }) {
    const { user } = useContext(UserContext);
    const isGuest = !user;

    return (
        <>
            <IntegrationCard
                resetHistory={resetHistory}
                signupBtn={<SalesforceAuthButton customText="Signup with Salesforce" />}
                title="Salesforce"
                url="salesforce.com"
                description="Import all kinds of contacts from your Salesforce CRM."
                hasLoginFeature={true}
                logo={<SalesforceFullLogo w={80} />}
                isGuest={isGuest}
            />
            <IntegrationCard
                resetHistory={resetHistory}
                signupBtn={<HubspotAuthButton customText="Signup with Hubspot" />}
                title="HubSpot"
                url="hubspot.com"
                description="Import all kinds of contacts from your HubSpot CRM."
                hasLoginFeature={true}
                logo={<HubspotFullLogo w="90px" />}
                isGuest={isGuest}
            />
            <IntegrationCard
                resetHistory={resetHistory}
                signupBtn={<MailchimpAuthButton customText="Signup with Mailchimp" />}
                title="Mailchimp"
                url="mailchimp.com"
                description="Import your audiences' contacts from Mailchimp."
                hasLoginFeature={true}
                logo={<MailchimpFullLogo w="90px" />}
                isGuest={isGuest}
            />
            <IntegrationCard
                resetHistory={resetHistory}
                signupBtn={<ZohoAuthButton customText="Signup with Zoho" />}
                title="Zoho"
                url="zoho.com"
                description="Import leads, contacts and vendors from your Zoho CRM."
                hasLoginFeature={true}
                logo={<ZohoFullLogo w="80px" />}
                isGuest={isGuest}
            />
            <IntegrationCard
                resetHistory={resetHistory}
                title="SendGrid"
                url="sendgrid.com"
                description="Import contacts from SendGrid."
                logo={<SendgridFullLogo w={80} />}
                isGuest={isGuest}
            />
            <IntegrationCard
                resetHistory={resetHistory}
                title="Brevo"
                url="brevo.com"
                description="Import your contacts from the Brevo marketing platform."
                logo={<BrevoFullLogo w="80px" />}
                isGuest={isGuest}
            />
        </>
    )
}
