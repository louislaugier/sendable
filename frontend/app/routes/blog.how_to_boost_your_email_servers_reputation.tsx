import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Blog - How to boost your email server's reputation?` },
    { name: "description", content: "Welcome to Remix! - Blog - How to boost your email server's reputation?" },
  ];
};

export default function HowToBoostYourEmailServerSReputation() {
  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h1 className="text-2xl">How to boost your email server's reputation</h1>
      </div>

      <div className="flex flex-wrap justify-between">
        test
      </div>
    </div>
  );
}