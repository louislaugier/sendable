import { Textarea, Button, Chip } from "@nextui-org/react";
import { useContext, useState } from "react";
import UserContext from "~/contexts/UserContext";
import CheckIcon from "~/icons/CheckIcon";
import validateEmail from "~/services/api/validate_email";
import validateEmails from "~/services/api/validate_emails";
import { isValidEmail } from "~/services/utils/email";
import { Reachability } from "~/types/email";
import ReachabilityChip from "../ReachabilityChip";
import { InvalidDescriptor, ReachableDescriptor, RiskyDescriptor, UnknownDescriptor } from "./ReachabilityDescriptor";

export default function TextEmailValidator(props: any) {
    const { remainingAppValidations } = props

    const { user } = useContext(UserContext);

    const [emailsStr, setEmailsStr] = useState<string>('');
    const [validEmails, setValidEmails] = useState<Array<string>>([]);

    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>();

    const [isRequestSent, setRequestSent] = useState(false);
    const [singleTargetReachability, setSingleTargetReachability] = useState<Reachability>()

    const submitEmails = async () => {
        setLoading(true);
        setErrorMsg('');

        if (!emailsStr) {
            setErrorMsg("Please enter at least 1 email address to validate.");
            setLoading(false);
            return;
        }

        try {
            const emails = validEmails
            let res: any

            if (validEmails.length > 1) {
                res = await validateEmails({ emails });

                if (res.error) {
                    setErrorMsg(res.error);
                    setLoading(false);
                    return
                }
            }
            else {
                res = await validateEmail({ email: emails[0] });

                if (res.error) {
                    setErrorMsg(res.error);
                    setLoading(false);
                    return
                }

                if (res.is_reachable) setSingleTargetReachability(res.is_reachable)
            }
        } catch (error: any) {
            setErrorMsg("An error occurred. Please try again.");
        }

        setRequestSent(true);

        setLoading(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitEmails();
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setValidEmails(validEmails.filter(email => email !== emailToRemove));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setEmailsStr(input);

        const emails = input.split(',').map(email => email.trim()).filter(email => email);
        const newValidEmails = emails.filter(email => isValidEmail(email));

        setValidEmails([...new Set(newValidEmails)]);
    };

    return (
        !isRequestSent ?
            <>
                {validEmails.length > 0 && validEmails.map((email, i) => (
                    <Chip key={i} onClose={() => handleRemoveEmail(email)} variant="bordered" className="mr-1">
                        {email}
                    </Chip>
                ))}

                <Textarea
                    isDisabled={isLoading}
                    errorMessage={errorMsg}
                    isInvalid={!!errorMsg}
                    minRows={5}
                    value={emailsStr}
                    onChange={handleChange}
                    variant="faded"
                    label="Email addresses"
                    placeholder="hello@domain.com,noreply@domain.com"
                    // TODO: or semicolon
                    description="Enter a list of email addresses to validate separated by a comma."
                    className="my-6 w-full"
                    onKeyDown={handleKeyDown}
                />
                <div className="w-full flex justify-center">
                    <Button onClick={submitEmails} isDisabled={!emailsStr} color="primary" variant="shadow">
                        {isLoading ? 'Checking reachability...' : 'Check reachability'}
                    </Button>
                </div>
            </>
            :
            <>
                {
                    singleTargetReachability ? <>
                        <p style={{ lineHeight: "30px" }} className="mt-8 mb-4">Reachability for {validEmails[0]}: <ReachabilityChip reachability={singleTargetReachability} email={validEmails[0]} /></p>
                        <div className="mb-12">
                            {
                                singleTargetReachability === Reachability.Reachable ?
                                    <ReachableDescriptor nochip />
                                    : singleTargetReachability === Reachability.Risky ?
                                        <RiskyDescriptor nochip />
                                        : singleTargetReachability === Reachability.Unknown ?
                                            <UnknownDescriptor nochip />
                                            :
                                            <InvalidDescriptor nochip />
                            }
                        </div>
                    </>
                        :
                        <div className="flex flex-col items-center">
                            <Chip
                                startContent={<CheckIcon size={18} />}
                                variant="faded"
                                color="success"
                                className="mt-6 mb-4"
                            >
                                Import successful
                            </Chip>
                            <p className="mb-16">Your validation report will be sent to <b>{user?.email}</b> once every email address has been checked. A maximum of {remainingAppValidations} emails will be validated (your remaining quota), and next ones will be dropped.</p>
                        </div>
                }
                <div className="w-full flex justify-center">
                    <Button onClick={() => setRequestSent(false)} color="primary" variant="shadow">
                        New validation batch
                    </Button>
                </div>
            </>

    );
}
