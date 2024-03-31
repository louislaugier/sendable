import { Button, Card, CardFooter, Chip, Divider, Input, Link } from "@nextui-org/react";
import { useContext, useState } from "react";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import { CheckIcon } from "~/icons/CheckIcon";
import { MailIcon } from "~/icons/MailIcon";
import validateEmail from "~/services/api/auth/validate_email";
import { Reachability } from "~/types/email";
import { AuthModalType } from "~/types/modal";

export default function HeroSection() {
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

        setEmailConfirmed(email)
        setReachability(null)

        try {
            const res = await validateEmail({ email });
            setReachability(res.is_reachable);
        } catch { }
        setLoading(false);
    };

    const { authModal, modalType, setModalType } = useContext(AuthModalContext);

    let reachabilityChip;
    if (reachability === Reachability.Reachable)
        reachabilityChip = <Chip
            startContent={<CheckIcon size={18} />}
            variant="faded"
            color="success"
        >
            {reachability}
        </Chip>;
    else if (reachability === Reachability.Risky)
        reachabilityChip = <Chip color="warning" variant="dot">{reachability}</Chip>;
    else if (reachability === Reachability.Unknown)
        reachabilityChip = <Chip color="warning" variant="dot">{reachability}</Chip>;
    else if (reachability === Reachability.Invalid)
        reachabilityChip = <Chip color="danger">{reachability}</Chip>;

    // let reachabilityDescription;
    // if (reachability === Reachability.Reachable) reachabilityDescription = "A hard bounce rate lower than 1% is guaranteed."
    // else if (reachability === Reachability.Risky) reachabilityDescription = "The email address appears to exist, but has quality issues that may result in low engagement or a bounce. We don't recommend sending to these emails, and don't commit on an accuracy rate. An email is considered risky when at least one of the following is true: address is a disposable email address (DEA), address is a role account (e.g. support@ or admin@), address is a catch-all address, address has a full inbox."
    // else if (reachability === Reachability.Unknown) reachabilityDescription = `It might happen on rare occasions that the email provider doesn't allow real-time verification of emails. In this case, there's unfortunately nothing ${siteName} can do. Please let us know if this happens, we're working on finding ways to solve these issues, which in most occasions are solved on a case-by-case basis. In most cases, this error happens on timeout, when port 25 is closed. On some occasions, it might also happen that the email provider doesn't allow real-time verification of emails (for example, Hotmail). In this case, there's unfortunately nothing ${siteName} can do. Please let us know if this happens, we're working on finding clever ways to work around these issues.`
    // else if (reachability === Reachability.Invalid) reachabilityDescription = "We guarantee with a confidence of 99% that this email is not deliverable."

    return (
        <div style={{ height: 'calc(100vh - 65px)' }} className="flex flex-col items-center justify-center py-16">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                    <h1 className="text-4xl font-bold mb-4">Accurate, fast and secure email address validation service</h1>
                    <p className="text-lg mb-8">
                        You invest for better email marketing ROI. We help you find valid emails and connect with your customers. Boost your inbox placement and open rates with 99% accurate real-time email validation software and email deliverability tools like Email Scoring, Email Finder, email testing, and sender reputation monitoring.
                    </p>
                    <Button onClick={() => {
                        setModalType(AuthModalType.Signup);
                        authModal.onOpen();
                    }} color="primary" variant="shadow" className="mb-4">
                        Try It Free
                    </Button>
                    <p className="text-sm">Get 100 free monthly email verifications</p>
                </div>
                <div className="md:w-1/2 md:pl-8">
                    <Card
                        isBlurred
                        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                        shadow="lg"
                    >
                        <div className="bg-white p-8">
                            <h2 className="text-2xl font-bold mb-4">Try it out</h2>
                            <Input
                                isDisabled={isLoading}
                                errorMessage={errorMsg}
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Enter your email"
                                variant="bordered"
                                className="mb-4"
                                endContent={
                                    <MailIcon nomargin className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                            />
                            <Button isLoading={isLoading} onClick={submitEmail} color="primary" variant="shadow" className="w-full">
                                {isLoading ? 'Checking reachability...' : 'Check reachability'}
                            </Button>
                            {reachability &&
                                <>
                                    <Divider className="mt-8 mb-4" />
                                    <CardFooter>
                                        <div>
                                            <p>Reachability for {emailConfirmed}: {reachabilityChip}</p>
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
                </div>
            </div>
        </div>
    );
}
