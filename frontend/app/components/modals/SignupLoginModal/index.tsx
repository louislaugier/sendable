import { useContext, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import UserContext from "~/contexts/UserContext";
import AuthButtons from "~/components/single_components/Nav/AuthButtons";

export default function App(props: any) {
    const { isOpen, onClose, onOpenChange, modalType } = props;

    const { user } = useContext(UserContext);

    const [isSubmitButtonVisible, setSubmitButtonVisible] = useState(false)

    const close = () => {
        setSubmitButtonVisible(false);
        onClose()
    }
    return (
        !user &&
        <>
            <Modal
                backdrop="blur"
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
                                <AuthButtons isSubmitButtonVisible={isSubmitButtonVisible} setSubmitButtonVisible={setSubmitButtonVisible} />
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
