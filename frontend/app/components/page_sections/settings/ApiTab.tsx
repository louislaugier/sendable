import { Button, Card, CardBody, CardHeader, useDisclosure } from "@nextui-org/react";
import { useState, useCallback } from "react";
import NewApiKeyModal from "~/components/modals/NewApiKeyModal";
import ApiKeysTable from "~/components/tables/ApiKeysTable";
import getApiKeys from "~/services/api/api_keys";
import { ApiKey } from "~/types/apiKey";

export default function ApiTab() {
    const newApiKeyModal = useDisclosure();

    const [apiKeys, setApiKeys] = useState<Array<ApiKey>>([])
    const [apiKeysCount, setApiKeysCount] = useState<number>(0);

    const loadApiKeys = useCallback(async (limit: number | undefined = undefined, offset: number | undefined = undefined) => {
        try {
            const res = await getApiKeys(limit, offset)
            if (res?.apiKeys?.length && res.count) {
                setApiKeys(prevApiKeys => [...prevApiKeys, ...res.apiKeys.filter((newItem: ApiKey) => !prevApiKeys.some(prevItem => prevItem?.id === newItem.id))]);
                setApiKeysCount(res.count)
            }
        } catch (err) {
            console.error(err)
        }
    }, [apiKeysCount, apiKeys]);

    const resetApiKeys = useCallback(async () => {
        setApiKeys([])
        setApiKeysCount(0)

        await loadApiKeys()
    }, [apiKeys, setApiKeysCount])

    return (
        <>
            <div className="flex flex-col w-full pt-4">
                <Card className="w-full p-4">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md">API settings</p>
                        </div>
                    </CardHeader>
                    <CardBody className="flex flex-col">
                        <div className="mt-4">
                            <Button onClick={newApiKeyModal.onOpen} color="primary" variant="shadow" className="mb-4" style={{ display: 'block' }}>
                                Generate new API key
                            </Button>
                        </div>

                        <p className="text-center my-4">API keys</p>
                        <ApiKeysTable resetApiKeys={resetApiKeys} apiKeys={apiKeys} totalCount={apiKeysCount} loadHistory={loadApiKeys} />

                    </CardBody>
                </Card>
            </div>

            <NewApiKeyModal resetApiKeys={resetApiKeys} isOpen={newApiKeyModal.isOpen} onClose={newApiKeyModal.onClose} onOpenChange={newApiKeyModal.onOpenChange} />
        </>
    )
}