import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@nextui-org/react";
import moment from "moment";
import { Validation, ValidationOrigin, ValidationStatus } from "~/types/validation";

export default function ValidationHistoryTable(props: any) {
    const { validations } = props;

    return (
        <>
            <Table removeWrapper aria-label="Example static collection table" className="mb-16">
                <TableHeader>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>TARGET EMAIL(S)</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ORIGIN</TableColumn>
                </TableHeader>
                <TableBody>
                    {validations.length && validations.map((validation: Validation, i: number) =>
                        <TableRow key={i}>
                            <TableCell>{moment(validation.createdAt).format("YYYY-MM-DD HH:MM:SS").toString()}</TableCell>
                            {/* TODO: check upload filename */}
                            <TableCell>{validation.singleTargetEmail ? validation.singleTargetEmail : `${validation.bulkFirstEmailAddress} and ${validation.bulkAddressCount} more ${validation.uploadFilename ? `(${validation.uploadFilename})` : ''}`}</TableCell>
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
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}