import { Button, Tab, Tabs, Textarea } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useLocation, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
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
                {/* <GalleryIcon/> */}
                <span>Validate new</span>
              </div>
            }
          >
            <h2 className="text-xl mt-8">Validate email addresses</h2>
            <div className='flex flex-col items-center py-8'>
              <Textarea
                variant="faded"
                label="Email addresses"
                placeholder="hello@domain.com,noreply@domain.com"
                description={`Enter a list of email addresses to validate separated by a coma.`}
                className="max-w-xs mb-2"
              />
              <Button isDisabled onClick={() => {
              }} color="primary" variant="shadow">
                Validate
              </Button>

              <p className="my-6">or</p>

              <Button onClick={() => {
              }} color="primary" variant="shadow">
                Connect platform
              </Button>

              <p className="mt-6">or</p>

              <FileUploader />
            </div>
          </Tab>
          <Tab
            key="history"
            title={
              <div className="flex items-center space-x-2">
                {/* <MusicIcon/> */}
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