import { Card, CardHeader, Divider, CardBody, CardFooter, Button, Tooltip } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useContext } from "react";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import UserContext from "~/contexts/UserContext";
import BrevoFullLogo from "~/icons/logos/BrevoFullLogo";
import HubspotFullLogo from "~/icons/logos/HubspotFullLogo";
import SalesforceFullLogo from "~/icons/logos/SalesforceFullLogo";
import SalesforceIcon from '~/icons/logos/SalesforceFullLogo';
import SendgridFullLogo from "~/icons/logos/SendgridFullLogo";
import ZohoFullLogo from "~/icons/logos/ZohoFullLogo";
import { AuthModalType } from "~/types/modal";

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
        <h2 className="text-2xl">Integrations</h2>
      </div>

      <div className="flex flex-wrap justify-between">
        <IntegrationCard title='Salesforce' url='salesforce.com' description='Import all kinds of contacts from your Salesforce CRM.' hasLoginFeature logo={<SalesforceFullLogo w={70} />} />
        <IntegrationCard title='Zoho' url='zoho.com' description='Import leads, contacts and vendors from your Salesforce CRM.' hasLoginFeature logo={<ZohoFullLogo w={"70px"} />} />
        <IntegrationCard title='HubSpot' url='hubspot.com' description='Import all kinds of contacts from your HubSpot CRM.' hasLoginFeature logo={<HubspotFullLogo w='90px' />} />
        <IntegrationCard title='SendGrid' url='sendgrid.com' description='Import your contacts from the SendGrid marketing platform.' logo={<SendgridFullLogo w='100px' />} />
        <IntegrationCard title='Brevo' url='brevo.com' description='Import your contacts from the Brevo marketing platform.' logo={<BrevoFullLogo w='80px' />} />
      </div>
    </div>
  );
}

function IntegrationCard(props: any) {
  const { title, url, description, hasLoginFeature, logo } = props

  const { authModal, modalType, setModalType } = useContext(AuthModalContext);
  const { user } = useContext(UserContext);

  return (
    <Card className="w-[400px] mb-12">
      <CardHeader className="flex gap-3">
        {logo}
        <div className="flex flex-col">
          <p className="text-md">{title}</p>
          <p className="text-small text-default-500">{url}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{description}</p>
      </CardBody>
      <Divider />
      <CardFooter className="justify-end">
        {hasLoginFeature &&
          <Button className="mr-2" onClick={() => {
            setModalType(AuthModalType.Signup)
            authModal.onOpen()
          }} color="primary" variant="bordered">
            Use to signup
          </Button>
        }

        <style>
          {
            `
              .notAllowed {
                cursor: not-allowed !important;
              }
            `
          }
        </style>
        {user ? <Button onClick={() => {
          // TODO
        }} color="primary" variant="shadow">
          Import contacts
        </Button> : <Tooltip showArrow={true} content={"You must be logged in to import contacts"}>
          <Button onClick={() => { }} className="notAllowed" color="primary" variant="shadow">
            Import contacts
          </Button>
        </Tooltip>}

      </CardFooter>
    </Card>

  );
}
