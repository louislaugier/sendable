import { useState } from "react";
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

export default function IntegrationCardsGrid(props: any) {
    const { resetHistory } = props
    const [isValidationProcessed, setValidationProcessed] = useState(false)

    return (
        !isValidationProcessed ?
            <>
                <IntegrationCard resetHistory={resetHistory} setValidationProcessed={setValidationProcessed} signupBtn={<SalesforceAuthButton customText="Signup with Salesforce" />} title='Salesforce' url='salesforce.com' description='Import all kinds of contacts from your Salesforce CRM.' hasLoginFeature logo={<SalesforceFullLogo w={80} />} />
                <IntegrationCard resetHistory={resetHistory} setValidationProcessed={setValidationProcessed} signupBtn={<ZohoAuthButton customText="Signup with Zoho" />} title='Zoho' url='zoho.com' description='Import leads, contacts and vendors from your Zoho CRM.' hasLoginFeature logo={<ZohoFullLogo w={"80px"} />} />
                <IntegrationCard resetHistory={resetHistory} setValidationProcessed={setValidationProcessed} signupBtn={<HubspotAuthButton customText="Signup with Hubspot" />} title='HubSpot' url='hubspot.com' description='Import all kinds of contacts from your HubSpot CRM.' hasLoginFeature logo={<HubspotFullLogo w='90px' />} />
                <IntegrationCard resetHistory={resetHistory} setValidationProcessed={setValidationProcessed} signupBtn={<MailchimpAuthButton customText="Signup with MailChimp" />} title='Mailchimp' url='mailchimp.com' description="Import your audiences' contacts from Mailchimp." hasLoginFeature logo={<MailchimpFullLogo w='90px' />} />
                <IntegrationCard resetHistory={resetHistory} setValidationProcessed={setValidationProcessed} title='SendGrid' url='sendgrid.com' description='Import your contacts from the SendGrid marketing platform.' logo={<SendgridFullLogo w='110px' />} />
                <IntegrationCard resetHistory={resetHistory} setValidationProcessed={setValidationProcessed} title='Brevo' url='brevo.com' description='Import your contacts from the Brevo marketing platform.' logo={<BrevoFullLogo w='80px' />} />
            </> :
            <>
                {/* New validation batch etc etc */}
            </>
    )
}