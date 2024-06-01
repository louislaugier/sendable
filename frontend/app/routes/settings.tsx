import { Tabs, Tab } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import UserTab from "~/components/page_sections/settings/UserTab";
import { siteName } from "~/constants/app";
import UserContext from "~/contexts/UserContext";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Settings` },
    { name: "description", content: "Welcome to Remix! - Settings" },
  ];
};

export default function Settings() {
  const {user} = useContext(UserContext)

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedTab, setSelectedTab] = useState<any>(searchParams.get("tab") ?? "user");

  useEffect(() => {
    if (selectedTab) {
      setSearchParams({ tab: selectedTab });
    }
  }, [selectedTab, setSearchParams]);

  return (
    <>
      <div className="py-8 px-6">

        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl">Settings</h2>
        </div>

        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          <Tab
            key="user"
            title={
              <div className="flex items-center space-x-2">
                <span>User</span>
              </div>
            }
          >
           <UserTab />
          </Tab>
          <Tab
            key="plan"
            title={
              <div className="flex items-center space-x-2">
                <span>Plan</span>
              </div>
            }
          >

          </Tab>
          <Tab
            key="integrations"
            title={
              <div className="flex items-center space-x-2">
                <span>Integrations</span>
              </div>
            }
          >

          </Tab>
          <Tab
            key="api"
            title={
              <div className="flex items-center space-x-2">
                <span>API</span>
              </div>
            }
          >

          </Tab>
        </Tabs>

        <div className="flex flex-wrap justify-between">

        </div>
      </div>
    </>
  );
}