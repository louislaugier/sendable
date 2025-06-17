import { Input, Link } from "@nextui-org/react"
import { useState } from "react";
import { EyeFilledIcon } from "~/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "~/components/icons/EyeSlashFilledIcon";
import { AuthModalType } from "~/types/modal";

export default function EmailAuthForm(props: any) {
    const { signupEmail, signupPassword, setSignupEmail, setSignupPassword, loginEmail, loginPassword, setLoginEmail, setLoginPassword, modalType, loginError, signupEmailError, signupPasswordError, isForgotPassVisible, setForgotPassVisible, submitRef, setLoginError } = props
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const toggleVisibility = () => setPasswordVisible(!isPasswordVisible);

    const isSignup = modalType === AuthModalType.Signup
    const isLogin = modalType === AuthModalType.Login

    return (
        isForgotPassVisible ? <>
            {/* forgot password email input */}
            <Input
                onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') submitRef.current?.click()
                }}
                onValueChange={setLoginEmail}
                value={loginEmail}
                autoFocus
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
                errorMessage={loginError}
                isInvalid={!!loginError}
            />
        </> :
            <>
                {/* signup / login email input */}
                <Input
                    onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === 'Enter') submitRef.current?.click()
                    }}
                    onValueChange={isLogin ? (val) => {
                        setLoginError("")
                        setLoginEmail(val)
                    } : setSignupEmail}
                    value={isLogin ? loginEmail : signupEmail}
                    autoFocus
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    errorMessage={isSignup ? signupEmailError : loginError}
                    isInvalid={(isSignup && !!signupEmailError) || (isLogin && !!loginError)}
                />
                {/* signup / login password input */}
                <Input
                    onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === 'Enter') submitRef.current?.click()
                    }}
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
                    errorMessage={signupPasswordError}
                    isInvalid={!!signupPasswordError}
                />

                {isLogin && <div className="flex py-2 px-1 justify-between">
                    {/* <Checkbox
                    classNames={{
                        label: "text-small",
                    }}
                >
                    Remember me
                </Checkbox> */}
                    <Link onClick={() => setForgotPassVisible(true)} color="primary" size="sm" className="cursor-pointer" style={{textDecoration: 'underline'}}>
                        Forgot password?
                    </Link>
                </div>}
            </>
    )
}

