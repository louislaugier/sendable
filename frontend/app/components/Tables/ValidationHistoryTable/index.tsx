import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Button, Pagination } from "@nextui-org/react";
import moment from "moment";
import { useState, useMemo } from "react";
import DownloadReportButton from "~/components/DownloadReportButton";
import { Validation, ValidationOrigin, ValidationStatus } from "~/types/validation";

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
            <Table removeWrapper aria-label="Email validation history" className="mb-16" bottomContent={
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
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>TARGET</TableColumn>
                    <TableColumn>SOURCE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ORIGIN</TableColumn>
                    <TableColumn>RESULT</TableColumn>
                </TableHeader>
                <TableBody>
                    {items.length && items.map((validation: Validation, i: number) =>
                        <TableRow key={i}>
                            <TableCell>{moment(validation.createdAt).format("YYYY-MM-DD HH:mm:ss").toString()}</TableCell>
                            {/* TODO: check upload filename */}
                            <TableCell>{validation.singleTargetEmail ? validation.singleTargetEmail : `${validation.bulkAddressCount ? validation.bulkAddressCount + ' addresses' : 'Loading...'}`}</TableCell>
                            <TableCell>
                                <p>TODO</p>
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
                            <TableCell>
                                {validation.reportToken ? <DownloadReportButton validationId={validation.id} reportToken={validation.reportToken} tooltipContent="Download report" /> : <>
                                    {/* single target result with tooltip */}
                                </>}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}