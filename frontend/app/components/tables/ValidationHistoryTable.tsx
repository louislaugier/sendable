import { TableRow, TableCell, Chip, user } from "@nextui-org/react";
import moment from "moment";
import ReachabilityChip from "~/components/dropdowns/ReachabilityReference/ReachabilityChip";
import { Validation, ValidationOrigin, ValidationStatus } from "~/types/validation";
import DownloadReportButton from "../buttons/DownloadReportButton";
import DynamicTable from "./DynamicTable";
import { useState, useEffect, useContext } from "react";
import UserContext from "~/contexts/UserContext";

const columnNames = [
    "DATE",
    "SOURCE",
    "TARGET",
    "ORIGIN",
    "STATUS",
    "RESULT"
]

export default function ValidationHistoryTable(props: any) {
    const { validations, totalCount, loadHistory } = props;
    const { user } = useContext(UserContext)

    const [isHistoryFetched, setHistoryFetched] = useState(false);
    useEffect(() => {
        if (user && !isHistoryFetched) {
            loadHistory()
            setHistoryFetched(true)
        }
    }, [validations, user, isHistoryFetched]);

    const rowToMap = (validation: Validation, i: number) => <TableRow key={i}>
        <TableCell>{moment(validation.createdAt).format("YYYY-MM-DD HH:mm:ss").toString()}</TableCell>

        <TableCell>
            <p>{validation.providerSource ? `${validation.providerSource.charAt(0).toUpperCase()}${validation.providerSource.slice(1)}` : validation.uploadFilename ? validation.uploadFilename : 'Text (manual)'}</p>
        </TableCell>

        <TableCell>{validation.singleTargetEmail ? validation.singleTargetEmail : validation.bulkAddressCount ? `${validation.bulkAddressCount} addresses` : 'Processing...'}</TableCell>

        <TableCell>{validation.origin === ValidationOrigin.Platform ? 'Platform' : 'API'}</TableCell>

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

        <TableCell className="flex justify-center items-center" style={{ height: '56px' }}>
            {validation.reportToken ? <DownloadReportButton validationId={validation.id} reportToken={validation.reportToken} tooltipContent="Download report" /> : validation.singleTargetReachability && validation.singleTargetEmail ?
                <>
                    <ReachabilityChip reachability={validation.singleTargetReachability} email={validation.singleTargetEmail} />
                </> : <></>}
        </TableCell>

    </TableRow>

    return (
        <DynamicTable loadedItems={validations} totalCount={totalCount} loadHistory={loadHistory} columnNames={columnNames} rowToMap={rowToMap} />
    )
}