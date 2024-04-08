import { Button, Divider, Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { MetaFunction } from "@remix-run/node";
import { useContext } from "react";
import { siteName } from "~/constants/app";
import { pricingPlans } from "~/constants/pricing";
import AuthModalContext from "~/contexts/AuthModalContext";
import { CheckIcon } from "~/icons/CheckIcon";
import { AuthModalType } from "~/types/modal";

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

      <div className="flex gap-8 justify-center">

        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">

            <Tab className="flex" key="monthly" title="Monthly">
              
              {pricingPlans.map((plan, index) => (
                <Card key={index} className="max-w-md p-6">
                  <div>
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <p className="text-accents8">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                      condimentum, nisl ut aliquam lacinia, elit
                    </p>
                  </div>
                  <div className="py-4">
                    <div>
                      <p className="text-2xl inline-block">{plan.price}</p>
                      <p className="text-accents8 inline-block ml-1">/mo</p>
                    </div>
                    <Button className="mt-7 mb-12" onClick={() => {
                      setModalType(AuthModalType.Signup);
                      authModal.onOpen();
                    }} color="primary" variant="shadow">
                      Get Started Free
                    </Button>
                    <Divider />
                    <ul className="list-none">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex py-2 gap-2 items-center">
                          <CheckIcon />
                          <p className="text-accents8 inline-block">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </Tab>

            <Tab key="yearly" title="Yearly">
             
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
