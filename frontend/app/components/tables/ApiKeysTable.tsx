import { TableRow, TableCell, Tooltip, useDisclosure } from "@nextui-org/react";
import moment from "moment";
import { ApiKey } from "~/types/apiKey";
import DynamicTable from "./DynamicTable";
import { useState, useEffect, useContext, Fragment } from "react";
import UserContext from "~/contexts/UserContext";
import DeleteIcon from "../icons/DeleteIcon";
import DeleteApiKeyModal from "../modals/DeleteApiKeyModal";

const columnNames = [
    "DATE",
    "LABEL",
    "KEY",
    "ACTIONS"
]

export default function ApiKeysTable(props: any) {
    const { apiKeys, totalCount, loadHistory, resetApiKeys } = props;
    const { user } = useContext(UserContext)

    const [isHistoryFetched, setHistoryFetched] = useState(false);
    useEffect(() => {
        if (user && !isHistoryFetched) {
            loadHistory()
            setHistoryFetched(true)
        }
    }, [apiKeys, user, isHistoryFetched]);

    const deleteApiKeyModal = useDisclosure();

    const [apiKeyToDelete, setApiKeyToDelete] = useState<ApiKey | null>(null)

    const rowToMap = (apiKey: ApiKey, i: number) => <TableRow key={i}>
        <TableCell>{moment(apiKey.createdAt).format("YYYY-MM-DD HH:mm:ss").toString()}</TableCell>
        <TableCell>{apiKey.label}</TableCell>
        <TableCell>{Array.from({ length: 32 - apiKey.lastChars.length }).map((_, i) => (
            <Fragment key={i}>*</Fragment>
        ))}{apiKey.lastChars}</TableCell>
        <TableCell className="flex justify-center">
            <Tooltip color="danger" content="Delete API key">
                <span onClick={() => {
                    setApiKeyToDelete(apiKey)
                    deleteApiKeyModal.onOpen()
                }} className="text-lg text-danger cursor-pointer active:opacity-50">
                    <DeleteIcon />
                </span>
            </Tooltip>
        </TableCell>
    </TableRow>

    return (
        <>
            <DynamicTable loadedItems={apiKeys} totalCount={totalCount} loadHistory={loadHistory} columnNames={columnNames} rowToMap={rowToMap} />
            {!!apiKeyToDelete && <DeleteApiKeyModal isOpen={deleteApiKeyModal.isOpen} onClose={deleteApiKeyModal.onClose} onOpenChange={deleteApiKeyModal.onOpenChange} resetApiKeys={resetApiKeys} apiKey={apiKeyToDelete} />}
        </>
    )
}