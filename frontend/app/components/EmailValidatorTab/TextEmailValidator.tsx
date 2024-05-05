import { Textarea, Button, Chip } from "@nextui-org/react";
import { useContext, useState } from "react";
import UserContext from "~/contexts/UserContext";
import CheckIcon from "~/icons/CheckIcon";
import validateEmails from "~/services/api/validate_emails";

export default function TextEmailValidator(props: any) {
    const { user } = useContext(UserContext);

    const [emailsStr, setEmailsStr] = useState<string | null>();
    const [isLoading, setLoading] = useState(false);

    const [errorMsg, setErrorMsg] = useState<string>();

    const [isRequestSent, setRequestSent] = useState(false);

    const submitEmails = async () => {
        setLoading(true);
        setErrorMsg('')

        if (!emailsStr) {
            setErrorMsg("Please enter 1 or more email addresses to vlidate.");
            setLoading(false);
            return;
        }

        try {
            const res = await validateEmails({ emails: emailsStr.split(',') });

            if (res === 429) {
                // TODO: error msgs (concurrency limit reached? monthly limit reached?)
                // setErrorMsg("You have reached your monthly limits. Please upgrade or try again later.");
                // setErrorMsg("You have reached your maximum number of parallel validations. Please wait and retry.");
            }
        } catch (error: any) {
            setErrorMsg("An error occurred. Please try again.");
        }

        setRequestSent(true)

        setLoading(false);
    };


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Prevent default behavior of the Enter key press
            event.preventDefault();

            submitEmails();
        }
    };

    return (
        isRequestSent ?
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
            :
            <>
                <Textarea
                    isDisabled={isLoading}
                    errorMessage={errorMsg}
                    isInvalid={!!errorMsg}
                    minRows={5}
                    value={emailsStr!}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailsStr(e.target.value)}
                    variant="faded"
                    label="Email addresses"
                    placeholder="hello@domain.com,noreply@domain.com"
                    description={`Enter a list of email addresses to validate separated by a coma.`}
                    className="my-6 w-full"
                    onKeyDown={handleKeyDown}
                />
                <div className="w-full flex justify-center">
                    <Button onClick={submitEmails} isDisabled={!emailsStr} color="primary" variant="shadow">
                        {isLoading ? 'Checking reachability...' : 'Check reachability'}
                    </Button>
                </div>
            </>
    )
}
