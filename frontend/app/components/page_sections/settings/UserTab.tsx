import { Input } from "@nextui-org/react";
import { MailIcon } from "~/components/icons/MailIcon";

export default function UserTab() {

    return (
        <>
            <Input
                type="email"
                label="Email"
                placeholder={"Your email address"}
                // value={email}
                labelPlacement="outside"
                startContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
            />
        </>
    )
}