import { Tab, Button, Tabs, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import TextEmailValidator from "./TextEmailValidator";
import FileEmailValidator from "./FileEmailValidator";
import { navigateToUrl } from "~/utils/url";
import NewApiKeyModal from "~/components/modals/NewApiKeyModal";
import ApiReference from "~/components/single_components/ApiReference";
import ReachabilityReference from "~/components/single_components/ReachabilityReference";

export default function EmailValidatorTab(props: any) {

    const { remainingAppValidations, resetHistory } = props
    const [selectedTab, setSelectedTab] = useState<any>("validation");

    const newApiKeyModal = useDisclosure();

    return (
        <>
            <h2 className="text-xl mt-8">Validate email addresses</h2>

            <div className='flex flex-col items-center py-8'>
                <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="bordered"
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab}
                    className="mb-4"
                >

                    <Tab
                        key="manual"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Manual</span>
                            </div>
                        }
                        className="w-full"
                    >
                        <ReachabilityReference />
                        <TextEmailValidator resetHistory={resetHistory} remainingAppValidations={remainingAppValidations} />
                    </Tab>

                    <Tab
                        key="file"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Upload file</span>
                            </div>
                        }
                        className="w-full"
                    >
                        <ReachabilityReference />
                        <FileEmailValidator resetHistory={resetHistory} remainingAppValidations={remainingAppValidations} />
                    </Tab>

                    <Tab
                        key="platform"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Connect platform</span>
                            </div>
                        }
                        className="w-full"
                    >
                        <ReachabilityReference />
                        <div className="w-full flex justify-center mt-8">
                            <Button onClick={() => {
                            }} color="primary" variant="shadow">
                                Connect platform
                            </Button>
                        </div>
                    </Tab>

                    <Tab
                        key="api"
                        title={
                            <div className="space-x-2">
                                <span>API</span>
                            </div>
                        }
                        className="w-full"
                    >
                        <div className="flex flex-col w-full">
                            <ReachabilityReference />
                            <div className="flex flex-col space-x-2 w-full items-center">
                                <ApiReference />
                                <Button onClick={newApiKeyModal.onOpen} color="primary" variant="shadow" className="mb-4" >
                                    Generate new API key
                                </Button>
                                <Button onClick={() => navigateToUrl('/settings?tab=api')} color="primary" variant="bordered" className="my-4" >
                                    Manage API keys
                                </Button>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>

            <NewApiKeyModal isOpen={newApiKeyModal.isOpen} onClose={newApiKeyModal.onClose} onOpenChange={newApiKeyModal.onOpenChange} />
        </>
    )
}