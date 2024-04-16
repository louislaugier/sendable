import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Settings` },
    { name: "description", content: "Welcome to Remix! - Settings" },
  ];
};

export default function Settings() {

  return (
    <>
      <div className="py-8 px-6">

        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl">Settings</h2>
        </div>

        <div className="flex flex-wrap justify-between">

        </div>
      </div>
    </>
  );
}