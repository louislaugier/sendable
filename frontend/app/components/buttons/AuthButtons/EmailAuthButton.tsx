import { Button } from "@nextui-org/button"
import { MailIcon } from "~/components/icons/MailIcon"

export default function EmailAuthButton(props: any) {
    const { modalType } = props
    return (
        <>
            <Button style={{ justifyContent: 'flex-start' }} onClick={props.onClick} variant="bordered" color="primary" startContent={<MailIcon className="text-2xl" />
            }>
                {modalType} with email
            </Button>
        </>
    )
}

