import { Checkbox, Input, Link } from "@nextui-org/react"
import { LockIcon } from "~/icons/LockIcon"
import { MailIcon } from "~/icons/MailIcon"

export default function EmailAuthForm(props: any) {
    return (
        <>
            <Input
                autoFocus
                endContent={
                    <MailIcon nomargin className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
            />
            <Input
                endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
            />
            <div className="flex py-2 px-1 justify-between">
                <Checkbox
                    classNames={{
                        label: "text-small",
                    }}
                >
                    Remember me
                </Checkbox>
                <Link color="primary" href="#" size="sm">
                    Forgot password?
                </Link>
            </div>
        </>
    )
}

