import { Ref, useContext, useRef, useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Link } from "@nextui-org/react";
import UserContext from "~/contexts/UserContext";
import AuthButtons from "~/components/buttons/AuthButtons";
import { AuthModalType } from "~/types/modal";
import signup from "~/services/api/email_signup";
import CodeConfirmationForm from "../../forms/CodeConfirmationForm";
import confirmEmail from "~/services/api/confirm_email_address";
import { navigateToUrl } from "~/utils/url";
import { isValidPassword } from "~/utils/password";
import AuthModalContext from "~/contexts/AuthModalContext";
import resetPassword from "~/services/api/reset_password";
import { isValidEmail } from "~/services/utils/email";
import setPassword from "~/services/api/set_password";
import { EyeFilledIcon } from "~/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "~/components/icons/EyeSlashFilledIcon";
import authEmail from "~/services/api/auth/email";
import { useSearchParams } from "@remix-run/react";

export default function SignupLoginModal(props: any) {
    const { authModal, modalType, setModalType } = useContext(AuthModalContext);

    const { isOpen, onClose, onOpenChange } = props;

    const { user, setUser, setTemp2faUserId } = useContext(UserContext);

    const close = () => {
        // setSubmitButtonVisible(false);
        onClose()
    }

    const [loginEmail, setLoginEmail] = useState("") // also used to reset password
    const [loginPassword, setLoginPassword] = useState("")

    const [signupEmail, setSignupEmail] = useState("")
    const [signupPassword, setSignupPassword] = useState("")

    const [isLoading, setLoading] = useState(false)

    const [loginError, setLoginError] = useState('')
    const [signupEmailError, setSignupEmailError] = useState('')
    const [signupPasswordError, setSignupPasswordError] = useState('')

    const isSignup = modalType === AuthModalType.Signup
    const isLogin = modalType === AuthModalType.Login

    const [isSignupEmailSent, setSignupEmailSent] = useState(false)

    const [isResetPasswordEmailSent, setResetPasswordEmailSent] = useState(false)

    const [signupConfirmationCode, setSignupConfirmationCode] = useState('')
    const [confirmationCodeError, setConfirmationCodeError] = useState('')

    const [resetPasswordConfirmationCode, setResetPasswordConfirmationCode] = useState('')
    const [resetPasswordConfirmationCodeError, setResetPasswordConfirmationCodeError] = useState('')

    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')

    const [isPasswordUpdated, setPasswordUpdated] = useState(false)

    const [isSignupButtonVisible, setSignupButtonVisible] = useState((isSignup && isSignupEmailSent) ?? false)
    const [isLoginButtonVisible, setLoginButtonVisible] = useState(false)

    const [isForgotPassVisible, setForgotPassVisible] = useState(false)

    const [resetPasswordCountdown, setResetPasswordCountdown] = useState<number | null>(null);
    const resetPasswordCountdownInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkExistingCountdown = () => {
            const storedEndTime = localStorage.getItem('resetPasswordCountdownEnd');
            if (storedEndTime) {
                const endTime = parseInt(storedEndTime);
                const now = Date.now();
                if (now < endTime) {
                    const remainingSeconds = Math.ceil((endTime - now) / 1000);
                    setResetPasswordCountdown(remainingSeconds);
                    startCountdown(remainingSeconds);
                } else {
                    localStorage.removeItem('resetPasswordCountdownEnd');
                }
            }
        };

        const startCountdown = (initialSeconds: number) => {
            setResetPasswordCountdown(initialSeconds);
            resetPasswordCountdownInterval.current = setInterval(() => {
                setResetPasswordCountdown((prevCountdown) => {
                    if (prevCountdown! <= 1) {
                        clearInterval(resetPasswordCountdownInterval.current!);
                        localStorage.removeItem('resetPasswordCountdownEnd');
                        return null;
                    } else return prevCountdown! - 1;
                });
            }, 1000);
        };

        checkExistingCountdown();

        if (isResetPasswordEmailSent && resetPasswordCountdown === null) {
            const endTime = Date.now() + (60 * 1000); // 60 seconds from now
            localStorage.setItem('resetPasswordCountdownEnd', endTime.toString());
            startCountdown(60);
        }

        return () => {
            if (resetPasswordCountdownInterval.current) {
                clearInterval(resetPasswordCountdownInterval.current);
            }
        };
    }, [isResetPasswordEmailSent]);

    const emailSignupOrConfirmEmail = async () => {
        setLoading(true)

        if (!isValidEmail(signupEmail)) {
            setSignupEmailError('Please enter a valid email address.')
            setLoading(false)
            return
        }

        const { isValid, errorMessage } = isValidPassword(signupPassword);
        if (!isValid) {
            setSignupPasswordError(errorMessage);
            setLoading(false);
            return;
        }

        try {
            if (isSignupEmailSent) {
                const res = await confirmEmail({ email: signupEmail, isNewAccount: true, code: signupConfirmationCode })
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
            setSignupEmailError('An unexpected error has occurred. Please try again.')
        }

        setLoading(false)
    }

    const emailLogin = async () => {
        setLoading(true)

        if (!isValidEmail(loginEmail)) {
            setLoginError('Please enter a valid email address.')
            setLoading(false)
            return
        }

        try {
            const res = await authEmail({ email: loginEmail, password: loginPassword })

            if (res.email) if (!res.isEmailConfirmed && loginEmail === res.email) {
                setSignupEmail(res.email)
                setSignupEmailSent(true)
                setModalType(AuthModalType.Signup)
            } else {
                setUser(res)
                navigateToUrl("/dashboard")
            }
            else if (res.is2faEnabled) setTemp2faUserId(res.id)
            else if (res.error) setLoginError(res.error)
        } catch {
            setLoginError('An unexpected error has occurred. Please try again.')
        }

        setLoading(false)
    }

    const forgotPassword = async () => {
        setLoading(true)

        if (!isValidEmail(loginEmail)) {
            setLoginError('Please enter a valid email address.')
            setLoading(false)
            return
        }

        try {
            const res = await resetPassword({ email: loginEmail })
            if (res.error) {
                setLoginError(res.error);
                setLoading(false);
                return
            }

            setResetPasswordEmailSent(true)
        } catch {
            setLoginError('An unexpected error has occurred. Please try again.')
        }

        setLoading(false)
    }

    const setNewPasswordWithCode = async () => {
        setLoading(true)

        const { isValid, errorMessage } = isValidPassword(newPassword);
        if (!isValid) {
            setNewPasswordError(errorMessage);
            setLoading(false);
            return;
        } else if (newPassword !== newPasswordConfirmation) {
            setNewPasswordConfirmationError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await setPassword({ email: loginEmail, emailConfirmationCode: parseInt(resetPasswordConfirmationCode), password: newPassword })
            if (res.error) {
                setResetPasswordConfirmationCodeError(res.error);
                setLoading(false);
                return
            }

            setPasswordUpdated(true)
        } catch {
            setLoginError('An unexpected error has occurred. Please try again.')
        }

        setLoading(false)
    }

    const [isNewPasswordVisible, setNewPasswordVisible] = useState(false)
    const [isNewPasswordConfirmationVisible, setNewPasswordConfirmationVisible] = useState(false)

    const toggleNewPasswordVisibility = () => setNewPasswordVisible(!isNewPasswordVisible);
    const toggleNewPasswordConfirmationVisibility = () => setNewPasswordConfirmationVisible(!isNewPasswordConfirmationVisible);

    const [newPasswordError, setNewPasswordError] = useState('')
    const [newPasswordConfirmationError, setNewPasswordConfirmationError] = useState('')

    const submitRef = useRef<any>()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const resetPasswordEmail = searchParams.get('reset_password_email');
        const resetPasswordCode = searchParams.get('reset_password_code');

        if (resetPasswordEmail && resetPasswordCode) {
            setLoginEmail(resetPasswordEmail);
            setResetPasswordConfirmationCode(resetPasswordCode);
            setResetPasswordEmailSent(true);
            setForgotPassVisible(true);
        }
    }, []);

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
                                {/* signup email confirmation code */}
                                {(isSignup && isSignupEmailSent) ? <>
                                    <CodeConfirmationForm submitRef={submitRef} error={confirmationCodeError} code={signupConfirmationCode} setCode={setSignupConfirmationCode} />
                                </> :
                                    // reset password confirmation code
                                    (isLogin && isResetPasswordEmailSent && !isPasswordUpdated) ? <>
                                        <CodeConfirmationForm submitRef={submitRef} error={resetPasswordConfirmationCodeError} code={resetPasswordConfirmationCode} setCode={setResetPasswordConfirmationCode} />
                                        <Input
                                            onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (event.key === 'Enter') submitRef.current?.click()
                                            }}
                                            onValueChange={setNewPassword}
                                            value={newPassword}
                                            label="New password"
                                            variant="bordered"
                                            placeholder={"Enter a new password"}
                                            endContent={
                                                <button className="focus:outline-none" type="button" onClick={toggleNewPasswordVisibility}>
                                                    {isNewPasswordVisible ? (
                                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                    ) : (
                                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                    )}
                                                </button>
                                            }
                                            type={isNewPasswordVisible ? "text" : "password"}
                                            errorMessage={newPasswordError}
                                            isInvalid={!!newPasswordError}
                                        />
                                        <Input
                                            onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (event.key === 'Enter') submitRef.current?.click()
                                            }}
                                            onValueChange={setNewPasswordConfirmation}
                                            value={newPasswordConfirmation}
                                            label="Confirm new password"
                                            variant="bordered"
                                            placeholder={"Confirm the new password"}
                                            endContent={
                                                <button className="focus:outline-none" type="button" onClick={toggleNewPasswordConfirmationVisibility}>
                                                    {isNewPasswordConfirmationVisible ? (
                                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                    ) : (
                                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                    )}
                                                </button>
                                            }
                                            type={isNewPasswordConfirmationVisible ? "text" : "password"}
                                            errorMessage={newPasswordConfirmationError}
                                            isInvalid={!!newPasswordConfirmationError}
                                        />
                                    </>
                                        :
                                        isPasswordUpdated ? <>
                                            <p>Password has been updated, you can now <Link style={{ textDecoration: 'underline' }} onClick={(e: any) => {
                                                e.preventDefault()

                                                onClose()

                                                setPasswordUpdated(false)
                                                setResetPasswordEmailSent(false)
                                                setForgotPassVisible(false)

                                                setModalType(AuthModalType.Login);
                                                authModal.onOpen();
                                            }} href='/'>log into your account</Link>.</p>
                                        </> :
                                            <AuthButtons isSignup={isSignup} isLogin={isLogin} signupEmail={signupEmail} signupPassword={signupPassword} setSignupEmail={setSignupEmail} setSignupPassword={setSignupPassword} loginEmail={loginEmail} loginPassword={loginPassword} setLoginEmail={setLoginEmail} setLoginPassword={setLoginPassword} isSignupButtonVisible={isSignupButtonVisible} setSignupButtonVisible={setSignupButtonVisible} isLoginButtonVisible={isLoginButtonVisible} setLoginButtonVisible={setLoginButtonVisible} modalType={modalType} loginError={loginError} setLoginError={setLoginError} signupEmailError={signupEmailError} signupPasswordError={signupPasswordError} isForgotPassVisible={isForgotPassVisible} setForgotPassVisible={setForgotPassVisible} submitRef={submitRef} />}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={onClose}>
                                    Close
                                </Button>

                                {/* Email signup & confirm email address */}
                                {(isSignup && isSignupButtonVisible) && <Button ref={submitRef} isDisabled={!signupEmail || !signupPassword || (isSignupEmailSent && signupConfirmationCode.length !== 6)} isLoading={isLoading} onClick={emailSignupOrConfirmEmail} color="primary" variant="shadow">
                                    {isLoading ? 'Loading' : isSignupEmailSent ? 'Submit' : AuthModalType.Signup}
                                </Button>}

                                {/* Email login */}
                                {(isLogin && isLoginButtonVisible && !isForgotPassVisible) && <Button ref={submitRef} isDisabled={!loginEmail || !loginPassword} isLoading={isLoading} onClick={emailLogin} color="primary" variant="shadow">
                                    {isLoading ? 'Loading' : AuthModalType.Login}
                                </Button>}

                                {/* Forgot password */}
                                {(isLogin && isForgotPassVisible && !isResetPasswordEmailSent) && <Button ref={submitRef} isDisabled={resetPasswordCountdown! > 0} isLoading={isLoading} onClick={forgotPassword} color="primary" variant="shadow">
                                    {isLoading ? 'Loading' : resetPasswordCountdown! > 0 ? `Reset password (${resetPasswordCountdown})` : 'Reset password'}
                                </Button>}

                                {/* Set new password with confirmation code */}
                                {(isLogin && isResetPasswordEmailSent && !isPasswordUpdated) && <Button ref={submitRef} isDisabled={isResetPasswordEmailSent && resetPasswordConfirmationCode.length !== 6} isLoading={isLoading} onClick={setNewPasswordWithCode} color="primary" variant="shadow">
                                    {isLoading ? 'Loading' : 'Submit'}
                                </Button>}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
