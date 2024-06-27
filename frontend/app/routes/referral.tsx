import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Referral` },
    { name: "description", content: "Welcome to Remix! - Referral" },
  ];
};

export default function Referral() {

  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h1 className="text-2xl">Referral</h1>
      </div>

      <div className="flex flex-wrap justify-between">

      </div>
    </div>
  );
}