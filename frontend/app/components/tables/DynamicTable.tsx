import { Select, SelectItem, Table, Pagination, TableHeader, TableColumn, TableBody } from "@nextui-org/react";

const rowsPerPageChoices: any = [
    {
        label: "10",
        value: 10
    },
    {
        label: "25",
        value: 25
    },
    {
        label: "50",
        value: 50
    },
    {
        label: "100",
        value: 100
    },
]

export default function DynamicTable(props: any) {
    const { loadedItems, totalCount, loadHistory, columnNames, children, page, rowsPerPage, currentPageItems, setPage, setRowsPerPage } = props;
    const pages = Math.ceil(totalCount / rowsPerPage);

    return (
        <>
            <div>
                <Select
                    defaultSelectedKeys={[rowsPerPage]}
                    items={rowsPerPageChoices}
                    label="Rows per page"
                    style={{ width: "150px" }}
                    className="mb-4"
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
                <Table aria-label="Email validation history" className="mb-16" bottomContent={loadedItems.length &&
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
                        {children}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}