import { Card, Button, Divider, CardFooter, Link, Input, Chip } from "@nextui-org/react";
import { useState, useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import UserContext from "~/contexts/UserContext";
import { MailIcon } from "~/components/icons/MailIcon";
import { isValidEmail, } from "~/services/utils/email";
import { Reachability } from "~/types/email";
import { AuthModalType } from "~/types/modal";
import { navigateToUrl } from "~/utils/url";
import ReachabilityChip from "~/components/dropdowns/ReachabilityReference/ReachabilityChip";
import validateEmail from "~/services/api/validate_email";

export default function TryItOut() {
    const { user } = useContext(UserContext);

    const [isLoading, setLoading] = useState(false);

    const [email, setEmail] = useState<string>();
    const [emailConfirmed, setEmailConfirmed] = useState<string>();
    const [reachability, setReachability] = useState<Reachability | null>();

    const [errorMsg, setErrorMsg] = useState<string>();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrorMsg('');
    };

    const submitEmail = async () => {
        setLoading(true);
        setErrorMsg('')

        if (!email) {
            setErrorMsg("Please enter an email address.");
            setLoading(false);
            return;
        } else if (!isValidEmail(email)) {
            setErrorMsg("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        setEmailConfirmed(email)
        setReachability(null)

        try {
            const res = await validateEmail({ email });

            if (res.error) {
                setErrorMsg(res.error);
                setLoading(false);
                return
            }

            setReachability(res.is_reachable);
        } catch (error: any) {
            setErrorMsg("An error occurred. Please try again.");
        }

        setLoading(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Prevent default behavior of the Enter key press
            event.preventDefault();

            submitEmail();
        }
    };

    const { authModal, setModalType } = useContext(AuthModalContext);

    return (
        <>

            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                shadow="lg"
            >
                <div className="bg-white p-8">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold mb-4">Test email address reachability</h2>
                        {user && <Button onClick={() => navigateToUrl('/dashboard')} color="primary" variant="bordered" className="mb-4">
                            Go to dashboard
                        </Button>}
                    </div>
                    <Input
                        autoFocus
                        isDisabled={isLoading}
                        errorMessage={errorMsg}
                        isInvalid={!!errorMsg}
                        value={email}
                        onChange={handleEmailChange}
                        label="Enter an email address"
                        placeholder="bob@gmail.com"
                        variant="bordered"
                        className="my-4"
                        endContent={
                            <MailIcon nomargin className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        onKeyDown={handleKeyDown}
                    />
                    <Button isLoading={isLoading} onClick={submitEmail} color="primary" variant="shadow" className="w-full">
                        {isLoading ? 'Checking reachability...' : 'Check reachability'}
                    </Button>
                    {reachability &&
                        <>
                            <Divider className="mt-8 mb-4" />
                            <CardFooter>
                                <div>
                                    <p style={{ lineHeight: "30px" }}>Reachability for {emailConfirmed}: <ReachabilityChip reachability={reachability} email={email} /></p>
                                    {/* <p>{reachabilityDescription}</p> */}
                                    <Link onClick={() => {
                                        setModalType(AuthModalType.Signup);
                                        authModal.onOpen();
                                    }} className="mt-4 cursor-pointer">
                                        {/* TODO: logged user */}
                                        <b>Learn more</b>
                                    </Link>
                                </div>
                            </CardFooter>
                        </>
                    }
                </div>
            </Card>
        </>
    )
}