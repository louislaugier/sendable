import { Tabs, Tab } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Settings` },
    { name: "description", content: "Welcome to Remix! - Settings" },
  ];
};

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<any>("user");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setSelectedTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (selectedTab) {
      setSearchParams({ tab: selectedTab });
      // if (selectedTab === "history") resetHistory()
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