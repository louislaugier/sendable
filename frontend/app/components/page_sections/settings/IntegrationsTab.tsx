import { Button, Card, CardBody, CardHeader, Input, Link, useDisclosure } from "@nextui-org/react";
import { useContext, useState } from "react";
import BrevoFullLogo from "~/components/icons/logos/BrevoFullLogo";
import SendgridFullLogo from "~/components/icons/logos/SendgridFullLogo";
import DeleteProviderApiKeyModal from "~/components/modals/DeleteProviderApiKeyModal";
import UserContext from "~/contexts/UserContext";
import upsertProviderApiKey from "~/services/api/upsert_provider_api_key";
import { ContactProvider, ContactProviderType } from "~/types/contactProvider";

export default function IntegrationsTab() {
    const [brevoApiKey, setBrevoApiKey] = useState('')
    const [brevoApiKeyError, setBrevoApiKeyError] = useState('')
    const [isBrevoApiKeyLoading, setBrevoApiKeyLoading] = useState(false)
    const [isEditingBrevoApiKey, setEditingBrevoApiKey] = useState(false)

    const [sendgridApiKey, setSendgridApiKey] = useState('')
    const [sendgridApiKeyError, setSendgridApiKeyError] = useState('')
    const [isSendgridApiKeyLoading, setSendgridApiKeyLoading] = useState(false)
    const [isEditingSendgridApiKey, setEditingSendgridApiKey] = useState(false)

    const { user, refreshUserData } = useContext(UserContext)

    let existingBrevoProvider: ContactProvider | null = null
    let existingSendgridProvider: ContactProvider | null = null
    if (user?.contactProviders) for (const provider of user.contactProviders) {
        if (provider.type === ContactProviderType.Brevo) existingBrevoProvider = provider
        else if (provider.type === ContactProviderType.Sendgrid) existingSendgridProvider = provider
    }

    const deleteBrevoProviderModal = useDisclosure()
    const deleteSendgridProviderModal = useDisclosure()

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

                            <div className="flex mt-6 mb-12">
                                {!!existingBrevoProvider && !isEditingBrevoApiKey ?
                                    <Input
                                        disabled
                                        isDisabled
                                        label="Brevo API key"
                                        value={`xkeysib-*****...${existingBrevoProvider.latestApiKeyChars}`}
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

                                    if (!isEditingBrevoApiKey && existingBrevoProvider) {
                                        setEditingBrevoApiKey(true)
                                        setBrevoApiKeyLoading(false)
                                        return
                                    }

                                    try {
                                        const res = await upsertProviderApiKey({ provider: ContactProviderType.Brevo, apiKey: brevoApiKey })
                                        if (res.error) {
                                            setBrevoApiKeyLoading(false)
                                            setBrevoApiKeyError(res.error)
                                            return
                                        }
                                        await refreshUserData()
                                        setBrevoApiKey('')

                                        if (isEditingBrevoApiKey) setEditingBrevoApiKey(false)
                                    } catch {
                                        setBrevoApiKeyError("An unexpected error has occurred. Please try again.")
                                    }

                                    setBrevoApiKeyLoading(false)
                                }} isDisabled={!brevoApiKey && isEditingBrevoApiKey} isLoading={isBrevoApiKeyLoading} color="primary" variant="shadow">
                                    {isBrevoApiKeyLoading ? 'Loading...' : existingBrevoProvider ?
                                        isEditingBrevoApiKey ? 'Update' : 'Edit'
                                        : 'Save'}
                                </Button>

                                {
                                    existingBrevoProvider &&
                                    <Button className="mt-4 ml-4" onClick={async () => {
                                        if (isEditingBrevoApiKey) setEditingBrevoApiKey(false)
                                        else deleteBrevoProviderModal.onOpen()
                                    }} color="danger" variant="bordered">
                                        {isEditingBrevoApiKey ? 'Cancel' : 'Delete'}
                                    </Button>
                                }
                            </div>

                            <SendgridFullLogo w='160px' />

                            <div className="flex mt-6">
                                {!!existingSendgridProvider && !isEditingSendgridApiKey ?
                                    <Input
                                        disabled
                                        isDisabled
                                        label="SendGrid API key"
                                        value={`SG.*****...${existingSendgridProvider.latestApiKeyChars}`}
                                        variant="bordered"
                                        className="max-w-xs"
                                    />
                                    :
                                    <Input
                                        label="SendGrid API key"
                                        value={sendgridApiKey}
                                        variant="bordered"
                                        errorMessage={sendgridApiKeyError}
                                        isInvalid={!!sendgridApiKeyError}
                                        onValueChange={setSendgridApiKey}
                                        placeholder={"Your SendGrid API key"}
                                        className="max-w-xs"
                                        description={<Link href="https://www.twilio.com/docs/sendgrid/ui/account-and-settings/api-keys#creating-an-api-key" target="_blank" className="text-xs text-grey cursor-pointer"><u>How to generate a SendGrid API key?</u></Link>}
                                    />
                                }

                                <Button className="mt-4 ml-4" onClick={async () => {
                                    setSendgridApiKeyLoading(true)

                                    if (!isEditingSendgridApiKey && existingSendgridProvider) {
                                        setEditingSendgridApiKey(true)
                                        setSendgridApiKeyLoading(false)
                                        return
                                    }

                                    try {
                                        const res = await upsertProviderApiKey({ provider: ContactProviderType.Sendgrid, apiKey: sendgridApiKey })
                                        if (res.error) {
                                            setSendgridApiKeyLoading(false)
                                            setSendgridApiKeyError(res.error)
                                            return
                                        }
                                        await refreshUserData()
                                        setSendgridApiKey('')

                                        if (isEditingSendgridApiKey) setEditingSendgridApiKey(false)
                                    } catch {
                                        setSendgridApiKeyError("An unexpected error has occurred. Please try again.")
                                    }

                                    setSendgridApiKeyLoading(false)
                                }} isDisabled={!sendgridApiKey && isEditingSendgridApiKey} isLoading={isSendgridApiKeyLoading} color="primary" variant="shadow">
                                    {isSendgridApiKeyLoading ? 'Loading...' : existingSendgridProvider ?
                                        isEditingSendgridApiKey ? 'Update' : 'Edit'
                                        : 'Save'}
                                </Button>

                                {
                                    existingSendgridProvider &&
                                    <Button className="mt-4 ml-4" onClick={async () => {
                                        if (isEditingSendgridApiKey) setEditingSendgridApiKey(false)
                                        else deleteSendgridProviderModal.onOpen()
                                    }} color="danger" variant="bordered">
                                        {isEditingSendgridApiKey ? 'Cancel' : 'Delete'}
                                    </Button>
                                }
                            </div>

                        </CardBody>
                    </Card>
                </div>
            </div>
            <DeleteProviderApiKeyModal isOpen={deleteBrevoProviderModal.isOpen} onClose={deleteBrevoProviderModal.onClose} onOpenChange={deleteBrevoProviderModal.onOpenChange} providerType={'brevo'} providerName={'Brevo'} />
            <DeleteProviderApiKeyModal isOpen={deleteSendgridProviderModal.isOpen} onClose={deleteSendgridProviderModal.onClose} onOpenChange={deleteSendgridProviderModal.onOpenChange} providerType={'sendgrid'} providerName={'SendGrid'} />
        </>
    )
}