import { Button } from "@nextui-org/button"
import { MailIcon } from "~/components/icons/MailIcon"

export default function EmailAuthButton(props: any) {
    return (
        <>
            <Button style={{ justifyContent: 'flex-start' }} onClick={props.onClick} variant="bordered" color="primary" startContent={<MailIcon className="text-2xl" />
            }>
                Continue with e-mail
            </Button>
        </>
    )
}

