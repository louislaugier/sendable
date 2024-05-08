import { Tab, Textarea, Button, Tabs } from "@nextui-org/react";
import FileUploader from "../Footer/FileUploader";
import { useState } from "react";
import TextEmailValidator from "./TextEmailValidator";

export default function EmailValidatorTab(props: any) {
    const [selectedTab, setSelectedTab] = useState<any>("validation");

    return (
        <>
            <h2 className="text-xl mt-8">Validate email addresses</h2>

            test
            {/* explanation reachability words in csv report */}

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