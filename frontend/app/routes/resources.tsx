import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Resources` },
    { name: "description", content: "Welcome to Remix! - Resources" },
  ];
};

export default function Resources() {

  return (
    <>
    </>
  );
}