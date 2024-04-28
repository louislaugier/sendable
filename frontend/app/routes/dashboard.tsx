import { Button, Chip, Tab, Tabs, Textarea } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useContext, useState } from "react";
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

  if (!user) navigateToUrl('/')

  const [selected, setSelected] = useState<any>("validation");

  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h2 className="text-2xl">Dashboard</h2>
      </div>

      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        selectedKey={selected}
        onSelectionChange={setSelected}
      >
        <Tab
          key="validation"
          title={
            <div className="flex items-center space-x-2">
              {/* <GalleryIcon/> */}
              <span>Email validation</span>
            </div>
          }
        >
          <div className='flex flex-col items-center'>
            <Button onClick={() => {
            }} color="primary" variant="shadow">
              Connect platform
            </Button>

            <p className="mt-6">or</p>

            <FileUploader />

            <p className="mb-6">or</p>

            <Textarea
              variant="faded"
              label="Email addresses"
              placeholder="Coma-separated email addresses"
              description="Enter a list of email addresses to validate."
              className="max-w-xs mb-2"
            />
            <Button isDisabled onClick={() => {
            }} color="primary" variant="shadow">
              Validate
            </Button>
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
          <ApiLimitsTable />
        </Tab>

      </Tabs>



    </div>
  );
}