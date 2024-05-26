import { Tab, Button, Tabs, Accordion, AccordionItem, Card, CardBody, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import TextEmailValidator from "./TextEmailValidator";
import { InvalidDescriptor, ReachableDescriptor, RiskyDescriptor, UnknownDescriptor } from "./ReachabilityDescriptor";
import FileEmailValidator from "./FileEmailValidator";
import ApiReference from "../ApiReference";
import { navigateToUrl } from "~/utils/url";
import NewApiKeyModal from "../Modals/NewApiKeyModal";

export default function EmailValidatorTab(props: any) {

    const { remainingAppValidations } = props
    const [selectedTab, setSelectedTab] = useState<any>("validation");

    const newApiKeyModal = useDisclosure();

    return (
        <>
            <h2 className="text-xl mt-8">Validate email addresses</h2>

            <style>
                {
                    `
                        #validation-docs-toggle button>div {
                            flex: unset;
                            width: 250px;
                        }
                    `
                }
            </style>
            <Accordion id='validation-docs-toggle' className="mt-12">
                <AccordionItem key="1" aria-label="Toggle reachability reference" subtitle="Press to expand" title="Reachability reference">
                    <Card>
                        <CardBody>
                            <div className="flex flex-col my-4 gap-3 text-sm">
                                <ReachableDescriptor />
                                <RiskyDescriptor />
                                <UnknownDescriptor />
                                <InvalidDescriptor />
                            </div>
                        </CardBody>
                    </Card>
                </AccordionItem>
            </Accordion>

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
                        <TextEmailValidator remainingAppValidations={remainingAppValidations} />
                    </Tab>

                    <Tab
                        key="file"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Upload file</span>
                            </div>
                        }
                    >
                        <FileEmailValidator remainingAppValidations={remainingAppValidations} />
                    </Tab>

                    <Tab
                        key="platform"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Connect platform</span>
                            </div>
                        }
                    >
                        <Button onClick={() => {
                        }} color="primary" variant="shadow">
                            Connect platform
                        </Button>
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
                            <div className="flex space-x-2">
                                <Button onClick={newApiKeyModal.onOpen} color="primary" variant="shadow" className="my-4" >
                                    Generate new API key
                                </Button>
                                <Button onClick={() => navigateToUrl('/settings?tab=api')} color="primary" variant="bordered" className="my-4" >
                                    Manage API keys
                                </Button>
                            </div>
                            <ApiReference />
                        </div>
                    </Tab>
                </Tabs>
            </div>

            <NewApiKeyModal isOpen={newApiKeyModal.isOpen} onClose={newApiKeyModal.onClose} onOpenChange={newApiKeyModal.onOpenChange} />
        </>
    )
}