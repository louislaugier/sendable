import { Input } from "@nextui-org/react"

export default function TwoFactorAuthCodeInput(props: any) {
    const { twoFactorAuthCode, twoFactorAuthCodeErrorMsg, setTwoFactorAuthCode } = props
    
    return (
        <>
            <Input
                max={999999}
                type="number"
                variant="bordered"
                value={twoFactorAuthCode}
                errorMessage={twoFactorAuthCodeErrorMsg}
                onValueChange={setTwoFactorAuthCode}
                placeholder={"ex: 213654"}
                className="max-w-xs w-[115px]"
            />
        </>
    )
}