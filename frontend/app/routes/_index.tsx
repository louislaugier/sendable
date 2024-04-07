import type { MetaFunction } from "@remix-run/node";
import FeaturesSection from "~/components/PageSections/Home/FeaturesSection";
import HeroSection from "~/components/PageSections/Home/HeroSection";
import IntegrationsSection from "~/components/PageSections/Home/IntegrationsSection";
import { siteName } from "~/constants/app";
import { Image } from "@nextui-org/react";
import DataPrivacySection from "~/components/PageSections/Home/DataPrivacySection";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName}` },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {

  return (
    <>
      <HeroSection />
      <IntegrationsSection />
      <FeaturesSection />
      <DataPrivacySection />
    </>
  );
}