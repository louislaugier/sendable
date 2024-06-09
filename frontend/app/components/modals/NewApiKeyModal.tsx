import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Snippet } from "@nextui-org/react";
import { useState } from "react";
import generateApiKey from "~/services/api/generate_api_key";

const NewApiKeyModal = (props: any) => {
    const [isLoading, setLoading] = useState(false);

    const { isOpen, onClose, onOpenChange, resetApiKeys } = props

    const [label, setLabel] = useState()
    const [generatedKey, setGeneratedKey] = useState()

    const close = () => {
        setLabel(undefined);
        setGeneratedKey(undefined);
        onClose();
    }

    return (
        <Modal
            isDismissable={!generatedKey}
            backdrop="blur"
            onClose={close}
            style={{ maxWidth: "450px" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"

        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">New API key</ModalHeader>
                        <ModalBody className="py-4">
                            {!generatedKey ? <>
                                <Input
                                    value={label}
                                    onChange={(e: any) => setLabel(e.target.value)}
                                    autoFocus
                                    color={"primary"}
                                    label="Label"
                                    variant="bordered"
                                    placeholder="Enter a display name for your API key"
                                />
                            </> : <>
                                <p className="mb-4">API key has been generated successfully. Please copy this key and save it somewhere safe. For security reasons, we cannot show it to you again.</p>
                                <Snippet symbol='' variant="bordered">{generatedKey}</Snippet>
                            </>}
                        </ModalBody>
                        <ModalFooter>
                            {!generatedKey && <Button isLoading={isLoading} color="primary" variant="shadow" onPress={async () => {
                                setLoading(true)

                                try {
                                    const res = await generateApiKey(label!)
                                    setGeneratedKey(res.key)

                                    if (resetApiKeys) resetApiKeys()
                                } catch { }

                                setLoading(false)
                            }}>
                                {isLoading ? 'Generating...' : 'Generate'}
                            </Button>}

                            <Button color={generatedKey ? "primary" : "danger"} variant="bordered" onPress={onClose}>
                                {generatedKey ? "Done" : "Close"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default NewApiKeyModal;
