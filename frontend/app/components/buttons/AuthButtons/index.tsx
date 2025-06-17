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
    const { isSignupButtonVisible, setSignupButtonVisible, isLoginButtonVisible, setLoginButtonVisible, isSignup, isLogin, signupEmail, signupPassword, setSignupEmail, setSignupPassword, loginEmail, loginPassword, setLoginEmail, setLoginPassword, modalType, loginError, signupEmailError, signupPasswordError, isForgotPassVisible, setForgotPassVisible, submitRef, setLoginError } = props

    const { setUser, temp2faUserId, setTemp2faUserId } = useContext(UserContext)

    const [isLoading, setLoading] = useState(false)

    const [twoFactorAuthCode, setTwoFactorAuthCode] = useState("")
    const [twoFactorAuthCodeErrorMsg, setTwoFactorAuthCodeErrorMsg] = useState("")

    const submit2fa = async () => {
        setLoading(true)

        try {
            const res = await twoFactorAuth({ userId: temp2faUserId, twoFactorAuthenticationCode: parseInt(twoFactorAuthCode) })
            setTemp2faUserId(null)
            setUser(res)
            navigateToUrl('/dashboard')
        } catch {
            setTwoFactorAuthCodeErrorMsg("Wrong 2FA code.")
        }

        setLoading(false)
    }

    return (
        !!temp2faUserId ?
            <>
                <p>Enter the code from your two-factor authenticaton app. </p>
                <div className="flex mt-4 space-x-2">
                    <TwoFactorAuthCodeInput submit2fa={submit2fa} twoFactorAuthCode={twoFactorAuthCode} twoFactorAuthCodeErrorMsg={twoFactorAuthCodeErrorMsg} setTwoFactorAuthCode={setTwoFactorAuthCode} />
                    <Button isLoading={isLoading} onClick={submit2fa} className="mb-2" color="primary" variant="shadow">
                        {isLoading ? 'Loading...' : 'Confirm'}
                    </Button>
                </div>
            </>
            :
            ((isSignup && isSignupButtonVisible) || (isLogin && isLoginButtonVisible)) ? <>
                <Button onClick={() => {
                    if (isSignup) setSignupButtonVisible(false)
                    else if (isLogin) {
                        if (isForgotPassVisible) setForgotPassVisible(false)
                        else setLoginButtonVisible(false)
                    }
                }} className="border-none" isIconOnly variant="ghost" aria-label="Back">
                    <ArrowBackIcon />
                </Button>

                <EmailAuthForm loginError={loginError} signupEmailError={signupEmailError} signupEmail={signupEmail} signupPassword={signupPassword} setSignupEmail={setSignupEmail} setSignupPassword={setSignupPassword} loginEmail={loginEmail} loginPassword={loginPassword} setLoginEmail={setLoginEmail} setLoginPassword={setLoginPassword} modalType={modalType} signupPasswordError={signupPasswordError} isForgotPassVisible={isForgotPassVisible} setForgotPassVisible={setForgotPassVisible} submitRef={submitRef} setLoginError={setLoginError} />
            </> :
                <div className="flex flex-col py-4" style={{ width: '90%', alignItems: 'center', margin: 'auto' }}>
                    <div className="gap-2 flex flex-col" style={{ width: '220px' }}>

                        <SalesforceAuthButton modalType={modalType} />
                        <HubspotAuthButton modalType={modalType} />
                        <ZohoAuthButton modalType={modalType} />
                        <MailchimpAuthButton modalType={modalType} />
                    </div>

                    <Divider className="my-6" />

                    <div className="gap-2 flex flex-col" style={{ width: '220px' }}>
                        <GoogleAuthButton modalType={modalType} />
                        <LinkedinAuthButton modalType={modalType} />
                    </div>

                    <Divider className="my-6" />
                    <div className="gap-2 flex flex-col" style={{ width: '220px' }}>
                        <EmailAuthButton modalType={modalType} onClick={() => {
                            if (isSignup) setSignupButtonVisible(true)
                            else if (isLogin) setLoginButtonVisible(true)
                        }} />
                    </div>
                </div>
    )
}