import type { MetaFunction } from "@remix-run/node";
import DataPrivacySection from "~/components/page_sections/_root/DataPrivacySection";
import FeaturesSection from "~/components/page_sections/_root/FeaturesSection";
import HeroSection from "~/components/page_sections/_root/HeroSection";
import IntegrationsSection from "~/components/page_sections/_root/IntegrationsSection";
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
      <HeroSection />
      <IntegrationsSection />
      <FeaturesSection />
      <DataPrivacySection />
    </>
  );
}