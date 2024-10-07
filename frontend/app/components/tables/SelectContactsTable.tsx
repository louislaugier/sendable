import { Table, Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useState, useMemo } from "react";

export default function SelectContactsTable(props: any) {
    const { contacts, setSelectedContacts } = props;

    let contactsSet = new Set<string>([]);
    for (const key in contacts) contactsSet.add(key);
    const [selectedKeys, setSelectedKeys] = useState<any>(contactsSet);

    const [page, setPage] = useState(1);
    const rowsPerPage = 200;

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;

        return contacts.slice(start, start + rowsPerPage).map((contact: any, index: number) => ({
            key: start + index,
            email: contact
        }));
    }, [page, contacts]);

    const handleSelectionChange = (keys: any) => {
        setSelectedKeys(keys);
        const selectedContacts = Array.from(keys).map((key: any) => contacts[key]);
        setSelectedContacts(selectedContacts);
    };

    return (
        <>
            <Table
                selectionMode="multiple"
                defaultSelectedKeys={"all"}
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
        </>
    );
}
