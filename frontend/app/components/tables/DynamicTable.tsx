import { Select, SelectItem, Table, Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useMemo, useState } from "react";

const rowsPerPageChoices = [10, 25, 50, 100].map(value => ({ label: value.toString(), value }));

export default function DynamicTable(props: any) {
    const { loadedItems, totalCount, loadHistory, columnNames, rowToMap } = props;

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const pages = Math.ceil(totalCount / rowsPerPage);

    const currentPageItems = useMemo(() => {
        if (loadedItems.length) {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return loadedItems.slice(start, end);
        } else return []
    }, [page, loadedItems, totalCount, rowsPerPage, loadHistory]);

    return (
        <>
            <div>
                <Select
                    defaultSelectedKeys={[rowsPerPage]}
                    items={rowsPerPageChoices}
                    label="Rows per page"
                    className="mb-4 w-[150px]"
                    onChange={async (e) => {
                        const newPerPageCount = Number(e.target.value);
                        if (loadedItems.length < totalCount) {
                            try {
                                await loadHistory(rowsPerPage, loadedItems.length);
                            } catch (err) {
                                console.error(err);
                                return;
                            }
                        }

                        setRowsPerPage(newPerPageCount);

                        // Compute the largest possible page number with the new rows per page count
                        const newPageMax = Math.ceil(totalCount / newPerPageCount);

                        // Set the page to the smaller of the current page and the new maximum page
                        setPage(Math.min(page, newPageMax));
                    }}
                >
                    {(item: any) => <SelectItem key={item.value}>{item.label}</SelectItem>}
                </Select >
                <Table aria-label="Email validation history" className="mb-16" bottomContent={!!loadedItems.length &&
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={async (newPage) => {
                                setPage(newPage)

                                const diff = newPage * rowsPerPage - currentPageItems.length
                                if (diff > 0 && loadedItems.length < totalCount) try {
                                    await loadHistory(diff, currentPageItems.length);
                                } catch (err) {
                                    console.error(err)
                                    return
                                }
                            }}
                        />
                    </div>
                }>
                    <TableHeader>
                        {columnNames.map((columnName: string, i: number) => <TableColumn className={i + 1 === columnNames.length ? 'flex justify-center items-center' : ''}>{columnName}</TableColumn>)}
                    </TableHeader>
                    <TableBody>
                        {!!currentPageItems.length ? currentPageItems.map((item: any, i: number) => rowToMap(item, i)) : <TableRow>
                            {columnNames.map((_: string, i: number) =>
                                <TableCell>{i === 0 && <p>Nothing to see here yet.</p>}</TableCell>
                            )}
                        </TableRow>}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}