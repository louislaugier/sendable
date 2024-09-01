import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useState } from "react";

const SelectContactsModal = (props: any) => {
    const { isOpen, onClose, onOpenChange, contacts } = props
    const [isLoading, setLoading] = useState(false)

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
                            <Table
                                selectionMode="multiple"
                                defaultSelectedKeys={[]}
                                aria-label="Imported contacts"
                            >
                                <TableHeader>
                                    <TableColumn>Select all</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {contacts.map((contact: string, i: number) =>
                                        <TableRow key={i}>
                                            <TableCell>{contact}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            <Button isLoading={isLoading} color={"primary"} variant="shadow" onPress={async () => {
                                setLoading(true);

                                try {
                                    // validateEmail / validateEmails
                                } catch {
                                    alert("An unexpected error has occurred. Please try again.")
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
