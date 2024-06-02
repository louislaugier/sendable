import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { limits } from "~/constants/limits";

export default function ApiLimitsTable() {
    return (
        <>
            <Table removeWrapper aria-label="Example static collection table" className="mb-16">
                <TableHeader>
                    <TableColumn>PLAN</TableColumn>
                    <TableColumn>VIA PLATFORM</TableColumn>
                    <TableColumn>VIA API</TableColumn>
                    <TableColumn>VIA API (BULK)</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow key="1">
                        <TableCell>Free</TableCell>
                        <TableCell>{limits.free.app.toLocaleString()}</TableCell>
                        <TableCell>{limits.free.api.toLocaleString()}</TableCell>
                        <TableCell>Unavailable</TableCell>
                    </TableRow>
                    <TableRow key="2">
                        <TableCell>Premium</TableCell>
                        <TableCell>{limits.premium.app.toLocaleString()}</TableCell>
                        <TableCell>{limits.premium.api.toLocaleString()}</TableCell>
                        <TableCell>Unavailable</TableCell>
                    </TableRow>
                    <TableRow key="3">
                        <TableCell>Enterprise</TableCell>
                        <TableCell>Unlimited</TableCell>
                        <TableCell>Unlimited</TableCell>
                        <TableCell>Unlimited</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}