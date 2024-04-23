import { Card, Button, Divider, CardFooter, Link, Input, Chip } from "@nextui-org/react";
import { useState, useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import UserContext from "~/contexts/UserContext";
import { CheckIconRound } from "~/icons/CheckIconRound";
import { MailIcon } from "~/icons/MailIcon";
import validateEmail from "~/services/api/validate_email";
import { isValidEmail, extractDomain } from "~/services/utils/email";
import { Reachability } from "~/types/email";
import { AuthModalType } from "~/types/modal";
import { navigateToUrl } from "~/utils/url";

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
            setReachability(res.is_reachable);
        } catch (error: any) {
            if (error.message === 'Too many requests') {
                setErrorMsg("Too many requests. Please try again later.");
            } else {
                setErrorMsg("An error occurred. Please try again.");
            }
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

    let reachabilityChip;
    if (reachability === Reachability.Reachable)
        reachabilityChip = <Chip
            startContent={<CheckIconRound size={18} />}
            variant="faded"
            color="success"
        >
            deliverable
        </Chip>;
    else if (reachability === Reachability.Risky)
        reachabilityChip = <Chip color="warning" variant="dot">{reachability}</Chip>;
    else if (reachability === Reachability.Unknown)
        reachabilityChip = <Chip color="warning" variant="dot">{reachability} (protected domain <b>{extractDomain(email!)}</b>)</Chip>;
    else if (reachability === Reachability.Invalid)
        reachabilityChip = <Chip color="danger">{reachability}</Chip>;

    // let reachabilityDescription;
    // if (reachability === Reachability.Reachable) reachabilityDescription = "A hard bounce rate lower than 1% is guaranteed."
    // else if (reachability === Reachability.Risky) reachabilityDescription = "The email address appears to exist, but has quality issues that may result in low engagement or a bounce. We don't recommend sending to these emails, and don't commit on an accuracy rate. An email is considered risky when at least one of the following is true: address is a disposable email address (DEA), address is a role account (e.g. support@ or admin@), address is a catch-all address, address has a full inbox."
    // else if (reachability === Reachability.Unknown) reachabilityDescription = `It might happen on rare occasions that the email provider doesn't allow real-time verification of emails. In this case, there's unfortunately nothing ${siteName} can do. Please let us know if this happens, we're working on finding ways to solve these issues, which in most occasions are solved on a case-by-case basis. In most cases, this error happens on timeout, when port 25 is closed. On some occasions, it might also happen that the email provider doesn't allow real-time verification of emails (for example, Hotmail). In this case, there's unfortunately nothing ${siteName} can do. Please let us know if this happens, we're working on finding clever ways to work around these issues.`
    // else if (reachability === Reachability.Invalid) reachabilityDescription = "We guarantee with a confidence of 99% that this email is not deliverable."

    return (
        <>

            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                shadow="lg"
            >
                <div className="bg-white p-8">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold mb-4">Try it out</h2>
                        {user && <Button onClick={() => navigateToUrl('/dashboard')} color="primary" variant="bordered" className="mb-4">
                            Go to dashboard
                        </Button>}
                    </div>
                    <Input
                        isDisabled={isLoading}
                        errorMessage={errorMsg}
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter an email address"
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
                                    <p style={{ lineHeight: "30px" }}>Reachability for {emailConfirmed}: {reachabilityChip}</p>
                                    {/* <p>{reachabilityDescription}</p> */}
                                    <Link onClick={() => {
                                        setModalType(AuthModalType.Signup);
                                        authModal.onOpen();
                                    }} className="mt-4 cursor-pointer">
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