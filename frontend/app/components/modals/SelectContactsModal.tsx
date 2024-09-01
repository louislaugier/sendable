import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination } from "@nextui-org/react";
import { useMemo, useState } from "react";
import SelectContactsTable from "../tables/SelectContactsTable";

const SelectContactsModal = (props: any) => {
    const { isOpen, onClose, onOpenChange, contacts } = props;
    const [isLoading, setLoading] = useState(false);

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
                            <SelectContactsTable contacts={contacts} />
                        </ModalBody>
                        <ModalFooter>
                            <Button isLoading={isLoading} color={"primary"} variant="shadow" onPress={async () => {
                                setLoading(true);

                                try {
                                    // validateEmail / validateEmails
                                } catch {
                                    alert("An unexpected error has occurred. Please try again.");
                                }

                                setLoading(false);
                            }}>
                                {isLoading ? 'Loading...' : 'Check reachability'}
                            </Button>
                            <Button color="danger" variant="bordered" onPress={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default SelectContactsModal;
