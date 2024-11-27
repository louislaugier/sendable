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
  const { authModal, setModalType } = useContext(AuthModalContext);

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
      if (window.opener) {
        try {
          // Get the current OAuth provider from sessionStorage
          const currentOAuthStateKey = sessionStorage.getItem('current_oauth_state_key');
          window.opener.postMessage({ type: currentOAuthStateKey, code, state }, window.location.origin);
          window.close();
        } catch (error) {
          console.error("Error posting message to opener:", error);
        }
      } else {
        console.error("No opener window found. Unable to send OAuth data.");
      }
    } else if (error) {
      if (window.opener) {
        try {
          window.opener.postMessage({ type: 'error', error }, window.location.origin);
          window.close();
        } catch (error) {
          console.error("Error posting error message to opener:", error);
        }
      } else {
        console.error("No opener window found. Unable to send OAuth error.");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const resetPasswordEmail = searchParams.get('reset_password_email');
    const resetPasswordCode = searchParams.get('reset_password_code');

    if (resetPasswordEmail && resetPasswordCode) {
      setModalType(AuthModalType.Login);
      authModal.onOpen();
    }
  }, [searchParams, authModal, setModalType]);

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
