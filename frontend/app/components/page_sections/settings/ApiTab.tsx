import { Button, useDisclosure } from "@nextui-org/react";
import ApiReference from "~/components/dropdowns/ApiReference";
import ReachabilityReference from "~/components/dropdowns/ReachabilityReference";
import NewApiKeyModal from "~/components/modals/NewApiKeyModal";
import { navigateToUrl } from "~/utils/url";

export default function ApiTab() {
    const newApiKeyModal = useDisclosure();

    return (
        <>
            <div className="flex flex-col w-full">
                <ReachabilityReference />
                <ApiReference />

                <div>
                    <Button onClick={newApiKeyModal.onOpen} color="primary" variant="shadow" className="mb-4" style={{ display: 'block' }}>
                        Generate new API key
                    </Button>
                    <Button onClick={() => navigateToUrl('/settings?tab=api')} color="primary" variant="bordered" className="mb-4" >
                        Manage API keys
                    </Button>
                </div>
            </div>

            <NewApiKeyModal isOpen={newApiKeyModal.isOpen} onClose={newApiKeyModal.onClose} onOpenChange={newApiKeyModal.onOpenChange} />
        </>
    )
}