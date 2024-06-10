import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useState } from "react";
import deleteApiKey from "~/services/api/delete_api_key";

const DeleteApiKeyModal = (props: any) => {
    const { isOpen, onClose, onOpenChange, apiKey, resetApiKeys } = props

    const [inputValue, setInputValue] = useState("")
    const [inputErrorMsg, setInputErrorMsg] = useState("")

    const [isLoading, setLoading] = useState(false)

    return (
        <Modal
            backdrop="blur"
            onClose={onClose}
            style={{ maxWidth: "450px" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete API key</ModalHeader>
                        <ModalBody>
                            <p>You are about to delete the following API key: <b>{apiKey.label}</b></p>

                            <Input
                                onPaste={(e) => e.preventDefault()}
                                type="text"
                                label={<>To confirm, type "<b>{apiKey.label}</b>" below:</>}
                                value={inputValue}
                                variant="bordered"
                                errorMessage={inputErrorMsg}
                                onValueChange={setInputValue}
                                placeholder={apiKey.label}
                                labelPlacement="outside"
                                className="max-w-xs mt-2"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button isDisabled={inputValue !== apiKey.label} isLoading={isLoading} color={"primary"} variant="shadow" onPress={async () => {
                                setLoading(true);

                                setInputErrorMsg("")

                                if (inputValue !== apiKey.label) setInputErrorMsg(`You must exactly write ${apiKey.label}`)

                                try {
                                    await deleteApiKey({ id: apiKey.id })
                                    resetApiKeys()
                                    onClose()
                                } catch {
                                    setInputErrorMsg("An unexpected error has occurred. Please try again.")
                                }

                                setLoading(false);
                            }}>
                                {isLoading ? 'Loading...' : 'Delete API key'}
                            </Button>
                            <Button color="danger" variant="bordered" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default DeleteApiKeyModal;
