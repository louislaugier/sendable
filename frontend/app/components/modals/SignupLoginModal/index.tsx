import { useContext, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import UserContext from "~/contexts/UserContext";
import AuthButtons from "~/components/buttons/AuthButtons";
import { AuthModalType } from "~/types/modal";
import signup from "~/services/api/signup";
import { useSearchParams } from "@remix-run/react";
import CodeConfirmationForm from "../../forms/CodeConfirmationForm";
import confirmEmail from "~/services/api/confirm_email_address";
import login from "~/services/api/login";
import { navigateToUrl } from "~/utils/url";

export default function SignupLoginModal(props: any) {
    const { isOpen, onClose, onOpenChange, modalType } = props;

    const { user, setUser, setTemp2faUserId } = useContext(UserContext);

    const [searchParams] = useSearchParams();
    const close = () => {
        setSubmitButtonVisible(false);
        onClose()
    }

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [signupEmail, setSignupEmail] = useState()
    const [signupPassword, setSignupPassword] = useState("")

    const [isLoading, setLoading] = useState(false)

    const [loginError, setLoginError] = useState('')
    const [signupEmailError, setSignupEmailError] = useState('')

    const isSignup = modalType === AuthModalType.Signup
    const isLogin = modalType === AuthModalType.Login

    const [isSignupEmailSent, setSignupEmailSent] = useState(false)

    const [signupConfirmationCode, setSignupConfirmationCode] = useState('')
    const [confirmationCodeError, setConfirmationCodeError] = useState('')

    const [isSubmitButtonVisible, setSubmitButtonVisible] = useState(isSignupEmailSent ?? false)

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
                                    <CodeConfirmationForm error={confirmationCodeError} code={signupConfirmationCode} setCode={setSignupConfirmationCode} />
                                </> : <AuthButtons signupEmail={signupEmail} signupPassword={signupPassword} setSignupEmail={setSignupEmail} setSignupPassword={setSignupPassword} loginEmail={loginEmail} loginPassword={loginPassword} setLoginEmail={setLoginEmail} setLoginPassword={setLoginPassword} isSubmitButtonVisible={isSubmitButtonVisible} setSubmitButtonVisible={setSubmitButtonVisible} modalType={modalType} loginError={loginError} signupEmailError={signupEmailError} />}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={onClose}>
                                    Close
                                </Button>
                                {isSubmitButtonVisible && <Button isDisabled={(isLogin && (!!loginError || !loginEmail || !loginPassword)) || (isSignup && (!signupEmail || !signupPassword))} isLoading={isLoading} onClick={async () => {
                                    setLoading(true)

                                    try {
                                        if (isLogin) {
                                            const res = await login({ email: loginEmail, password: loginPassword })

                                            if (res.email) {
                                                setUser(res)
                                                navigateToUrl('/dashboard')
                                            } else if (res.is2faEnabled) setTemp2faUserId(res.id)
                                            else if (res.error) setLoginError(res.error)
                                        } else if (isSignup) {
                                            if (isSignupEmailSent) {
                                                const res = await confirmEmail({ email: signupEmail, isNewAccount: true, emailConfirmationCode: parseInt(signupConfirmationCode) })
                                                if (res.error) setConfirmationCodeError(res.error)
                                                else {
                                                    setUser(res)
                                                    navigateToUrl("/dashboard?email_confirmed=true")
                                                }
                                            } else {
                                                const res = await signup({ email: signupEmail, password: signupPassword })

                                                console.log(res)
                                                if (res.error) setSignupEmailError(res.error)
                                                else setSignupEmailSent(true)
                                            }
                                        }
                                    } catch {
                                        const err = 'An unexpected error has occurred. Please try again.'
                                        if (isLogin) setLoginError(err)
                                        else if (isSignup) setSignupEmailError(err)
                                    }

                                    setLoading(false)
                                }} color="primary" variant="shadow">
                                    {isLoading ? 'Loading' : isSignupEmailSent ? 'Submit' : modalType}
                                </Button>}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
