import TwoFactorAuthCodeInput from "../inputs/TwoFactorAuthCodeInput"

export default function CodeConfirmationForm(props: any) {
    const { code, setCode, error } = props

    return (
        <>
            <p className="text-sm">Enter the 6-digit confirmation code sent to your email address:</p>
            <TwoFactorAuthCodeInput twoFactorAuthCodeErrorMsg={error} twoFactorAuthCode={code} setTwoFactorAuthCode={setCode} />
        </>
    )
}