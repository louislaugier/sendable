import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination, getKeyValue, Spinner } from "@nextui-org/react";
import moment from "moment";
import { useState, useMemo } from "react";
import DownloadReportButton from "~/components/DownloadReportButton";
import ReachabilityChip from "~/components/ReachabilityChip";
import { Validation, ValidationOrigin, ValidationStatus } from "~/types/validation";
import { useAsyncList } from "@react-stately/data";

export default function ValidationHistoryTable(props: any) {
    const { validations, totalCount, loadHistory } = props;

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const pages = Math.ceil(totalCount / rowsPerPage);

    const items = useMemo(() => {
        if (validations.length) {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return validations.slice(start, end);
        } else return []
    }, [page, validations]);

    return (
        <>
            <Table removeWrapper aria-label="Email validation history" className="mb-16" bottomContent={items.length &&
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={async (page) => {
                            if (validations.length < totalCount) {
                                await loadHistory(rowsPerPage, validations.length)
                            }
                            setPage(page)
                        }}
                    />
                </div>
            }>
                <TableHeader>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Target</TableColumn>
                    <TableColumn>Source</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Origin</TableColumn>
                    <TableColumn className="flex justify-center items-center">Result</TableColumn>
                    {/* <TableColumn>DATE</TableColumn>
                    <TableColumn>TARGET</TableColumn>
                    <TableColumn>SOURCE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ORIGIN</TableColumn>
                    <TableColumn className="flex justify-center items-center">RESULT</TableColumn> */}
                </TableHeader>
                <TableBody>
                    {items.length && items.map((validation: Validation, i: number) =>
                        <TableRow key={i}>
                            <TableCell>{moment(validation.createdAt).format("YYYY-MM-DD HH:mm:ss").toString()}</TableCell>
                            <TableCell>{validation.singleTargetEmail ? validation.singleTargetEmail : validation.bulkAddressCount ? `${validation.bulkAddressCount} addresses` : 'Loading...'}</TableCell>
                            <TableCell>
                                <p>{validation.providerSource ? `${validation.providerSource.charAt(0).toUpperCase()}${validation.providerSource.slice(1)}` : validation.uploadFilename ? validation.uploadFilename : 'Text (manual)'}</p>
                            </TableCell>
                            <TableCell>
                                {validation.status === ValidationStatus.Completed ?
                                    <Chip
                                        variant="dot"
                                        color="success"
                                    >
                                        Completed
                                    </Chip>
                                    :
                                    validation.status === ValidationStatus.Processing ?
                                        <Chip color="default" variant="dot">Processing</Chip>
                                        :
                                        <Chip color="danger" variant="dot">Failed</Chip>
                                }
                            </TableCell>
                            <TableCell>{validation.origin === ValidationOrigin.Platform ? 'Platform' : 'API'}</TableCell>
                            <TableCell className="flex justify-center" style={{ height: '56px' }}>
                                {validation.reportToken ? <DownloadReportButton validationId={validation.id} reportToken={validation.reportToken} tooltipContent="Download report" /> : validation.singleTargetReachability && validation.singleTargetEmail ?
                                    <>
                                        <ReachabilityChip reachability={validation.singleTargetReachability} email={validation.singleTargetEmail} />
                                    </> : <>

                                    </>}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

export function Test(props: any) {
    const { loadHistory } = props;
    const [isLoading, setIsLoading] = useState(true);

    let list = useAsyncList({
        async load({ signal }: any) {
            const history = await loadHistory()
            setIsLoading(false);

            return {
                items: history ?? [],
            };
        },
        async sort({ items, sortDescriptor }: any) {
            return {
                items: items.sort((a: any, b: any) => {
                    let first = a[sortDescriptor.column];
                    let second = b[sortDescriptor.column];
                    let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
    });

    return (
        <Table
            aria-label="Example table with client side sorting"
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
            classNames={{
                table: "min-h-[400px]",
            }}
        >
            <TableHeader>
                <TableColumn key="createdAt" allowsSorting>
                    Name
                </TableColumn>
                <TableColumn key="height" allowsSorting>
                    Height
                </TableColumn>
                <TableColumn key="mass" allowsSorting>
                    Mass
                </TableColumn>
                <TableColumn key="birth_year" allowsSorting>
                    Birth year
                </TableColumn>
            </TableHeader>
            <TableBody
                items={list.items}
                isLoading={isLoading}
                loadingContent={<Spinner label="Loading..." />}
            >
                {(item: any) => (
                    <TableRow key={item.name}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}