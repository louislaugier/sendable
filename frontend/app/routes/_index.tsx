import type { MetaFunction } from "@remix-run/node";
import Hero from "~/components/Hero";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName}` },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {

  return (
    <>
  
      <Hero />
    </>
  );
}