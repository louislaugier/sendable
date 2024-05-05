import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const ErrorOccuredModal = (props: any) => {
    const { isOpen, onClose, onOpenChange } = props

    return (
        <Modal
            backdrop="blur"
            onClose={onClose}
            style={{ maxWidth: "375px" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Unexpected error</ModalHeader>
                        <ModalBody>An error occured. Please try again.</ModalBody>
                        <ModalFooter>
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

export default ErrorOccuredModal;
