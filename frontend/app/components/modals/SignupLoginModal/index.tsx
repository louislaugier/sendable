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
import { isValidPassword } from "~/utils/password";
import AuthModalContext from "~/contexts/AuthModalContext";

export default function SignupLoginModal(props: any) {
    const { modalType, setModalType } = useContext(AuthModalContext);

    const { isOpen, onClose, onOpenChange } = props;

    const { user, setUser, setTemp2faUserId } = useContext(UserContext);

    const close = () => {
        // setSubmitButtonVisible(false);
        onClose()
    }

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [signupEmail, setSignupEmail] = useState()
    const [signupPassword, setSignupPassword] = useState("")

    const [isLoading, setLoading] = useState(false)

    const [loginError, setLoginError] = useState('')
    const [signupEmailError, setSignupEmailError] = useState('')
    const [signupPasswordError, setSignupPasswordError] = useState('')

    const isSignup = modalType === AuthModalType.Signup
    const isLogin = modalType === AuthModalType.Login

    const [isSignupEmailSent, setSignupEmailSent] = useState(false)

    const [signupConfirmationCode, setSignupConfirmationCode] = useState('')
    const [confirmationCodeError, setConfirmationCodeError] = useState('')

    const [isSignupButtonVisible, setSignupButtonVisible] = useState((isSignup && isSignupEmailSent) ?? false)
    const [isLoginButtonVisible, setLoginButtonVisible] = useState(false)

    const [isForgotPassVisible, setForgotPassVisible] = useState(false)

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
                            <ModalHeader className="flex flex-col gap-1">{isLogin && isForgotPassVisible ? 'Reset password' : modalType}</ModalHeader>
                            <ModalBody>
                                {(isSignup && isSignupEmailSent) ? <>
                                    <CodeConfirmationForm error={confirmationCodeError} code={signupConfirmationCode} setCode={setSignupConfirmationCode} />
                                </> :
                                    <AuthButtons isSignup={isSignup} isLogin={isLogin} signupEmail={signupEmail} signupPassword={signupPassword} setSignupEmail={setSignupEmail} setSignupPassword={setSignupPassword} loginEmail={loginEmail} loginPassword={loginPassword} setLoginEmail={setLoginEmail} setLoginPassword={setLoginPassword} isSignupButtonVisible={isSignupButtonVisible} setSignupButtonVisible={setSignupButtonVisible} isLoginButtonVisible={isLoginButtonVisible} setLoginButtonVisible={setLoginButtonVisible} modalType={modalType} loginError={loginError} signupEmailError={signupEmailError} signupPasswordError={signupPasswordError} isForgotPassVisible={isForgotPassVisible} setForgotPassVisible={setForgotPassVisible} />}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={onClose}>
                                    Close
                                </Button>

                                {(isSignup && isSignupButtonVisible) && <Button isDisabled={!signupEmail || !signupPassword || (isSignupEmailSent && signupConfirmationCode.length !== 6)} isLoading={isLoading} onClick={async () => {
                                    setLoading(true)

                                    const { isValid, errorMessage } = isValidPassword(signupPassword);
                                    if (!isValid) {
                                        setSignupPasswordError(errorMessage);
                                        setLoading(false);
                                        return;
                                    }

                                    try {
                                        if (isSignupEmailSent) {
                                            const res = await confirmEmail({ email: signupEmail, isNewAccount: true, emailConfirmationCode: parseInt(signupConfirmationCode) })
                                            if (res.error) setConfirmationCodeError(res.error)
                                            else {
                                                setUser(res)
                                                navigateToUrl("/dashboard?email_confirmed=true")
                                            }
                                        } else {
                                            const res = await signup({ email: signupEmail, password: signupPassword })

                                            if (res.error) setSignupEmailError(res.error)
                                            else setSignupEmailSent(true)
                                        }
                                    } catch {
                                        const err = 'An unexpected error has occurred. Please try again.'
                                        if (isLogin) setLoginError(err)
                                        else if (isSignup) setSignupEmailError(err)
                                    }

                                    setLoading(false)
                                }} color="primary" variant="shadow">
                                    {isLoading ? 'Loading' : isSignupEmailSent ? 'Submit' : AuthModalType.Signup}
                                </Button>}

                                {(isLogin && isLoginButtonVisible) && <Button isDisabled={!!loginError || !loginEmail || !loginPassword} isLoading={isLoading} onClick={async () => {
                                    setLoading(true)

                                    try {
                                        const res = await login({ email: loginEmail, password: loginPassword })

                                        if (res.email) {
                                            if (!res.isEmailConfirmed && loginEmail === res.email) {
                                                setSignupEmail(res.email)
                                                setSignupEmailSent(true)
                                                setModalType(AuthModalType.Signup)
                                            } else {
                                                setUser(res)
                                                navigateToUrl("/dashboard")
                                            }
                                        } else if (res.is2faEnabled) setTemp2faUserId(res.id)
                                        else if (res.error) setLoginError(res.error)
                                    } catch {
                                        const err = 'An unexpected error has occurred. Please try again.'
                                        if (isLogin) setLoginError(err)
                                        else if (isSignup) setSignupEmailError(err)
                                    }

                                    setLoading(false)
                                }} color="primary" variant="shadow">
                                    {isLoading ? 'Loading' : (isSignup && isSignupEmailSent) || (isLogin && isForgotPassVisible) ? 'Submit' : AuthModalType.Login}
                                </Button>}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
