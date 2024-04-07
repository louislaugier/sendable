import { Button, Divider, Card } from "@nextui-org/react";
import { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";
import { CheckIcon } from "~/icons/CheckIcon";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Pricing` },
    { name: "description", content: "Welcome to Remix! - Pricing" },
  ];
};

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "1 Team Members",
      "1 Website",
      "1 GB Storage",
      "1 TB Transfer",
      "Email Support",
    ],
  },
  {
    name: "Premium",
    price: "$19",
    features: [
      "5 Team Members",
      "5 Website",
      "5 GB Storage",
      "5 TB Transfer",
      "Email Support",
    ],
  },
  {
    name: "Startup",
    price: "$99",
    features: [
      "30 Team Members",
      "30 Website",
      "30 GB Storage",
      "30 TB Transfer",
      "Email Support",
    ],
  }
];

export default function Pricing() {
  return (
    <div className="py-20 px-6 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center">
        <p className="text-blue600">Awesome Feature</p>
        <h2 className="text-2xl">Flexible Plans</h2>
      </div>
      <div className="flex gap-8 justify-center">
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
              }} color="primary" variant="shadow">
                Sign Up Free
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
      </div>
      <Divider className="absolute inset-0 left-0 mt-5" />
    </div>
  );
}
