import { Tab, Tabs } from "@nextui-org/react";
import { MetaFunction } from "@remix-run/node";
import { useContext } from "react";
import CardsSection from "~/components/PageSections/Pricing/CardsSection";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Pricing` },
    { name: "description", content: "Welcome to Remix! - Pricing" },
  ];
};

export default function Pricing() {
  const { authModal, setModalType } = useContext(AuthModalContext);

  return (
    <div className="py-10 px-6 flex flex-col justify-center items-center">

      <div className="flex flex-col items-center mb-8">
        <p className="text-blue600">Pricing</p>
        <h2 className="text-2xl">Flexible Plans</h2>
      </div>

      <div className="flex">

        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" className="justify-center mb-8">
            <Tab className="flex gap-8" key="monthly" title="Monthly">
              <CardsSection />
            </Tab>

            <Tab className="flex gap-8" key="yearly" title="Yearly">
              <CardsSection isYearly />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
