import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useContext, ReactNode } from "react";
import ErrorOccuredModal from "~/components/Modals/ErrorOccuredModal";

type ErrorOccuredModalContextType = {
    setErrorOccuredModalVisible: (visible: boolean) => void;
};

const ErrorOccuredModalContext = createContext<ErrorOccuredModalContextType | undefined>(undefined);

type ErrorOccuredModalProviderProps = {
    children: ReactNode;
};

export const ErrorOccuredModalProvider: React.FC<ErrorOccuredModalProviderProps> = ({ children }) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const setErrorOccuredModalVisible = (visible: boolean) => {
        if (visible) onOpen()
        else onClose()
    };

    return (
        <ErrorOccuredModalContext.Provider value={{ setErrorOccuredModalVisible }}>
            <ErrorOccuredModal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} />
            {children}
        </ErrorOccuredModalContext.Provider>
    );
};

export const useErrorOccuredModal = () => {
    const context = useContext(ErrorOccuredModalContext);
    if (!context) {
        throw new Error("useErrorOccuredModal must be used within an ErrorOccuredModalProvider");
    }
    return context;
};
