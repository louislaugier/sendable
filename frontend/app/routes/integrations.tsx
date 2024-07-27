import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";
import BrevoFullLogo from "~/components/icons/logos/BrevoFullLogo";
import HubspotFullLogo from "~/components/icons/logos/HubspotFullLogo";
import SalesforceFullLogo from "~/components/icons/logos/SalesforceFullLogo";
import SendgridFullLogo from "~/components/icons/logos/SendgridFullLogo";
import ZohoFullLogo from "~/components/icons/logos/ZohoFullLogo";
import IntegrationCard from "~/components/cards/IntegrationCard";
import HubspotAuthButton from "~/components/buttons/AuthButtons/HubspotAuthButton";
import SalesforceAuthButton from "~/components/buttons/AuthButtons/SalesforceAuthButton";
import ZohoAuthButton from "~/components/buttons/AuthButtons/ZohoAuthButton";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Integrations` },
    { name: "description", content: "Welcome to Remix! - Integrations" },
  ];
};

export default function Integrations() {
  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h1 className="text-2xl">Integrations</h1>
      </div>

      <div className="flex flex-wrap justify-between">
        <IntegrationCard signupBtn={<SalesforceAuthButton customText="Signup with Salesforce" />} title='Salesforce' url='salesforce.com' description='Import all kinds of contacts from your Salesforce CRM.' hasLoginFeature logo={<SalesforceFullLogo w={70} />} />
        <IntegrationCard  signupBtn={<ZohoAuthButton customText="Signup with Zoho" />} title='Zoho' url='zoho.com' description='Import leads, contacts and vendors from your Zoho CRM.' hasLoginFeature logo={<ZohoFullLogo w={"70px"} />} />
        <IntegrationCard  signupBtn={<HubspotAuthButton customText="Signup with Hubspot" />} title='HubSpot' url='hubspot.com' description='Import all kinds of contacts from your HubSpot CRM.' hasLoginFeature logo={<HubspotFullLogo w='90px' />} />
        <IntegrationCard title='SendGrid' url='sendgrid.com' description='Import your contacts from the SendGrid marketing platform.' logo={<SendgridFullLogo w='100px' />} />
        <IntegrationCard title='Brevo' url='brevo.com' description='Import your contacts from the Brevo marketing platform.' logo={<BrevoFullLogo w='80px' />} />
      </div>
    </div>
  );
}
