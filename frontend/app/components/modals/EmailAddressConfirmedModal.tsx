import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Link } from "@nextui-org/react";
import { useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import { AuthModalType } from "~/types/modal";

const EmailAddressConfirmedModal = (props: any) => {
    const { isOpen, onClose, onOpenChange, guest } = props
    const { authModal, setModalType } = useContext(AuthModalContext);

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
                        <ModalHeader className="flex flex-col gap-1">Account activated</ModalHeader>
                        <ModalBody>
                            <p>Your email address has been confirmed.</p>
                            <p>{!!guest && <>You may now <Link style={{ textDecoration: 'underline' }} onClick={(e: any) => {
                                e.preventDefault()

                                onClose()

                                setModalType(AuthModalType.Login);
                                authModal.onOpen();
                            }} href='/'>log into your account.</Link></>}</p>
                        </ModalBody>
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

export default EmailAddressConfirmedModal;
