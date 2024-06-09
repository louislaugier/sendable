import { TableRow, TableCell } from "@nextui-org/react";
import moment from "moment";
import { Subscription } from "~/types/subscription";
import DynamicTable from "./DynamicTable";
import { useState, useEffect, useContext } from "react";
import UserContext from "~/contexts/UserContext";

const columnNames = [
    "DATE",
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

    const rowToMap = (subscription: Subscription, i: number) => <TableRow key={i}>
        <TableCell>{moment(subscription.createdAt).format("YYYY-MM-DD HH:mm:ss").toString()}</TableCell>

    </TableRow>

    return (
        <DynamicTable loadedItems={subscriptions} totalCount={totalCount} loadHistory={loadHistory} columnNames={columnNames} rowToMap={rowToMap} />
    )
}