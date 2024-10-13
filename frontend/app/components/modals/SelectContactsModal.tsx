import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState } from "react";
import SelectContactsTable from "../tables/SelectContactsTable";
import validateEmail from "~/services/api/validate_email";
import validateEmails from "~/services/api/validate_emails";
import SingleEmailReachability from "../page_sections/SingleTargetReachability";
import RequestSent from "../page_sections/RequestSent";

const SelectContactsModal = (props: any) => {
    const { isOpen, onClose, onOpenChange, contacts, resetHistory, setLoading, providerTitle } = props;
    const [isRequestSent, setRequestSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>();
    const [singleTargetResp, setSingleTargetResp] = useState<any>();
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const reset = () => {
        setRequestSent(false);
        setSingleTargetResp(undefined);
    };

    const handleClose = () => {
        reset();
        setSelectedContacts([]);
        setErrorMsg(undefined);
        setIsLoading(false);
        
        // Reset loading state for all providers
        ['Brevo', 'SendGrid', 'HubSpot', 'Mailchimp', 'Zoho', 'Salesforce'].forEach(provider => {
            setLoading(provider, false);
        });
        
        onClose();
    };

    const handleCheckReachability = async () => {
        setIsLoading(true); // Set loading state to true
        setLoading(true);
        setErrorMsg('');

        try {
            const emails = selectedContacts;
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

                if (resetHistory) await resetHistory();
            }
        } catch (error: any) {
            setErrorMsg("An unexpected error occurred. Please try again.");
            setLoading(false);
            return;
        }

        setRequestSent(true);
        setLoading(false);
        setIsLoading(false); // Set loading state to false
    };

    return (
        <Modal
            isDismissable={false}
            backdrop="blur"
            onClose={handleClose}
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
                            {isRequestSent ? (
                                singleTargetResp ? (
                                    <SingleEmailReachability email={contacts[0]} response={singleTargetResp} reset={reset} />
                                ) : (
                                    <RequestSent reset={reset} />
                                )
                            ) : (
                                <SelectContactsTable setSelectedContacts={setSelectedContacts} contacts={contacts} />
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <div>
                                {!!errorMsg && <p className="mb-2 text-danger display-block text-sm">{errorMsg}</p>}
                                <div className="flex gap-2">
                                    {!isRequestSent && (
                                        <Button
                                            isLoading={isLoading}
                                            color={"primary"}
                                            variant="shadow"
                                            onPress={handleCheckReachability}
                                        >
                                            {isLoading ? 'Loading...' : 'Check reachability'}
                                        </Button>
                                    )}
                                    <Button color="danger" variant="bordered" onPress={handleClose}>
                                        {isRequestSent ? 'Close' : 'Cancel'}
                                    </Button>
                                </div>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default SelectContactsModal;
