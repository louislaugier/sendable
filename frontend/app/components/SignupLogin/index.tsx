import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import Auth from "~/components/Auth";

export default function App(props: any) {
    const { isOpen, onClose, onOpenChange, modalType } = props;

    const [isSubmitButtonVisible, setSubmitButtonVisible] = useState(false)

    const close = () => {
        setSubmitButtonVisible(false);
        onClose()
    }

    return (
        <>
            <Modal
                onClose={close}
                style={{ maxWidth: "375px" }}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{modalType}</ModalHeader>
                            <ModalBody>
                                <Auth isSubmitButtonVisible={isSubmitButtonVisible} setSubmitButtonVisible={setSubmitButtonVisible} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={onClose}>
                                    Close
                                </Button>
                                {isSubmitButtonVisible && <Button color="primary" variant="shadow" onPress={onClose}>
                                    {modalType}
                                </Button>}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
