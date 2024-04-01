import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Pricing` },
    { name: "description", content: "Welcome to Remix! - Pricing" },
  ];
};

export default function Pricing() {

  return (
    <>
    </>
  );
}