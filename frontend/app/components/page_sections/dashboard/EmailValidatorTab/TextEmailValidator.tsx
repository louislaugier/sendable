import { Textarea, Button, Chip } from "@nextui-org/react";
import { useState } from "react";
import { isValidEmail } from "~/services/utils/email";
import validateEmail from "~/services/api/validate_email";
import validateEmails from "~/services/api/validate_emails";
import SingleTargetReachability from "../../SingleTargetReachability";

export default function TextEmailValidator(props: any) {
    const { resetHistory } = props;

    const [emailsStr, setEmailsStr] = useState<string>('');
    const [validEmails, setValidEmails] = useState<Array<string>>([]);
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>();
    const [isRequestSent, setRequestSent] = useState(false);
    const [singleTargetResp, setSingleTargetResp] = useState<any>();

    const reset = () => {
        setEmailsStr('');
        setValidEmails([]);
        setRequestSent(false);
        setSingleTargetResp(undefined);
    };

    const submitEmails = async () => {
        setLoading(true);
        setErrorMsg('');

        if (!emailsStr) {
            setErrorMsg("Please enter at least 1 email address to validate.");
            setLoading(false);
            return;
        }

        try {
            const emails = validEmails;
            let res: any;

            if (emails.length > 1) {
                res = await validateEmails({ emails });
                if (res.error) {
                    setErrorMsg(res.error);
                    setLoading(false);
                    return;
                }
            } else {
                res = await validateEmail({ email: emails[0] });
                if (res.error) {
                    setErrorMsg(res.error);
                    setLoading(false);
                    return;
                }
                setSingleTargetResp(res);
                await resetHistory();
            }
        } catch (error: any) {
            setErrorMsg("An unexpected error occurred. Please try again.");
            setLoading(false);
            return;
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
        const emails = emailsStr.split(/[,;]/).map(email => email.trim()).filter(email => email !== emailToRemove);
        setValidEmails(emails.filter(email => isValidEmail(email)));
        setEmailsStr(emails.join(','));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setEmailsStr(input);

        const emails = input.split(/[,;]/).map(email => email.trim()).filter(email => email);
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

                <style>
                    {`
                        div {
                            --tw-ring-opacity: 0 !important;
                        }
                    `}
                </style>
                <div className="emails-input">
                    <Textarea
                        autoFocus
                        isDisabled={isLoading}
                        errorMessage={errorMsg}
                        isInvalid={!!errorMsg}
                        minRows={5}
                        value={emailsStr}
                        onChange={handleChange}
                        variant="faded"
                        label="Email addresses to validate"
                        placeholder="hello@domain.com,noreply@domain.com"
                        description="Enter a list of email addresses separated by commas or semicolons."
                        className="my-6 w-full"
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="w-full flex justify-center">
                    <Button isLoading={isLoading} onClick={submitEmails} isDisabled={!validEmails.length} color="primary" variant="shadow">
                        {isLoading ? 'Checking reachability...' : 'Check reachability'}
                    </Button>
                </div>
            </>
            :
            <SingleTargetReachability email={validEmails[0]} singleTargetResp={singleTargetResp} reset={reset} />
    );
}
