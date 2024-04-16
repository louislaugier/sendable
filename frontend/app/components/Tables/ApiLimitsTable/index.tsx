import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function ApiLimitsTable() {
    return (
        <>
            <Table removeWrapper aria-label="Example static collection table" className="mb-16">
                <TableHeader>
                    <TableColumn>PLAN</TableColumn>
                    <TableColumn>MONTHLY WEB APP LIMIT</TableColumn>
                    <TableColumn>MONTHLY API LIMIT (SINGLE)</TableColumn>
                    <TableColumn>MONTHLY API LIMIT (BULK)</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow key="1">
                        <TableCell>Free</TableCell>
                        <TableCell>500</TableCell>
                        <TableCell>30</TableCell>
                        <TableCell>Unavailable</TableCell>
                    </TableRow>
                    <TableRow key="2">
                        <TableCell>Premium</TableCell>
                        <TableCell>300,000</TableCell>
                        <TableCell>10,000</TableCell>
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