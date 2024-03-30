import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import Auth from "~/components/Auth";

export default function App(props: any) {
    const { isOpen, onOpen, onOpenChange } = props;

    const [isSignInButtonVisible, setSignInButtonVisible] = useState(false)

    return (
        <>
            <Modal
                style={{ maxWidth: "375px" }}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Sign up / Log in</ModalHeader>
                            <ModalBody>
                                <Auth isSignInButtonVisible={isSignInButtonVisible} setSignInButtonVisible={setSignInButtonVisible} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={onClose}>
                                    Close
                                </Button>
                                {isSignInButtonVisible && <Button color="primary" variant="shadow" onPress={onClose}>
                                    Sign in
                                </Button>}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
