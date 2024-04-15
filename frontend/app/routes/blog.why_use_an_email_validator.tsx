import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Blog - Why use an email validator?` },
    { name: "description", content: "Welcome to Remix! - Blog - Why use an email validator?" },
  ];
};

export default function WhyUseAnEmailValidator() {
  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h2 className="text-2xl">Why use an email validator?</h2>
      </div>

      <div className="flex flex-wrap justify-between">
        test
      </div>
    </div>
  );
}