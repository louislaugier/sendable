import { Textarea, Button, Chip } from "@nextui-org/react";
import { useContext, useState } from "react";
import UserContext from "~/contexts/UserContext";
import CheckIcon from "~/icons/CheckIcon";
import validateEmails from "~/services/api/validate_emails";
import { isValidEmail } from "~/services/utils/email";

export default function TextEmailValidator(props: any) {
    const { user } = useContext(UserContext);

    const [emailsStr, setEmailsStr] = useState<string>('');
    const [validEmails, setValidEmails] = useState<Array<string>>([]);

    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>();
    const [isRequestSent, setRequestSent] = useState(false);

    const submitEmails = async () => {
        setLoading(true);
        setErrorMsg('');

        if (!emailsStr) {
            setErrorMsg("Please enter 1 or more email addresses to validate.");
            setLoading(false);
            return;
        }

        try {
            const emails = validEmails
            let res: any

            if (validEmails.length > 1) res = await validateEmails({ emails });
            else res = await validateEmails({ email: emails[0] });

            if (res === 429) {
                // Handle specific errors here
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
            <div className="flex flex-col items-center">
                <Chip
                    startContent={<CheckIcon size={18} />}
                    variant="faded"
                    color="success"
                    className="mt-6 mb-4"
                >
                    Import successful
                </Chip>
                <p className="mb-16">Your validation report will be sent to <b>{user?.email}</b> once every email address has been checked.</p>
                <Button onClick={() => setRequestSent(false)} color="primary" variant="shadow">
                    New validation batch
                </Button>
            </div>
    );
}
