import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Resources` },
    { name: "description", content: "Welcome to Remix! - Resources" },
  ];
};

export default function Resources() {

  const test = <Card className="max-w-[400px] mb-8">
    <CardHeader className="flex gap-3">
      <div className="flex flex-col">
        <p className="text-md">NextUI</p>
        <p className="text-small text-default-500">nextui.org</p>
      </div>
    </CardHeader>
    <Divider />
    <CardBody>
      <p>Make beautiful websites regardless of your design experience.</p>
    </CardBody>
    <Divider />
    <CardFooter>
      <Link
        isExternal
        showAnchorIcon
        href="https://github.com/nextui-org/nextui"
      >
        Visit source code on GitHub.
      </Link>
    </CardFooter>
  </Card>

  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <p className="text-blue600">Resources</p>
        <h2 className="text-2xl">Articles and tutorials</h2>
      </div>

      <div className="flex flex-wrap justify-between">
        {test}
        {test}
        {test}
        {test}
        {test}
        {test}
        {test}
        {test}
        {test}
        {test}
        {test}
      </div>
    </div>
  );
}