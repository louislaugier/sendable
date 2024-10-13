import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox } from "@nextui-org/react";

interface SelectContactsTableProps {
    contacts: string[];
    selectedContacts: string[];
    setSelectedContacts: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SelectContactsTable({ contacts, selectedContacts, setSelectedContacts }: SelectContactsTableProps) {
    const handleSelectionChange = (contact: string) => {
        setSelectedContacts(prev => 
            prev.includes(contact) 
                ? prev.filter(c => c !== contact) 
                : [...prev, contact]
        );
    };

    return (
        <Table aria-label="Example static collection table">
            <TableHeader>
                <TableColumn>Select</TableColumn>
                <TableColumn>Contact</TableColumn>
            </TableHeader>
            <TableBody>
                {contacts.map((contact) => (
                    <TableRow key={contact}>
                        <TableCell>
                            <Checkbox
                                isSelected={selectedContacts.includes(contact)}
                                onValueChange={() => handleSelectionChange(contact)}
                            />
                        </TableCell>
                        <TableCell>{contact}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
