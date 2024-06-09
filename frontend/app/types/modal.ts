export enum AuthModalType {
    Login = "Log in",
    Signup = "Sign up",
}

export interface AuthModalContextProps {
    authModal: {
        isOpen: boolean,
        onOpen: () => void,
        onClose: () => void,
        onOpenChange: (isOpen: boolean) => void
    },
    modalType: AuthModalType | undefined,
    setModalType: React.Dispatch<React.SetStateAction<AuthModalType | undefined>>
}