import { Card, CardHeader, Divider, CardBody, CardFooter, Button, Tooltip } from "@nextui-org/react";
import { useContext, useState } from "react";
import UserContext from "~/contexts/UserContext";
import getProviderContacts from "~/services/api/provider_contacts";
import { ContactProviderType } from "~/types/contactProvider";
import { navigateToUrl } from "~/utils/url";

export default function IntegrationCard(props: any) {
    const [isLoading, setLoading] = useState(false)

    const { title, url, description, signupBtn, logo } = props

    const { user } = useContext(UserContext);

    let hasBrevoProvider = false
    let hasSendgridProvider = false
    if (user?.contactProviders) for (const provider of user?.contactProviders) {
        if (provider.type === ContactProviderType.Sendgrid) hasSendgridProvider = true
        else if (provider.type === ContactProviderType.Brevo) hasBrevoProvider = true
    }
    const shouldConnectApiKey = (title === 'Brevo' && !hasBrevoProvider) || (title === 'SendGrid' && !hasSendgridProvider)

    const [contacts, setContacts] = useState<Array<string | null>>([]);

    return (
        <Card className="w-[400px] mb-12">
            <CardHeader className="flex gap-3">
                {logo}
                <div className="flex flex-col">
                    <p className="text-md">{title}</p>
                    <p className="text-small text-default-500">{url}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p>{description}</p>
            </CardBody>
            <Divider />
            <CardFooter className="justify-end">
                <style>
                    {
                        `
                            .notAllowed {
                                cursor: not-allowed !important;
                            }
                        `
                    }
                </style>
                {user ? <Button isLoading={isLoading} onClick={async () => {
                    if (shouldConnectApiKey) {
                        navigateToUrl('/settings?tab=integrations')
                        return
                    }

                    setLoading(true)

                    switch (title) {
                        case 'Brevo':
                        case 'SendGrid':
                            try {
                                const res = await getProviderContacts(title === 'Brevo' ? ContactProviderType.Brevo : ContactProviderType.Sendgrid)
                                console.log(res)
                                if (res?.length) setContacts(contacts)
                            } catch (err) {
                                console.error(err)
                            }
                        case 'Mailchimp':
                        case 'HubSpot':
                        case 'Zoho':
                        //
                        case 'Salesforce':
                        //
                    }

                    setLoading(false)
                }} color="primary" variant="shadow" className="ml-2">
                    {shouldConnectApiKey ? 'Connect API key' : 'Import contacts'}
                </Button> : <Tooltip showArrow={true} content={"You must be logged in to import contacts"}>
                    <Button onClick={() => { }} className={`notAllowed${signupBtn ? ' ml-2' : ''}`} color="primary" variant="shadow">
                        Import contacts
                    </Button>
                </Tooltip>}

            </CardFooter>
        </Card>

    );
}