import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - About` },
    { name: "description", content: "Welcome to Remix! - About" },
  ];
};

export default function About() {

  return (
    <>
    </>
  );
}