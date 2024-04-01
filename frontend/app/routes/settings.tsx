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
    </>
  );
}