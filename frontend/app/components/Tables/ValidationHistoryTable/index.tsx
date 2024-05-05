import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Button } from "@nextui-org/react";
import moment from "moment";
import DownloadReportButton from "~/components/DownloadReportButton";
import { Validation, ValidationOrigin, ValidationStatus } from "~/types/validation";

export default function ValidationHistoryTable(props: any) {
    const { validations, loadHistory } = props;
    return (
        <>
            <Table removeWrapper aria-label="Example static collection table" className="mb-16">
                <TableHeader>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>TARGET EMAIL(S)</TableColumn>
                    <TableColumn>SOURCE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ORIGIN</TableColumn>
                    <TableColumn>RESULT</TableColumn>
                </TableHeader>
                <TableBody>
                    {validations.length && validations.map((validation: Validation, i: number) =>
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