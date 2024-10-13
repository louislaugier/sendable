import { useState, ReactNode } from "react";
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

interface IntegrationCardProps {
    resetHistory: () => void;
    title: string;
    url: string;
    description: string;
    logo: React.ReactNode;
    hasLoginFeature?: boolean;
    signupBtn?: boolean;
}

export default function IntegrationCardsGrid({ resetHistory }: { resetHistory: () => void }) {
    const [isValidationProcessed, setValidationProcessed] = useState(false);

    const renderIntegrationCard = (props: IntegrationCardProps) => (
        <IntegrationCard {...props} />
    );

    return !isValidationProcessed ? (
        <>
            {renderIntegrationCard({
                resetHistory,
                title: 'Salesforce',
                url: 'salesforce.com',
                description: 'Import all kinds of contacts from your Salesforce CRM.',
                hasLoginFeature: true,
                logo: <SalesforceFullLogo w={80} />,
                signupBtn: true,
            })}
            {renderIntegrationCard({
                resetHistory,
                title: 'Zoho',
                url: 'zoho.com',
                description: 'Import leads, contacts and vendors from your Zoho CRM.',
                hasLoginFeature: true,
                logo: <ZohoFullLogo w="80px" />,
                signupBtn: true,
            })}
            {renderIntegrationCard({
                resetHistory,
                title: 'HubSpot',
                url: 'hubspot.com',
                description: 'Import all kinds of contacts from your HubSpot CRM.',
                hasLoginFeature: true,
                logo: <HubspotFullLogo w='90px' />,
                signupBtn: true,
            })}
            {renderIntegrationCard({
                resetHistory,
                title: 'Mailchimp',
                url: 'mailchimp.com',
                description: "Import your audiences' contacts from Mailchimp.",
                hasLoginFeature: true,
                logo: <MailchimpFullLogo w='90px' />,
                signupBtn: true,
            })}
            {renderIntegrationCard({
                resetHistory,
                title: 'SendGrid',
                url: 'sendgrid.com',
                description: 'Import your contacts from the SendGrid marketing platform.',
                logo: <SendgridFullLogo w='110px' />,
                signupBtn: true,
            })}
            {renderIntegrationCard({
                resetHistory,
                title: 'Brevo',
                url: 'brevo.com',
                description: 'Import your contacts from the Brevo marketing platform.',
                logo: <BrevoFullLogo w='80px' />,
                signupBtn: true,
            })}
        </>
    ) : (
        <></>
    );
}
