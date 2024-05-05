import { Button, Tab, Tabs, Textarea } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useLocation, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import EmailValidatorTab from "~/components/EmailValidatorTab";
import FileUploader from "~/components/Footer/FileUploader";
import ApiLimitsTable from "~/components/Tables/ApiLimitsTable";
import { siteName } from "~/constants/app";
import UserContext from "~/contexts/UserContext";
import { navigateToUrl } from "~/utils/url";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Dashboard` },
    { name: "description", content: "Welcome to Remix! - Dashboard" },
  ];
};

export default function Dashboard() {
  const { user } = useContext(UserContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<any>("validation");


  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setSelectedTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedTab) {
      setSearchParams({ tab: selectedTab });
    }
  }, [selectedTab, setSearchParams]);

  if (!user) navigateToUrl('/')

  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h2 className="text-2xl">Dashboard</h2>
      </div>
      <div className="flex w-full flex-col">

        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          <Tab
            key="validation"
            title={
              <div className="flex items-center space-x-2">
                <span>Validate new</span>
              </div>
            }
          >
            <EmailValidatorTab />
          </Tab>
          <Tab
            key="history"
            title={
              <div className="flex items-center space-x-2">
                <span>History</span>
              </div>
            }
          >
            <h2 className="text-xl mt-8">Validatation history</h2>
            <div className="py-8">
              <ApiLimitsTable />
            </div>
          </Tab>

        </Tabs>
      </div>


    </div>
  );
}