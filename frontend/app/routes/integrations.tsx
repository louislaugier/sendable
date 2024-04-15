import { Card, CardHeader, Divider, CardBody, CardFooter, Image, Link, Button, Tooltip } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useContext } from "react";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import UserContext from "~/contexts/UserContext";
import SalesforceFullLogo from "~/icons/logos/SalesforceFullLogo";
import SalesforceIcon from '~/icons/logos/SalesforceFullLogo';
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
        <IntegrationCard title='Salesforce' url='salesforce.com' description='Import all kinds of contacts from your Salesforce CRM.' hasLoginFeature logo={<SalesforceFullLogo w={60} />} />
        <IntegrationCard title='Zoho' url='zoho.com' description='Import leads, contacts and vendors from your Salesforce CRM.' hasLoginFeature logo={<ZohoFullLogo w={"60px"} />} />
      </div>
    </div>
  );
}

function IntegrationCard(props: any) {
  const { title, url, description, hasLoginFeature, logo } = props

  const { authModal, modalType, setModalType } = useContext(AuthModalContext);
  const { user } = useContext(UserContext);

  return (
    <Card className="max-w-[400px]">
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
