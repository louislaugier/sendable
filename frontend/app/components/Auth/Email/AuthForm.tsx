import { Checkbox, Input, Link } from "@nextui-org/react"
import { useState } from "react";
import { EyeFilledIcon } from "~/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "~/icons/EyeSlashFilledIcon";
import { MailIcon } from "~/icons/MailIcon"

export default function EmailAuthForm(props: any) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const toggleVisibility = () => setPasswordVisible(!isPasswordVisible);

    return (
        <>
            <Input
                autoFocus
                // endContent={
                //     <MailIcon nomargin className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                // }
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
            />

            <Input
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isPasswordVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                    </button>
                }
                type={isPasswordVisible ? "text" : "password"}
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

