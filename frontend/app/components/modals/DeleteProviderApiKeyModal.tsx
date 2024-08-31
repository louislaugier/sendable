import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useContext, useState } from "react";
import UserContext from "~/contexts/UserContext";
import deleteProviderApiKey from "~/services/api/delete_provider_api_key";

const DeleteProviderApiKeyModal = (props: any) => {
    const { isOpen, onClose, onOpenChange, providerName, providerType } = props

    const [isLoading, setLoading] = useState(false)

    const { refreshUserData } = useContext(UserContext)

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
                        <ModalHeader className="flex flex-col gap-1">Delete {providerName} API key</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to remove your {providerName} API key from your account?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button isLoading={isLoading} color={"primary"} variant="shadow" onPress={async () => {
                                setLoading(true);

                                try {
                                    await deleteProviderApiKey({ provider: providerType })
                                    await refreshUserData()
                                    onClose()
                                } catch {
                                    alert("An unexpected error has occurred. Please try again.")
                                }

                                setLoading(false);
                            }}>
                                {isLoading ? 'Loading...' : 'Confirm'}
                            </Button>
                            <Button color="danger" variant="bordered" onPress={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default DeleteProviderApiKeyModal;
