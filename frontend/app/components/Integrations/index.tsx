import { Avatar } from "@nextui-org/react";
import Brevo from "~/icons/logos/Brevo";
import HubspotFull from "~/icons/logos/HubspotFull";
import Salesforce from "~/icons/logos/Salesforce";
import SendgridFull from "~/icons/logos/SendgridFull";
import Zoho from "~/icons/logos/Zoho";

const IntegrationsSection = () => {
    return (
        <div style={{ marginBottom: 233 }}>
            <div className="py-10 bg-gray-100 absolute" style={{ left: 0, width: '100%' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900">
                        Connect your preferred platforms
                    </h2>
                    <div className="flex mt-12" style={{ justifyContent: 'space-between', maxWidth: '1024px', marginRight: 'auto', marginLeft: 'auto' }}>
                        <Salesforce w={100} />
                        <Zoho w={"120px"} />
                        <HubspotFull />
                        <SendgridFull />
                        <Brevo />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default IntegrationsSection;
