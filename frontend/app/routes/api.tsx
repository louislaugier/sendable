import { Button, useDisclosure } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useContext } from "react";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import { AuthModalType } from "~/types/modal";
import UserContext from "~/contexts/UserContext";
import { navigateToUrl } from "~/utils/url";
import CodeSnippetsSection from "~/components/page_sections/api/CodeSnippetsSection";
import ApiLimitsTable from "~/components/tables/ApiLimitsTable";
import NewApiKeyModal from "~/components/modals/NewApiKeyModal";
import ApiReference from "~/components/dropdowns/ApiReference";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - API` },
    { name: "description", content: "Welcome to Remix! - API" },
  ];
};

export default function Api() {
  const { authModal, setModalType } = useContext(AuthModalContext);

  const { user } = useContext(UserContext);

  const newApiKeyModal = useDisclosure();

  return (
    <>
      <div className="py-8 px-6">

        <div className="flex flex-col items-center mb-12">
          <h1 className="text-2xl">API</h1>
        </div>

        <ApiReference />

        <h3 className="text-lg mb-4">Generating a bearer token from an API key</h3>
        <CodeSnippetsSection />

        <div className="flex space-x-2">
          <Button onClick={(e) => {
            if (!user) {
              setModalType(AuthModalType.Signup);
              authModal.onOpen();
            } else {
              newApiKeyModal.onOpen()
            }
          }} color="primary" variant="shadow" className="mt-4 mb-16">
            {user ? 'Generate new API key' : 'Get your free API key'}
          </Button>
          {!!user && <Button onClick={() => navigateToUrl('/settings?tab=api')} color="primary" variant="bordered" className="my-4" >
            Manage API keys
          </Button>}
        </div>

        <h3 className="text-lg mb-4">Monthly email address validation limits:</h3>
        <ApiLimitsTable />
      </div>

      {!!user && <NewApiKeyModal isOpen={newApiKeyModal.isOpen} onClose={newApiKeyModal.onClose} onOpenChange={newApiKeyModal.onOpenChange} />}
    </>
  );
}