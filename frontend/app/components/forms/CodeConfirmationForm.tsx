import TwoFactorAuthCodeInput from "../inputs/TwoFactorAuthCodeInput"

export default function CodeConfirmationForm(props: any) {
    const { code, setCode, error, submitRef } = props

    return (
        <>
            <p className="text-sm">Enter the 6-digit confirmation code sent to your email address:</p>
            <TwoFactorAuthCodeInput submitRef={submitRef} twoFactorAuthCodeErrorMsg={error} twoFactorAuthCode={code} setTwoFactorAuthCode={setCode} />
        </>
    )
}