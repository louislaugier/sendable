import { Table, Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useState, useMemo } from "react";

export default function SelectContactsTable(props: any) {
    const { contacts } = props

    const [page, setPage] = useState(1);
    const rowsPerPage = 200;

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;

        return contacts.slice(start, start + rowsPerPage).map((contact: any, index: number) => ({
            key: start + index,
            email: contact
        }));
    }, [page, contacts]);

    return (
        <>
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
        </>
    )
}