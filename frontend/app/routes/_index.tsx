import { useDisclosure } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useState, useEffect, useContext } from "react";
import EmailAddressConfirmedModal from "~/components/modals/EmailAddressConfirmedModal";
import DataPrivacySection from "~/components/page_sections/_root/DataPrivacySection";
import FeaturesSection from "~/components/page_sections/_root/FeaturesSection";
import HeroSection from "~/components/page_sections/_root/HeroSection";
import IntegrationsSection from "~/components/page_sections/_root/IntegrationsSection";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import { AuthModalType } from "~/types/modal";

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

  const { authModal, setModalType } = useContext(AuthModalContext);

  const [isEmailAddressConfirmedModalAck, setEmailAddressConfirmedModalAck] = useState(false)
  useEffect(() => {
    if (isEmailAddressConfirmedCall && !emailAddressConfirmedModal.isOpen && !isEmailAddressConfirmedModalAck) emailAddressConfirmedModal.onOpen()
  }, [searchParams, emailAddressConfirmedModal, isEmailAddressConfirmedModalAck])

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