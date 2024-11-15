import { Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import TextEmailValidator from "./TextEmailValidator";
import FileEmailValidator from "./FileEmailValidator";
import ReachabilityReference from "~/components/dropdowns/ReachabilityReference";
import ApiTab from "./ApiTab";
import IntegrationCardsGrid from "~/components/grids/IntegrationCardsGrid";

export default function EmailValidatorTab(props: any) {
    const { remainingAppValidations, resetHistory } = props
    const [selectedTab, setSelectedTab] = useState<any>("validation");

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
                            {/* <Button onClick={() => {
                            }} color="primary" variant="shadow">
                                Connect platform
                            </Button> */}

                            <IntegrationCardsGrid resetHistory={resetHistory} />
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
                        <ApiTab />
                    </Tab>
                </Tabs>
            </div>

        </>
    )
}