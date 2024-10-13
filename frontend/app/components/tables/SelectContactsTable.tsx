import { Table, Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell, Selection } from "@nextui-org/react";
import { useState, useMemo, useEffect } from "react";

export default function SelectContactsTable(props: any) {
    const { contacts, setSelectedContacts, selectedContacts } = props;

    // Initialize selectedKeys with all contacts
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
        new Set(contacts.map((_: unknown, index: number) => index.toString()))
    );

    const [page, setPage] = useState(1);
    const rowsPerPage = 200;

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return contacts.slice(start, start + rowsPerPage).map((contact: string, index: number) => ({
            key: (start + index).toString(),
            email: contact
        }));
    }, [page, contacts]);

    // Update selectedContacts when the component mounts
    useEffect(() => {
        setSelectedContacts(contacts);
    }, []);

    const handleSelectionChange = (keys: Selection) => {
        const newKeys = new Set<string>(
            keys === "all"
                ? contacts.map((_: unknown, i: number) => i.toString())
                : Array.from(keys as Iterable<string>)
        );
        setSelectedKeys(newKeys);
        const selectedContacts = Array.from(newKeys).map((key) => contacts[parseInt(key)]);
        setSelectedContacts(selectedContacts);
    };

    return (
        <>
            <Table
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
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
                    <TableColumn>Selected: {selectedKeys.size}</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item: any) => (
                        <TableRow key={item.key}>
                            <TableCell>{item.email}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
