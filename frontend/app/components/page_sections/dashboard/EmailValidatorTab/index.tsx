import { Tab, Button, Tabs } from "@nextui-org/react";
import { useState } from "react";
import TextEmailValidator from "./TextEmailValidator";
import FileEmailValidator from "./FileEmailValidator";
import ReachabilityReference from "~/components/dropdowns/ReachabilityReference";
import ApiTab from "./ApiTab";
import HubspotAuthButton from "~/components/buttons/AuthButtons/HubspotAuthButton";
import SalesforceAuthButton from "~/components/buttons/AuthButtons/SalesforceAuthButton";
import ZohoAuthButton from "~/components/buttons/AuthButtons/ZohoAuthButton";
import IntegrationCard from "~/components/cards/IntegrationCard";
import BrevoFullLogo from "~/components/icons/logos/BrevoFullLogo";
import HubspotFullLogo from "~/components/icons/logos/HubspotFullLogo";
import SalesforceFullLogo from "~/components/icons/logos/SalesforceFullLogo";
import SendgridFullLogo from "~/components/icons/logos/SendgridFullLogo";
import ZohoFullLogo from "~/components/icons/logos/ZohoFullLogo";

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

                            <div className="flex flex-wrap justify-between">
                                <IntegrationCard signupBtn={<SalesforceAuthButton customText="Signup with Salesforce" />} title='Salesforce' url='salesforce.com' description='Import all kinds of contacts from your Salesforce CRM.' hasLoginFeature logo={<SalesforceFullLogo w={70} />} />
                                <IntegrationCard signupBtn={<ZohoAuthButton customText="Signup with Zoho" />} title='Zoho' url='zoho.com' description='Import leads, contacts and vendors from your Zoho CRM.' hasLoginFeature logo={<ZohoFullLogo w={"70px"} />} />
                                <IntegrationCard signupBtn={<HubspotAuthButton customText="Signup with Hubspot" />} title='HubSpot' url='hubspot.com' description='Import all kinds of contacts from your HubSpot CRM.' hasLoginFeature logo={<HubspotFullLogo w='90px' />} />
                                <IntegrationCard title='SendGrid' url='sendgrid.com' description='Import your contacts from the SendGrid marketing platform.' logo={<SendgridFullLogo w='100px' />} />
                                <IntegrationCard title='Brevo' url='brevo.com' description='Import your contacts from the Brevo marketing platform.' logo={<BrevoFullLogo w='80px' />} />
                            </div>
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