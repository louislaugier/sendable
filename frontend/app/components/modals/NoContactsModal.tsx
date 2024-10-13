import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

const NoContactsModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: () => void }) => {
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
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default NoContactsModal;