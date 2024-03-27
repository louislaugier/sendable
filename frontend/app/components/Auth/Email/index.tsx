import { Button } from "@nextui-org/button"
import { MailIcon } from "~/icons/MailIcon"

export default function EmailAuthButton() {
    const emailLogin = () => {

    }
    return (
        <>
            <Button style={{ justifyContent: 'flex-start' }} onClick={emailLogin} variant="bordered" startContent={<MailIcon className="text-2xl" />
            }>
                Continue with e-mail
            </Button>
        </>
    )
}

