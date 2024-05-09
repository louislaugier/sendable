import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination, Select, SelectItem } from "@nextui-org/react";
import moment from "moment";
import { useState, useMemo } from "react";
import DownloadReportButton from "~/components/DownloadReportButton";
import ReachabilityChip from "~/components/ReachabilityChip";
import { Validation, ValidationOrigin, ValidationStatus } from "~/types/validation";

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

export default function ValidationHistoryTable(props: any) {
    const { validations, totalCount, loadHistory } = props;

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const pages = Math.ceil(totalCount / rowsPerPage);

    const currentPageItems = useMemo(() => {
        if (validations.length) {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return validations.slice(start, end);
        } else return []
    }, [page, validations, totalCount, rowsPerPage]);

    return (
        <div>
            <Select
                defaultSelectedKeys={[rowsPerPage]}
                items={rowsPerPageChoices}
                label="Rows per page"
                style={{ width: "150px" }}
                className="mb-4"
                onChange={async (e) => {
                    const newPerPageCount = Number(e.target.value)
                    if (newPerPageCount > rowsPerPage && validations.length < totalCount) try {
                        await loadHistory(rowsPerPage, validations.length)
                    } catch (err) {
                        console.error(err)
                        return
                    }

                    setRowsPerPage(newPerPageCount)
                }}
            >
                {(item: any) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select >
            <Table aria-label="Email validation history" className="mb-16" bottomContent={validations.length &&
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={async (newPage) => {
                            if (newPage > page && validations.length < totalCount) try {
                                await loadHistory(rowsPerPage, (newPage - 1) * rowsPerPage);
                            } catch (err) {
                                console.error(err)
                                return
                            }

                            setPage(newPage)
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
                    {currentPageItems.length && currentPageItems.map((validation: Validation, i: number) =>
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
        </div>
    )
}