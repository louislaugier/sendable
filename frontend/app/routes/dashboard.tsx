import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Dashboard` },
    { name: "description", content: "Welcome to Remix! - Dashboard" },
  ];
};

// should redirect to home if not logged
export default function Dashboard() {

  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h2 className="text-2xl">Dashboard</h2>
      </div>

      <div className="flex flex-wrap justify-between">

      </div>
    </div>
  );
}