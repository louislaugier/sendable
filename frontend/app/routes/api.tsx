import { Accordion, AccordionItem, Button, Card, CardBody, Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useContext, useState } from "react";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import { AuthModalType } from "~/types/modal";
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import CodeSnippetsSection from "~/components/PageSections/Api/CodeSnippetsSection";
import ApiLimitsTable from "~/components/Tables/ApiLimitsTable";
import UserContext from "~/contexts/UserContext";
import { navigateToUrl } from "~/utils/url";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - API` },
    { name: "description", content: "Welcome to Remix! - API" },
  ];
};

export default function Api() {
  const { authModal, setModalType } = useContext(AuthModalContext);

  const [areDocsOpen] = useState(false);

  const { user } = useContext(UserContext);

  return (
    <>
      <div className="py-8 px-6">

        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl">API</h2>
        </div>

        <h3 className="text-lg mb-4">API reference</h3>
        {/* <p className="mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
          molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
          numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
          optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
          obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
          nihil, eveniet aliquid culpa officia aut!
        </p> */}

        <style>
          {
            `
              #docs-toggle button>div {
                flex: unset;
                width: 235px;
              }
            `
          }
        </style>
        <Accordion id='docs-toggle' className="mb-12">
          <AccordionItem key="1" aria-label="Toggle API documentation" subtitle="Press to expand" title="Open API documentation">
            <Card className="mb-16">
              <CardBody>
                <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" />
              </CardBody>
            </Card>
          </AccordionItem>
        </Accordion>

        {areDocsOpen && <Card className="mb-16">
          <CardBody>
            <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" />
          </CardBody>
        </Card>}

        <h3 className="text-lg mb-4">Generating a bearer token from an API key</h3>
        <CodeSnippetsSection />
        <Button as={Link} href={user ? '/settings?tab=api' : ''} onClick={(e) => {
          if (!user) {
            setModalType(AuthModalType.Signup);
            authModal.onOpen();
          } else {
            e.preventDefault()
            navigateToUrl(`/settings?tab=api`)
          }
        }} color="primary" variant="shadow" className="mt-4 mb-16">
          Get an API key
        </Button>

        <h3 className="text-lg mb-4">Limits</h3>
        <ApiLimitsTable />
      </div>
    </>
  );
}