import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import SelectContactsTable from "../tables/SelectContactsTable";
import validateEmail from "~/services/api/validate_email";
import validateEmails from "~/services/api/validate_emails";
import SingleEmailReachability from "../page_sections/SingleTargetReachability";
import RequestSent from "../page_sections/RequestSent";

interface SelectContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  contacts: string[];
  resetHistory: () => void;
  providerTitle: string;
  selectedContacts: string[];
  setSelectedContacts: Dispatch<SetStateAction<string[]>>;
}

interface SingleTargetResponse {
  // Define the structure of your single target response here
  // For example:
  email: string;
  isValid: boolean;
  // ... other properties
}

const SelectContactsModal = (props: SelectContactsModalProps) => {
    const { isOpen, onClose, onOpenChange, contacts = [], resetHistory, providerTitle, selectedContacts = [], setSelectedContacts } = props;

    console.log("SelectContactsModal rendered with props:", { isOpen, contacts, providerTitle });

    const [isRequestSent, setRequestSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>();
    const [singleTargetResp, setSingleTargetResp] = useState<SingleTargetResponse[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [currentProvider, setCurrentProvider] = useState<string | null>(null);

    const reset = useCallback(() => {
        setRequestSent(false);
        setSelectedContacts([]);
        setSingleTargetResp(undefined);
    }, [setSelectedContacts]);

    useEffect(() => {
        console.log("SelectContactsModal isOpen changed:", isOpen);
        if (isOpen && providerTitle) {
            setCurrentProvider(providerTitle);
        }

        return () => {
            reset();
            setErrorMsg(undefined);
            setIsLoading(false);
            setCurrentProvider(null);
        };
    }, [isOpen, providerTitle, reset]);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);

    const handleCheckReachability = useCallback(async () => {
        setIsLoading(true);
        setErrorMsg('');

        try {
            if (!selectedContacts?.length) {
                throw new Error("No emails selected");
            }

            const provider = currentProvider?.toLowerCase();
            if (!provider) {
                throw new Error("No provider selected");
            }

            console.log("Calling API with:", { selectedContacts, provider });

            if (selectedContacts.length === 1) {
                const res = await validateEmail({ email: selectedContacts[0] }, provider);
                console.log("Single email validation response:", res);
                if (res.error) {
                    setErrorMsg(res.error);
                    return;
                }
                setSingleTargetResp([res]);
            } else {
                const res = await validateEmails({ emails: selectedContacts }, undefined, provider);
                console.log("Multiple emails validation response:", res);
            }

            setRequestSent(true);

            if (resetHistory) await resetHistory();

        } catch (error: any) {
            console.error("Error during validation:", error);
            setErrorMsg(error.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedContacts, currentProvider, resetHistory]);

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
                                selectedContacts?.length === 1 ? (
                                    <SingleEmailReachability 
                                        email={selectedContacts[0]} 
                                        singleTargetResp={singleTargetResp?.[0]} 
                                        reset={reset} 
                                    />
                                ) : (
                                    <RequestSent reset={reset} />
                                )
                            ) : (
                                <SelectContactsTable 
                                    setSelectedContacts={setSelectedContacts} 
                                    contacts={contacts}
                                    selectedContacts={selectedContacts}
                                />
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <div>
                                {!!errorMsg && <p className="mb-2 text-danger display-block text-sm">{errorMsg}</p>}
                                <div className="flex gap-2">
                                    {!isRequestSent && (
                                        <Button
                                            isLoading={isLoading}
                                            color="primary"
                                            variant="shadow"
                                            onPress={handleCheckReachability}
                                            isDisabled={!selectedContacts?.length}
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
