import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination } from "@nextui-org/react";
import { useMemo, useState } from "react";

const SelectContactsModal = (props: any) => {
    const { isOpen, onClose, onOpenChange, contacts } = props;
    const [isLoading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const rowsPerPage = 200;

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return contacts.slice(start, end).map((contact: any, index: number) => ({
            key: start + index,
            email: contact
        }));
    }, [page, contacts]);

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
                                defaultSelectedKeys={"all"}
                                aria-label="Imported contacts"
                                bottomContent={
                                    <div className="flex w-full justify-center">
                                        <Pagination
                                            isCompact
                                            showControls
                                            showShadow
                                            color="primary"
                                            page={page}
                                            total={Math.ceil(contacts.length / rowsPerPage)}
                                            onChange={(page) => setPage(page)}
                                        />
                                    </div>
                                }
                            >
                                <TableHeader>
                                    <TableColumn>ALL ({contacts.length})</TableColumn>
                                </TableHeader>
                                <TableBody items={items}>
                                    {(item: any) => (
                                        <TableRow key={item.key}>
                                            <TableCell>{item.email}</TableCell>
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
