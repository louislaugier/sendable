import { Button, Card, CardBody, CardHeader, Divider, Input, Snippet, useDisclosure } from "@nextui-org/react";
import QRCode from "qrcode.react";
import { useContext, useEffect, useRef, useState } from "react";
import { EyeFilledIcon } from "~/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "~/components/icons/EyeSlashFilledIcon";
import TwoFactorAuthCodeInput from "~/components/inputs/TwoFactorAuthCodeInput";
import DeleteAccountModal from "~/components/modals/DeleteAccountModal";
import UserContext from "~/contexts/UserContext";
import disable2fa from "~/services/api/disable_2fa";
import enable2fa from "~/services/api/enable_2fa";
import updateEmailAddress from "~/services/api/update_email_address";
import updatePassword from "~/services/api/update_password";
import { generate2faSecret, getQrCodeUrl } from "~/services/utils/2fa";
import { capitalize } from "~/utils/string";

export default function AccountTab() {
    const { user, setUser } = useContext(UserContext)

    const [isUpdateEmailAddressEmailSent, setUpdateEmailAddressEmailSent] = useState(false)
    const [emailUpdateCountdown, setEmailUpdateCountdown] = useState<number | null>(null);
    const emailUpdateCountdownInterval = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        const startCountdown = () => {
            setEmailUpdateCountdown(60);
            emailUpdateCountdownInterval.current = setInterval(() => {
                setEmailUpdateCountdown((prevCountdown) => {
                    if (prevCountdown! <= 1) {
                        clearInterval(emailUpdateCountdownInterval.current!);
                        return null;
                    } else return prevCountdown! - 1;
                });
            }, 1000);
        };
        if (isUpdateEmailAddressEmailSent) startCountdown();
        return () => clearInterval(emailUpdateCountdownInterval.current!);
    }, [isUpdateEmailAddressEmailSent]);

    const [isUpdateEmailButtonLoading, setUdateEmailButtonLoading] = useState(false)
    const [isUpdatePasswordButtonLoading, setUdatePasswordButtonLoading] = useState(false)
    const [is2faButtonLoading, set2faButtonLoading] = useState(false)

    const [email, setEmail] = useState(user?.email ?? "")
    const [emailErrorMsg, setEmailErrorMsg] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [isPasswordVisible, setPasswordVisible] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [isNewPasswordVisible, setNewPasswordVisible] = useState(false)
    const [isNewPasswordSet, setNewPasswordSet] = useState(false)
    const [passwordErrorsMsg, setPasswordErrorMsg] = useState("")

    const [isEnable2faClicked, setEnable2faClicked] = useState(false)
    const [generated2faSecret, setGenerated2faSecret] = useState("")
    const [twoFactorAuthCode, setTwoFactorAuthCode] = useState("")
    const [twoFactorAuthCodeErrorMsg, setTwoFactorAuthCodeErrorMsg] = useState("")

    const deleteAccountModal = useDisclosure()

    const reset2faChanges = () => {
        setEnable2faClicked(false)
        setGenerated2faSecret("")
        setTwoFactorAuthCode("")
        setTwoFactorAuthCodeErrorMsg("")
    }

    const submitNew2fa = async () => {
        set2faButtonLoading(true);

        if (!twoFactorAuthCode) setTwoFactorAuthCodeErrorMsg('Enter your 2FA code.')

        try {
            await enable2fa({ twoFactorAuthenticationCode: twoFactorAuthCode, twoFactorAuthenticationSecret: generated2faSecret })

            reset2faChanges()

            setUser((prevUser) => { return { ...prevUser!, is2faEnabled: true } })
        } catch {
            setTwoFactorAuthCodeErrorMsg("Wrong 2FA code.")
        }

        set2faButtonLoading(false);
    }

    const resetEmailData = () => {
        setEmailErrorMsg("")
        setUpdateEmailAddressEmailSent(false)
    }

    const resetPasswordData = () => {
        setPasswordErrorMsg("")
        setNewPasswordSet(false)
    }

    return (
        <>
            <div className="flex flew-wrap pt-4">
                <Card className="w-[600px] p-4">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md">Account settings</p>
                        </div>
                    </CardHeader>
                    <CardBody className="flex flex-col items-center">
                        {user?.authProvider && <p className="mb-2">Authentication provider: <b>{capitalize(user.authProvider)}</b></p>}
                        <Input
                            isDisabled={!!user?.authProvider}
                            type="email"
                            label="Email"
                            value={email}
                            variant="bordered"
                            errorMessage={emailErrorMsg}
                            onValueChange={(val) => {
                                if (isUpdateEmailAddressEmailSent) resetEmailData()

                                setEmail(val)
                            }}
                            placeholder={"Your email address"}
                            className="max-w-xs"
                            // color={isUpdateEmailAddressEmailSent ? 'success' : undefined}
                            description={isUpdateEmailAddressEmailSent && <p className="text-success">Please check your inbox to verify this new email address.</p>}
                        />
                        <Button className="mt-4" onClick={async () => {
                            setUdateEmailButtonLoading(true)

                            try {
                                await updateEmailAddress({ email })
                                setUpdateEmailAddressEmailSent(true)
                            } catch {
                                setEmailErrorMsg("An unexpected error has occurred. Please try again.")
                            }

                            setUdateEmailButtonLoading(false)
                        }} isLoading={isUpdateEmailButtonLoading} isDisabled={!!user?.authProvider || emailUpdateCountdown! > 0 || !email || email === user?.email} color="primary" variant="shadow">
                            {isUpdateEmailButtonLoading ? 'Loading...' : emailUpdateCountdown! > 0 ? `Update (${emailUpdateCountdown})` : 'Update'}
                        </Button>

                        <Divider className="my-8" />

                        {!user?.authProvider && <>
                            <Input
                                label="Current password"
                                variant="bordered"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onValueChange={(val) => {
                                    if (isNewPasswordSet) resetPasswordData()

                                    setCurrentPassword(val)
                                }}
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={() => setPasswordVisible(!isPasswordVisible)}>
                                        {isPasswordVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                type={isPasswordVisible ? "text" : "password"}
                                className="max-w-xs mb-2"
                            />
                            <Input
                                label="New password"
                                variant="bordered"
                                placeholder="Enter a new password"
                                value={newPassword}
                                onValueChange={(val) => {
                                    if (isNewPasswordSet) resetPasswordData()

                                    setNewPassword(val)
                                }}
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={() => setNewPasswordVisible(!isNewPasswordVisible)}>
                                        {isNewPasswordVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                type={isPasswordVisible ? "text" : "password"}
                                className="max-w-xs"
                                description={isNewPasswordSet && <p className="text-success">Your password has been updated.</p>}
                            />
                            <div className="mt-4">
                                <Button onClick={async () => {
                                    setUdatePasswordButtonLoading(true)

                                    try {
                                        await updatePassword({ currentPassword, newPassword })
                                        setNewPasswordSet(true)
                                    } catch {
                                        setPasswordErrorMsg("An unexpected error has occurred. Please try again.")
                                    }

                                    setUdatePasswordButtonLoading(false)
                                }} isLoading={isUpdatePasswordButtonLoading} isDisabled={!currentPassword || !newPassword || currentPassword === newPassword} color="primary" variant="shadow">
                                    {isUpdatePasswordButtonLoading ? 'Loading...' : 'Update'}
                                </Button>
                            </div>
                            <Divider className="my-8" />
                        </>}

                        <div className="w-full text-center">
                            <p className="mb-2">Two-factor authentication (2FA){user?.is2faEnabled && <b> (enabled)</b>}:</p>
                            {!user?.is2faEnabled ? <>
                                {isEnable2faClicked ? <div className="flex flex-col items-center">
                                    <p className="text-sm">Scan the QR code below using your authenticator app or save the following key:</p>

                                    <Snippet symbol='' className="text-sm mt-2 mb-4">{generated2faSecret}</Snippet>
                                    {!!user && generated2faSecret && <QRCode value={getQrCodeUrl(user?.email!, generated2faSecret)} />}

                                    <b className="text-sm mb-2 mt-4">Enter the six-digit code from the authenticator app</b>
                                    <p className="text-sm">After scanning the QR code, the app will display a six-digit code that you can enter below.</p>
                                    <div className="flex mt-4 space-x-2">
                                        <TwoFactorAuthCodeInput submit2fa={submitNew2fa} twoFactorAuthCode={twoFactorAuthCode} twoFactorAuthCodeErrorMsg={twoFactorAuthCodeErrorMsg} setTwoFactorAuthCode={setTwoFactorAuthCode} />
                                        <Button isDisabled={is2faButtonLoading} onClick={submitNew2fa} className="mb-2" color="primary" variant="shadow">
                                            {is2faButtonLoading ? "Loading..." : "Confirm"}
                                        </Button>
                                    </div>
                                </div> : <Button onClick={() => {
                                    setEnable2faClicked(true)
                                    setGenerated2faSecret(generate2faSecret())
                                }} className="mb-2" color="primary" variant="shadow">
                                    Enable
                                </Button>}
                            </> : <>
                                <div className="flex mt-2 mb-4 space-x-2 justify-center">
                                    <TwoFactorAuthCodeInput twoFactorAuthCode={twoFactorAuthCode} twoFactorAuthCodeErrorMsg={twoFactorAuthCodeErrorMsg} setTwoFactorAuthCode={setTwoFactorAuthCode} />

                                    <Button onClick={async () => {
                                        set2faButtonLoading(true);

                                        if (!twoFactorAuthCode) setTwoFactorAuthCodeErrorMsg('Enter your 2FA code.')

                                        try {
                                            await disable2fa({ twoFactorAuthenticationCode: twoFactorAuthCode })

                                            reset2faChanges()

                                            setUser((prevUser) => { return { ...prevUser!, is2faEnabled: false } })
                                        } catch {
                                            setTwoFactorAuthCodeErrorMsg("Wrong 2FA code.")
                                        }

                                        set2faButtonLoading(false);
                                    }} className="mb-2" color="primary" variant="shadow">
                                        {is2faButtonLoading ? "Disabling..." : "Disable"}
                                    </Button>
                                </div>
                            </>}
                        </div>

                        <Divider className="my-8" />

                        <p className="mb-2">Delete my account and personal data:</p>
                        <Button onClick={deleteAccountModal.onOpen} className="mb-2" color="danger" variant="bordered">
                            Delete account
                        </Button>
                    </CardBody>
                </Card>
            </div >
            <DeleteAccountModal isOpen={deleteAccountModal.isOpen} onClose={deleteAccountModal.onClose} onOpenChange={deleteAccountModal.onOpenChange} />
        </>
    )
}