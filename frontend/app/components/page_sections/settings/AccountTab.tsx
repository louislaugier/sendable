import { Button, Card, CardBody, Divider, Input, Snippet, useDisclosure } from "@nextui-org/react";
import QRCode from "qrcode.react";
import { useContext, useState } from "react";
import { EyeFilledIcon } from "~/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "~/components/icons/EyeSlashFilledIcon";
import TwoFactorAuthCodeInput from "~/components/inputs/TwoFactorAuthCodeInput";
import DeleteAccountModal from "~/components/modals/DeleteAccountModal";
import UserContext from "~/contexts/UserContext";
import disable2fa from "~/services/api/disable_2fa";
import enable2fa from "~/services/api/enable_2fa";
import { generate2faSecret, getQrCodeUrl } from "~/services/utils/2fa";

export default function AccountTab() {
    const { user, setUser } = useContext(UserContext)

    const [isLoading, setLoading] = useState(false)

    const [email, setEmail] = useState(user?.email ?? "")
    const [emailErrorMsg, setEmailErrorMsg] = useState("")

    const [password, setPassword] = useState("")
    const [isPasswordVisible, setPasswordVisible] = useState(false)
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [isPasswordConfirmationVisible, setPasswordConfirmationVisible] = useState(false)

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
        setLoading(true);

        try {
            await enable2fa({ twoFactorAuthenticationCode: twoFactorAuthCode, twoFactorAuthenticationSecret: generated2faSecret })

            reset2faChanges()

            setUser((prevUser) => { return { ...prevUser!, is2faEnabled: true } })
        } catch {
            setTwoFactorAuthCodeErrorMsg("Wrong 2FA code.")
        }

        setLoading(false);
    }

    return (
        <>
            <div className="flex flew-wrap pt-4">
                <Card className="w-[600px] p-4">
                    {/* <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md">User settings</p>
                        </div>
                    </CardHeader> */}
                    <CardBody className="flex flex-col items-center">
                        <Input
                            type="email"
                            label="Email"
                            value={email}
                            variant="bordered"
                            errorMessage={emailErrorMsg}
                            onValueChange={setEmail}
                            placeholder={"Your email address"}
                            // startContent={
                            //     <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            // }
                            className="max-w-xs"
                        />
                        <div className="mt-4">
                            <Button isDisabled={!email || email === user?.email} color="primary" variant="shadow">
                                Update
                            </Button>
                        </div>

                        <Divider className="my-8" />

                        <Input
                            label="Current password"
                            variant="bordered"
                            placeholder="Enter your current password"
                            value={password}
                            onValueChange={setPassword}
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
                            value={passwordConfirmation}
                            onValueChange={setPasswordConfirmation}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={() => setPasswordConfirmationVisible(!isPasswordConfirmationVisible)}>
                                    {isPasswordConfirmationVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isPasswordVisible ? "text" : "password"}
                            className="max-w-xs"
                        />
                        <div className="mt-4">
                            <Button isDisabled={!password || password === passwordConfirmation} color="primary" variant="shadow">
                                Update
                            </Button>
                        </div>

                        <Divider className="my-8" />

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
                                        <Button isDisabled={isLoading} onClick={submitNew2fa} className="mb-2" color="primary" variant="shadow">
                                            {isLoading ? "Loading..." : "Confirm"}
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
                                        setLoading(true);

                                        try {
                                            await disable2fa({ twoFactorAuthenticationCode: twoFactorAuthCode })

                                            reset2faChanges()

                                            setUser((prevUser) => { return { ...prevUser!, is2faEnabled: false } })
                                        } catch {
                                            setTwoFactorAuthCodeErrorMsg("Wrong 2FA code.")
                                        }

                                        setLoading(false);
                                    }} className="mb-2" color="primary" variant="shadow">
                                        Disable
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