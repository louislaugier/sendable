import { Tab, Button, Tabs, Accordion, AccordionItem, Card, CardBody } from "@nextui-org/react";
import FileUploader from "../Footer/FileUploader";
import { useState } from "react";
import TextEmailValidator from "./TextEmailValidator";
import ReachabilityChip from "../ReachabilityChip";
import { Reachability } from "~/types/email";
import { InvalidDescriptor, ReachableDescriptor, RiskyDescriptor, UnknownDescriptor } from "./ReachabilityDescriptor";

export default function EmailValidatorTab(props: any) {
    const [selectedTab, setSelectedTab] = useState<any>("validation");

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
                <AccordionItem key="1" aria-label="Toggle reachability reference" subtitle="Press to expand" title="Toggle reachability reference">
                    <div className="flex flex-col my-4 gap-3 text-sm">
                        <ReachableDescriptor />
                        <RiskyDescriptor />
                        <UnknownDescriptor />
                        <InvalidDescriptor />
                    </div>

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
                        <TextEmailValidator />
                    </Tab>

                    <Tab
                        key="file"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Upload file</span>
                            </div>
                        }
                    >
                        <FileUploader />
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
                            <div className="flex items-center space-x-2">
                                <span>API</span>
                            </div>
                        }
                    >
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}