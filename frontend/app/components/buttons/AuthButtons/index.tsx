import { Divider } from "@nextui-org/divider";
import EmailAuthButton from "./EmailAuthButton";
import GoogleAuthButton from "./GoogleAuthButton";
import HubspotAuthButton from "./HubspotAuthButton";
import LinkedinAuthButton from "./LinkedinAuthButton";
import MailchimpAuthButton from "./MailchimpAuthButton";
import SalesforceAuthButton from "./SalesforceAuthButton";
import ZohoAuthButton from "./ZohoAuthButton";
import { ArrowBackIcon } from "~/components/icons/ArrowBackIcon";
import { Button } from "@nextui-org/react";
import EmailAuthForm from "~/components/modals/SignupLoginModal/EmailAuthForm";
import { useContext, useState } from "react";
import UserContext from "~/contexts/UserContext";
import TwoFactorAuthCodeInput from "~/components/inputs/TwoFactorAuthCodeInput";
import twoFactorAuth from "~/services/api/auth/2fa";
import { navigateToUrl } from "~/utils/url";

export default function AuthButtons(props: any) {
    const { isSubmitButtonVisible, setSubmitButtonVisible } = props

    const { setUser, temp2faUserId, setTemp2faUserId } = useContext(UserContext)

    const [isLoading, setLoading] = useState(false)

    const [twoFactorAuthCode, setTwoFactorAuthCode] = useState("")
    const [twoFactorAuthCodeErrorMsg, setTwoFactorAuthCodeErrorMsg] = useState("")

    return (
        !!temp2faUserId ?
            <>
                <p>Enter the code from your two-factor authenticaton app. </p>
                <div className="flex mt-4 space-x-2">
                    <TwoFactorAuthCodeInput twoFactorAuthCode={twoFactorAuthCode} twoFactorAuthCodeErrorMsg={twoFactorAuthCodeErrorMsg} setTwoFactorAuthCode={setTwoFactorAuthCode} />
                    <Button isDisabled={isLoading} onClick={async () => {
                        setLoading(true)

                        try {
                            const res = await twoFactorAuth({ userId: temp2faUserId, twoFactorAuthenticationCode: twoFactorAuthCode })
                            setTemp2faUserId(null)
                            setUser(res)
                            navigateToUrl('/dashboard')
                        } catch {
                            setTwoFactorAuthCodeErrorMsg("Wrong 2FA code.")
                        }

                        setLoading(false)
                    }} className="mb-2" color="primary" variant="shadow">
                        {isLoading ? 'Loading...' : 'Confirm'}
                    </Button>
                </div>
            </>
            :
            isSubmitButtonVisible ? <>
                <Button onClick={() => setSubmitButtonVisible(false)} className="border-none" isIconOnly variant="ghost" aria-label="Back">
                    <ArrowBackIcon />
                </Button>

                <EmailAuthForm />
            </> :
                <div className="flex flex-col py-4" style={{ width: '90%', alignItems: 'center', margin: 'auto' }}>
                    <div className="gap-2 flex flex-col" style={{ width: '220px' }}>

                        <SalesforceAuthButton />
                        <HubspotAuthButton />
                        <ZohoAuthButton />
                        <MailchimpAuthButton />
                    </div>

                    <Divider className="my-6" />

                    <div className="gap-2 flex flex-col" style={{ width: '220px' }}>
                        <GoogleAuthButton />
                        <LinkedinAuthButton />
                    </div>

                    <Divider className="my-6" />
                    <div className="gap-2 flex flex-col" style={{ width: '220px' }}>
                        <EmailAuthButton onClick={() => setSubmitButtonVisible(true)} />
                    </div>
                </div>
    )
}