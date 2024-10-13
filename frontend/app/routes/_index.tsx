import { useDisclosure } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import EmailAddressConfirmedModal from "~/components/modals/EmailAddressConfirmedModal";
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
  const [searchParams] = useSearchParams();

  const emailAddressConfirmedModal = useDisclosure()
  const isEmailAddressConfirmedCall = !!searchParams.get("email_confirmed")

  const [isEmailAddressConfirmedModalAck, setEmailAddressConfirmedModalAck] = useState(false)
  useEffect(() => {
    if (isEmailAddressConfirmedCall && !emailAddressConfirmedModal.isOpen && !isEmailAddressConfirmedModalAck) emailAddressConfirmedModal.onOpen()
  }, [searchParams, emailAddressConfirmedModal, isEmailAddressConfirmedModalAck])

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (code && state) {
      console.log("Received OAuth callback. Sending message to opener.");
      console.log("Code:", code);
      console.log("State:", state);
      if (window.opener) {
        window.opener.postMessage({ code, state }, window.location.origin);
        console.log("Message posted to opener");
        window.close();
      } else {
        console.error("No opener window found. Unable to send OAuth data.");
      }
    } else if (error) {
      console.log("Received OAuth error:", error);
      if (window.opener) {
        window.opener.postMessage({ type: 'error', error }, window.location.origin);
        console.log("Error message posted to opener");
        window.close();
      } else {
        console.error("No opener window found. Unable to send OAuth error.");
      }
    }
  }, [searchParams]);

  return (
    <>
      <HeroSection />
      <IntegrationsSection />
      <FeaturesSection />
      <DataPrivacySection />

      <EmailAddressConfirmedModal guest isOpen={emailAddressConfirmedModal.isOpen} onOpenChange={emailAddressConfirmedModal.onOpenChange} onClose={() => {
        setEmailAddressConfirmedModalAck(true)
        emailAddressConfirmedModal.onClose()
      }} />
    </>
  );
}
