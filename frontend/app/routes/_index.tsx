import type { MetaFunction } from "@remix-run/node";
import FeaturesSection from "~/components/Features";
import HeroSection from "~/components/Hero";
import IntegrationsSection from "~/components/Integrations";
import { siteName } from "~/constants/app";
import { Image } from "@nextui-org/react";

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

      <div style={{ marginBottom: 246 }}>
        <div className="py-10 justify-center bg-gray-100 absolute" style={{ left: 0, width: '100%' }}>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Your data stays private and secure
          </h2>
          <div className="flex mt-12" style={{ justifyContent: 'center', maxWidth: '1024px', marginRight: 'auto', marginLeft: 'auto' }}>
            <div>
              <Image
                alt="GDPR compliance badge"
                src="/gdpr.png"
                width={150}
              />
            </div>
            <div>
              <Image
                alt="CCPA compliance badge"
                src="/ccpa.png"
                width={150}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
    </>
  );
}