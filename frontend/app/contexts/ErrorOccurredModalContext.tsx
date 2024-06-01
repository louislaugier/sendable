import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useContext, ReactNode } from "react";
import ErrorOccurredModal from "~/components/modals/ErrorOccurredModal";

type ErrorOccurredModalContextType = {
    setErrorOccurredModalVisible: (visible: boolean) => void;
};

const ErrorOccurredModalContext = createContext<ErrorOccurredModalContextType | undefined>(undefined);

type ErrorOccurredModalProviderProps = {
    children: ReactNode;
};

export const ErrorOccurredModalProvider: React.FC<ErrorOccurredModalProviderProps> = ({ children }) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const setErrorOccurredModalVisible = (visible: boolean) => {
        if (visible) onOpen()
        else onClose()
    };

    return (
        <ErrorOccurredModalContext.Provider value={{ setErrorOccurredModalVisible }}>
            <ErrorOccurredModal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} />
            {children}
        </ErrorOccurredModalContext.Provider>
    );
};

export const useErrorOccurredModal = () => {
    const context = useContext(ErrorOccurredModalContext);
    if (!context) {
        throw new Error("useErrorOccurredModal must be used within an ErrorOccurredModalProvider");
    }
    return context;
};
