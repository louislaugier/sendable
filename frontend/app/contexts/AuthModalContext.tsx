import { createContext, useState } from 'react';
import { AuthModalContextProps, AuthModalType } from '~/types/modal';


const AuthModalContext = createContext<AuthModalContextProps>({
    authModal: {
        isOpen: false,
        onOpen: () => { },
        onClose: () => { },
        onOpenChange: () => { },
    },
    modalType: undefined,
    setModalType: () => { },
});

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState<AuthModalType>();

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
    const onOpenChange = (isOpen: boolean) => setIsOpen(isOpen);

    const authModal = {
        isOpen,
        onOpen,
        onClose,
        onOpenChange,
    };

    return (
        <AuthModalContext.Provider value={{ authModal, modalType, setModalType }}>
            {children}
        </AuthModalContext.Provider>
    );
};

export default AuthModalContext;