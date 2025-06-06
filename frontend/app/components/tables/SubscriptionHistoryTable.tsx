import { TableRow, TableCell, Chip } from "@nextui-org/react";
import moment from "moment";
import { Subscription } from "~/types/subscription";
import DynamicTable from "./DynamicTable";
import { useState, useEffect, useContext } from "react";
import UserContext from "~/contexts/UserContext";
import { capitalize } from "~/utils/string";

const columnNames = [
    "PAYMENT DATE",
    "STARTING DATE",
    "PLAN",
    "BILLING PERIOD",
    "STATUS",
    "LATEST RENEWAL DATE"
]

export default function SubscriptionHistoryTable(props: any) {
    const { subscriptions, totalCount, loadHistory } = props;
    const { user } = useContext(UserContext)

    const [isHistoryFetched, setHistoryFetched] = useState(false);
    useEffect(() => {
        if (user && !isHistoryFetched) {
            loadHistory()
            setHistoryFetched(true)
        }
    }, [subscriptions, user, isHistoryFetched]);

    const rowToMap = (subscription: Subscription, i: number) => {
        const formattedCreatedAt = moment(subscription.createdAt).format("YYYY-MM-DD HH:mm:ss").toString()
        return <TableRow key={i}>
            <TableCell>{formattedCreatedAt}</TableCell>
            <TableCell>{!!subscription.delayedStartAt ? moment(subscription.delayedStartAt).format("YYYY-MM-DD HH:mm:ss").toString() : formattedCreatedAt}</TableCell>
            <TableCell>{capitalize(subscription.type)}</TableCell>
            <TableCell>{capitalize(subscription.billingFrequency)}</TableCell>
            <TableCell>
                {!subscription.cancelledAt ?
                    <Chip
                        variant="dot"
                        color="success"
                    >
                        Active
                    </Chip>
                    :
                    <Chip color="warning" variant="dot">Cancellation scheduled for {moment(subscription.cancelledAt).format("YYYY-MM-DD HH:mm:ss").toString()}</Chip>
                }
            </TableCell>
            <TableCell>{!!subscription.latestRenewedAt ? moment(subscription.latestRenewedAt).format("YYYY-MM-DD HH:mm:ss").toString() : ""}</TableCell>
        </TableRow>
    }

    return (
        <DynamicTable loadedItems={subscriptions} totalCount={totalCount} loadHistory={loadHistory} columnNames={columnNames} rowToMap={rowToMap} />
    )
}