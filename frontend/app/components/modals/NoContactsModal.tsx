import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface NoContactsModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onTryAgain: () => void;
}

const NoContactsModal = ({ isOpen, onOpenChange, onTryAgain }: NoContactsModalProps) => {
    return (
        <Modal
            backdrop="blur"
            style={{ maxWidth: "375px" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">No Contacts Found</ModalHeader>
                        <ModalBody>There are no contacts available to import from this provider.</ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={() => {
                                onClose();
                                onTryAgain();
                            }}>
                                Try Again
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default NoContactsModal;
