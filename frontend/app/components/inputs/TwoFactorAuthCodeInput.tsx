import { Input } from "@nextui-org/react"

export default function TwoFactorAuthCodeInput(props: any) {
    const { twoFactorAuthCode, twoFactorAuthCodeErrorMsg, setTwoFactorAuthCode, submit2fa, label, submitRef } = props

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
                label={label!}
                labelPlacement="outside"
                onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') {
                        if (submit2fa) await submit2fa() // in settings
                        else submitRef.current?.click()
                    }
                }}
                id="input2fa"
                max={999999}
                type="number"
                variant="bordered"
                value={twoFactorAuthCode}
                errorMessage={twoFactorAuthCodeErrorMsg}
                isInvalid={!!twoFactorAuthCodeErrorMsg}
                onValueChange={setTwoFactorAuthCode}
                placeholder={"ex: 213654"}
                className="max-w-xs w-[115px]"
            />
        </>
    )
}