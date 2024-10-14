import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useContext, useState } from "react";
import UserContext from "~/contexts/UserContext";
import deleteAccount from "~/services/api/delete_account";
import { SubscriptionType } from "~/types/subscription";

const DeleteAccountModal = (props: any) => {
    const { isOpen, onClose, onOpenChange } = props

    const { user, setUser } = useContext(UserContext)

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
                        <ModalHeader className="flex flex-col gap-1">Delete my account and personal data</ModalHeader>
                        <ModalBody>
                            <p>You are about to delete your account.</p>
                            {user?.currentPlan?.type !== SubscriptionType.Free && <p>Because your account has an ongoing plan <b>({user?.currentPlan.type})</b>, we will deactivate your account until the next scheduled billing date. Logging back in or using the API will reactivate your account.</p>}

                            <Input
                                onPaste={(e) => e.preventDefault()}
                                type="text"
                                label={<>To confirm, type "<b>delete my account</b>" below:</>}
                                value={inputValue}
                                variant="bordered"
                                errorMessage={inputErrorMsg}
                                isInvalid={!!inputErrorMsg}
                                onValueChange={setInputValue}
                                placeholder={"delete my account"}
                                labelPlacement="outside"
                                className="max-w-xs mt-2"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button isDisabled={inputValue !== "delete my account"} isLoading={isLoading} color={"primary"} variant="shadow" onPress={async () => {
                                setLoading(true);

                                setInputErrorMsg("")

                                if (inputValue !== "delete my account") setInputErrorMsg(`You must exactly write "delete my account"`)

                                try {
                                    await deleteAccount()
                                    setUser(null)
                                } catch {
                                    setInputErrorMsg("An unexpected error has occurred. Please try again.")
                                }

                                setLoading(false);
                            }}>
                                {isLoading ? 'Loading...' : 'Delete account'}
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

export default DeleteAccountModal;
