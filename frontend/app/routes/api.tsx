import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - API` },
    { name: "description", content: "Welcome to Remix! - API" },
  ];
};

export default function Api() {

  return (
    <>
    </>
  );
}