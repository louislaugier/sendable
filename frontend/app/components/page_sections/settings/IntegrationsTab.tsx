import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react";
import { useContext, useState } from "react";
import BrevoFullLogo from "~/components/icons/logos/BrevoFullLogo";
import UserContext from "~/contexts/UserContext";
import upsertProviderApiKey from "~/services/api/upsert_provider_api_key";
import { ContactProvider, ContactProviderType } from "~/types/contactProvider";

export default function IntegrationsTab() {
    const [brevoApiKey, setBrevoApiKey] = useState('')
    const [brevoApiKeyError, setBrevoApiKeyError] = useState('')
    const [isBrevoApiKeyLoading, setBrevoApiKeyLoading] = useState(false)
    const [isEditingBrevoApiKey, setEditingBrevoApiKey] = useState(false)

    const { user, refreshUserData } = useContext(UserContext)

    let brevoProvider: ContactProvider | null = null
    let sendgridProvider: ContactProvider | null = null
    if (user?.contactProviders) for (const provider of user.contactProviders) {
        if (provider.type === ContactProviderType.Brevo) brevoProvider = provider
        else if (provider.type === ContactProviderType.Sendgrid) sendgridProvider = provider
    }

    return (
        <>
            <div>
                <div className="pt-4">
                    <Card className="w-full p-4">
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md">Integrations settings</p>
                            </div>
                        </CardHeader>
                        <CardBody className="flex flex-col  pt-8">

                            <BrevoFullLogo w='120px' />

                            <div className="flex mt-6">
                                {!!brevoProvider && !isEditingBrevoApiKey ?
                                    <Input
                                        disabled
                                        isDisabled
                                        label="Brevo API key"
                                        value={`xkeysib-*****...${brevoProvider.latestApiKeyChars}`}
                                        variant="bordered"
                                        className="max-w-xs"
                                    />
                                    :
                                    <Input
                                        label="Brevo API key"
                                        value={brevoApiKey}
                                        variant="bordered"
                                        errorMessage={brevoApiKeyError}
                                        isInvalid={!!brevoApiKeyError}
                                        onValueChange={setBrevoApiKey}
                                        placeholder={"Your Brevo API key"}
                                        className="max-w-xs"
                                        description={<Link href="https://help.brevo.com/hc/en-us/articles/209467485-Create-and-manage-your-API-keys#:~:text=Create%20an%20API%20key" target="_blank" className="text-xs text-grey cursor-pointer"><u>How to generate a Brevo API key?</u></Link>}
                                    />
                                }

                                <Button className="mt-4 ml-4" onClick={async () => {
                                    setBrevoApiKeyLoading(true)

                                    try {
                                        const res = await upsertProviderApiKey({ provider: ContactProviderType.Brevo, apiKey: brevoApiKey })
                                        if (res.error) {
                                            setBrevoApiKeyLoading(false)
                                            setBrevoApiKeyError(res.error)
                                            return
                                        }
                                        await refreshUserData()
                                    } catch {
                                        setBrevoApiKeyError("An unexpected error has occurred. Please try again.")
                                    }

                                    setBrevoApiKeyLoading(false)
                                }} isLoading={isBrevoApiKeyLoading} color="primary" variant="shadow">
                                    {isBrevoApiKeyLoading ? 'Loading...' : brevoProvider ?
                                        isEditingBrevoApiKey ? 'Update' : 'Edit'
                                        : 'Save'}
                                </Button>

                                {
                                    brevoProvider &&
                                    <Button className="mt-4 ml-4" onClick={async () => {
                                    }} color="danger" variant="bordered">
                                        Delete
                                    </Button>
                                }
                            </div>


                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    )
}