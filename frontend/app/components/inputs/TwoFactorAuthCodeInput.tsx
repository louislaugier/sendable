import { Input } from "@nextui-org/react"

export default function TwoFactorAuthCodeInput(props: any) {
    const { twoFactorAuthCode, twoFactorAuthCodeErrorMsg, setTwoFactorAuthCode, submit2fa } = props

    return (
        <>
            <style>
                {
                    `
                    /* Chrome, Safari, Edge, Opera */
                    #input2fa::-webkit-outer-spin-button,
                    #input2fa::-webkit-inner-spin-button {
                        -webkit-appearance: none !important;
                        margin: 0 !important;
                    }
            
                    /* Firefox */
                    #input2fa {
                        -moz-appearance: textfield !important;
                    }
                `
                }
            </style>
            <Input
                onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter' && submit2fa) await submit2fa()
                }}
                id="input2fa"
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