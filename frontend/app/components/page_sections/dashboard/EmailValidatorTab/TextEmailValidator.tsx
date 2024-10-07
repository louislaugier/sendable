import { Textarea, Button, Chip } from "@nextui-org/react";
import { useState } from "react";
import { isValidEmail } from "~/services/utils/email";
import { Reachability } from "~/types/email";
import RequestSent from "./RequestSent";
import ReachabilityChip from "~/components/dropdowns/ReachabilityReference/ReachabilityChip";
import { ReachableDescriptor, RiskyDescriptor, UnknownDescriptor, InvalidDescriptor } from "~/components/dropdowns/ReachabilityReference/ReachabilityDescriptor";
import validateEmail from "~/services/api/validate_email";
import validateEmails from "~/services/api/validate_emails";

export default function TextEmailValidator(props: any) {
    const { resetHistory } = props

    const [emailsStr, setEmailsStr] = useState<string>('');
    const [validEmails, setValidEmails] = useState<Array<string>>([]);

    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>();

    const [isRequestSent, setRequestSent] = useState(false);
    const [singleTargetResp, setSingleTargetResp] = useState<any>()

    const reset = () => {
        setEmailsStr('')
        setValidEmails([])
        setRequestSent(false)
        if (singleTargetResp) setSingleTargetResp(undefined)
    }

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

            if (emails.length > 1) {
                res = await validateEmails({ emails });

                if (res.error) {
                    setErrorMsg(res.error);
                    setLoading(false);
                    return
                }
            } else {
                res = await validateEmail({ email: emails[0] });

                if (res.error) {
                    setErrorMsg(res.error);
                    setLoading(false);
                    return
                }

                setSingleTargetResp(res)

                await resetHistory()
            }
        } catch (error: any) {
            setErrorMsg("An unexpected error occurred. Please try again.");
            setLoading(false);
            return
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
    }

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
                    {
                        `
                            div{
                                --tw-ring-opacity: 0 !important;
                            }
                        `
                    }
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
            <>
                {
                    singleTargetResp ? <>
                        <p style={{ lineHeight: "30px" }} className="mt-8 mb-4"><strong>Reachability</strong> for {validEmails[0]}: <ReachabilityChip reachability={singleTargetResp.is_reachable} email={validEmails[0]} /></p>
                        <div className="mb-4">
                            {
                                singleTargetResp.is_reachable === Reachability.Reachable ?
                                    <ReachableDescriptor nochip />
                                    : singleTargetResp.is_reachable === Reachability.Risky ?
                                        <RiskyDescriptor nochip />
                                        : singleTargetResp.is_reachable === Reachability.Unknown ?
                                            <UnknownDescriptor nochip />
                                            :
                                            <InvalidDescriptor noBrackets nochip />
                            }
                        </div>

                        {
                            (!singleTargetResp.syntax.is_valid_syntax || singleTargetResp.smtp.is_disabled || singleTargetResp.smtp.has_full_inbox || singleTargetResp.misc.is_role_account || singleTargetResp.misc.is_disposable || singleTargetResp.smtp.is_catch_all || (!singleTargetResp.mx.accepts_mail && !!singleTargetResp.syntax.domain)) &&
                            (() => {
                                const issues = [];
                                if (!singleTargetResp.syntax.is_valid_syntax) issues.push('• Address syntax is invalid');
                                if (!singleTargetResp.mx.accepts_mail && !!singleTargetResp.syntax.domain) issues.push(
                                    <span>
                                        • The domain <b>{singleTargetResp.syntax.domain}</b> does not accept emails
                                    </span>
                                );
                                if (singleTargetResp.smtp.is_disabled) issues.push('• Account has been disabled by email provider');
                                if (singleTargetResp.smtp.has_full_inbox) issues.push("• The account's inbox is currently full");
                                if (singleTargetResp.misc.is_role_account) issues.push("• The email address is a role account (e.g. support@sendable.email)");
                                if (singleTargetResp.misc.is_disposable) issues.push("• The email address is a disposable temporary email address");
                                if (singleTargetResp.smtp.is_catch_all) issues.push("• The email address is a catch-all address (destined to receive emails sent to non-existing addresses on a given domain name)");

                                return (
                                    <div>
                                        <b>Issues found:</b>
                                        <p>{issues.map((issue, index) => (
                                            <div key={index}>
                                                {issue}
                                                {index === issues.length - 1 ? '.' : ';'}
                                            </div>
                                        ))}</p>
                                    </div>
                                );
                            })()
                        }

                        <div className="w-full flex justify-center mt-12">
                            <Button onClick={reset} color="primary" variant="shadow">
                                New validation batch
                            </Button>
                        </div>
                    </>
                        :
                        <RequestSent reset={reset} />
                }
            </>

    );
}
