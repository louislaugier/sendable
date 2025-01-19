import { Tab, Tabs } from "@nextui-org/react";
import { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import CardsSection from "~/components/page_sections/pricing/CardsSection";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Pricing` },
    { name: "description", content: "Welcome to Remix! - Pricing" },
  ];
};

export default function Pricing() {
  const [selectedRootTab, setSelectedRootTab] = useState<any>("subscription");
  const [selectedTab, setSelectedTab] = useState<any>("yearly");

  return (
    <div className="py-10 px-6 flex flex-col justify-center items-center">

      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl">Pricing</h1>
      </div>

      <div className="flex">

        <div className="flex w-full flex-col mb-12">

          <Tabs selectedKey={selectedRootTab} onSelectionChange={setSelectedRootTab} aria-label="Options" className="justify-center mb-8">
            <Tab className="gap-8" key="subscription" title="Subscription">
              <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab} aria-label="Options" className="justify-center mb-8">
                <Tab className="flex gap-8" key="monthly" title="Monthly">
                  <CardsSection />
                </Tab>

                <Tab className="flex gap-8" key="yearly" title="Yearly">
                  <CardsSection isYearly />
                </Tab>
              </Tabs>
            </Tab>

            <Tab className="flex gap-8" key="pay-as-you-go" title="Pay-as-you-go">
              <p>Coming soon</p>
            </Tab>
          </Tabs>


        </div>
      </div>
    </div>
  );
}
