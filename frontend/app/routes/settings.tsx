import { Tabs, Tab, useDisclosure } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import EmailAddressConfirmedModal from "~/components/modals/EmailAddressConfirmedModal";
import AccountTab from "~/components/page_sections/settings/AccountTab";
import ApiTab from "~/components/page_sections/settings/ApiTab";
import IntegrationsTab from "~/components/page_sections/settings/IntegrationsTab";
import PlanTab from "~/components/page_sections/settings/PlanTab";
import { siteName } from "~/constants/app";
import UserContext from "~/contexts/UserContext";
import { navigateToUrl } from "~/utils/url";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Settings` },
    { name: "description", content: "Welcome to Remix! - Settings" },
  ];
};

export default function Settings() {
  const { user } = useContext(UserContext)

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedTab, setSelectedTab] = useState<any>(searchParams.get("tab") ?? "user");

  useEffect(() => {
    if (selectedTab) {
      setSearchParams({ tab: selectedTab });
    }
  }, [selectedTab, setSearchParams]);

  const isEmailAddressConfirmedCall = !!searchParams.get("email_confirmed")

  if (!user) {
    if (isEmailAddressConfirmedCall) navigateToUrl('/?email_confirmed=true')
    else navigateToUrl('/')
  }

  const emailAddressConfirmedModal = useDisclosure()
  const [isEmailAddressConfirmedModalAck, setEmailAddressConfirmedModalAck] = useState(false)
  useEffect(() => {
    if (isEmailAddressConfirmedCall && !emailAddressConfirmedModal.isOpen && !isEmailAddressConfirmedModalAck) emailAddressConfirmedModal.onOpen()
  }, [searchParams, emailAddressConfirmedModal, isEmailAddressConfirmedModalAck])

  return (
    !!user &&
    <>
      <div className="py-8 px-6">

        <div className="flex flex-col items-center mb-16">
          <h1 className="text-2xl">Settings</h1>
        </div>

        <div className="flex flex-col items-center">

          <Tabs
            aria-label="Options"
            color="primary"
            variant="bordered"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
          >
            <Tab
              key="account"
              title={
                <div className="flex items-center space-x-2">
                  <span>Account</span>
                </div>
              }
            >
              <AccountTab />
            </Tab>
            <Tab
              key="plan"
              title={
                <div className="flex items-center space-x-2">
                  <span>Plan</span>
                </div>
              }
            >
              <PlanTab />
            </Tab>
            <Tab
              key="integrations"
              title={
                <div className="flex items-center space-x-2">
                  <span>Integrations</span>
                </div>
              }
            >
              <IntegrationsTab />
            </Tab>
            <Tab
              key="api"
              title={
                <div className="flex items-center space-x-2">
                  <span>API</span>
                </div>
              }
            >
              <ApiTab />
            </Tab>
          </Tabs>

        </div>
      </div>

      <EmailAddressConfirmedModal isOpen={emailAddressConfirmedModal.isOpen} onOpenChange={emailAddressConfirmedModal.onOpenChange} onClose={() => {
        setEmailAddressConfirmedModalAck(true)
        emailAddressConfirmedModal.onClose()
      }} />
    </>
  );
}