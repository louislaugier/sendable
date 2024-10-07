import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState } from "react";
import SelectContactsTable from "../tables/SelectContactsTable";
import validateEmail from "~/services/api/validate_email";
import validateEmails from "~/services/api/validate_emails";
import { Reachability } from "~/types/email";
import ReachabilityChip from "../dropdowns/ReachabilityReference/ReachabilityChip";
import { ReachableDescriptor, RiskyDescriptor, UnknownDescriptor, InvalidDescriptor } from "../dropdowns/ReachabilityReference/ReachabilityDescriptor";
import RequestSent from "../page_sections/dashboard/EmailValidatorTab/RequestSent";

const SelectContactsModal = (props: any) => {
    const { isOpen, onClose, onOpenChange, contacts, resetHistory } = props;
    const [isLoading, setLoading] = useState(false);

    const [isRequestSent, setRequestSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>();
    const [singleTargetResp, setSingleTargetResp] = useState<any>()

    const reset = () => {
        setRequestSent(false)
        if (singleTargetResp) setSingleTargetResp(undefined)
    }


    return (
        <Modal
            isDismissable={false}
            backdrop="blur"
            onClose={onClose}
            hideCloseButton
            style={{ maxWidth: "500px" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="bottom-center"
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Select contacts to validate</ModalHeader>
                        <ModalBody>
                            {isRequestSent ?
                                <>
                                    {
                                        singleTargetResp ? <>
                                            <p style={{ lineHeight: "30px" }} className="mt-8 mb-4"><strong>Reachability</strong> for {contacts[0]}: <ReachabilityChip reachability={singleTargetResp.is_reachable} email={contacts[0]} /></p>
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
                                :
                                <SelectContactsTable contacts={contacts} />
                            }
                        </ModalBody>
                        <ModalFooter>
                            {!!errorMsg && <p className="mb-2" color="danger">{errorMsg}</p>}
                            {!isRequestSent && <Button isLoading={isLoading} color={"primary"} variant="shadow" onPress={async () => {
                                setLoading(true);
                                setErrorMsg('');

                                try {
                                    const emails = contacts
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

                                        if (resetHistory) await resetHistory()
                                    }
                                } catch (error: any) {
                                    setErrorMsg("An error occurred. Please try again.");
                                    setLoading(false);
                                    return
                                }

                                setRequestSent(true);

                                setLoading(false);
                            }}>
                                {isLoading ? 'Loading...' : 'Check reachability'}
                            </Button>}
                            <Button color="danger" variant="bordered" onPress={onClose}>
                                {isRequestSent ? 'Close' : 'Cancel'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default SelectContactsModal;
