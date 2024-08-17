import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - FAQ` },
    { name: "description", content: "Welcome to Remix! - FAQ" },
  ];
};

export default function Faq() {

  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h1 className="text-2xl">FAQ</h1>
      </div>

      <div className="flex flex-wrap justify-between">

      </div>
    </div>
  );
}