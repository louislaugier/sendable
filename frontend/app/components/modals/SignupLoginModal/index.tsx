import { useContext, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import UserContext from "~/contexts/UserContext";
import AuthButtons from "~/components/buttons/AuthButtons";
import { AuthModalType } from "~/types/modal";
import signup from "~/services/api/signup";
import { useSearchParams } from "@remix-run/react";
import CodeConfirmationForm from "../../forms/CodeConfirmationForm";

export default function SignupLoginModal(props: any) {
    const { isOpen, onClose, onOpenChange, modalType } = props;

    const { user } = useContext(UserContext);

    const [isSubmitButtonVisible, setSubmitButtonVisible] = useState(false)

    const close = () => {
        setSubmitButtonVisible(false);
        onClose()
    }

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [searchParams] = useSearchParams();
    const isEmailAddressToConfirmCall = searchParams.get("email_to_confirm")

    const [signupEmail, setSignupEmail] = useState(isEmailAddressToConfirmCall)
    const [signupPassword, setSignupPassword] = useState("")

    const [isLoading, setLoading] = useState(false)

    const [loginError, setLoginError] = useState('')
    const [signupError, setSignupError] = useState('')

    const isSignup = modalType === AuthModalType.Signup
    const isLogin = modalType === AuthModalType.Login

    const [isSignupEmailSent, setSignupEmailSent] = useState(isEmailAddressToConfirmCall ?? false)

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
                                {isSignup && isSignupEmailSent ? <>
                                    <CodeConfirmationForm email={signupEmail} />
                                </> : <AuthButtons signupEmail={signupEmail} signupPassword={signupPassword} setSignupEmail={setSignupEmail} setSignupPassword={setSignupPassword} loginEmail={loginEmail} loginPassword={loginPassword} setLoginEmail={setLoginEmail} setLoginPassword={setLoginPassword} isSubmitButtonVisible={isSubmitButtonVisible} setSubmitButtonVisible={setSubmitButtonVisible} modalType={modalType} loginError={loginError} signupError={signupError} />}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={onClose}>
                                    Close
                                </Button>
                                {isSubmitButtonVisible && <Button isLoading={isLoading} onClick={async () => {
                                    setLoading(true)

                                    try {
                                        if (isLogin) {

                                        } else if (isSignup) {
                                            const res = await signup({ email: signupEmail, password: signupPassword })

                                            if (res.error) setSignupError(res.error)

                                            setSignupEmailSent(true)
                                        }
                                    } catch {
                                        const err = 'An unexpected error has occurred. Please try again.'
                                        if (isLoading) setLoginError(err)
                                        else if (isSignup) setSignupError(err)
                                    }

                                    setLoading(false)
                                }} color="primary" variant="shadow" onPress={onClose}>
                                    {isLoading ? 'Loading' : modalType}
                                </Button>}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
