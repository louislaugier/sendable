import { Input, Link } from "@nextui-org/react"
import { useState } from "react";
import { EyeFilledIcon } from "~/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "~/components/icons/EyeSlashFilledIcon";
import { AuthModalType } from "~/types/modal";

export default function EmailAuthForm(props: any) {
    const { signupEmail, signupPassword, setSignupEmail, setSignupPassword, loginEmail, loginPassword, setLoginEmail, setLoginPassword, modalType, loginError, signupEmailError } = props
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const toggleVisibility = () => setPasswordVisible(!isPasswordVisible);

    const isSignup = modalType === AuthModalType.Signup
    const isLogin = modalType === AuthModalType.Login

    return (
        <>
            <Input
                onValueChange={isLogin ? setLoginEmail : setSignupEmail}
                value={isLogin ? loginEmail : signupEmail}
                autoFocus
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
                errorMessage={isSignup ? signupEmailError : loginError}
                isInvalid={isSignup && !!signupEmailError || isLogin && !!loginError}
            />

            <Input
                onValueChange={isLogin ? setLoginPassword : setSignupPassword}
                value={isLogin ? loginPassword : signupPassword}
                label="Password"
                variant="bordered"
                placeholder={isSignup ? "Enter a password" : "Enter your password"}
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
                {/* <Checkbox
                    classNames={{
                        label: "text-small",
                    }}
                >
                    Remember me
                </Checkbox> */}
                {isLogin && <Link color="primary" href="#" size="sm">
                    Forgot password?
                </Link>}
            </div>
        </>
    )
}

