import { createContext, useState, useEffect, useMemo } from "react";
import { User, UserContextType } from "~/types/user";
import { navigateToUrl } from "~/utils/url";

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { }
});

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // Initialize user state from localStorage to handle refreshes more consistently
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const userFromLocalStorage = localStorage.getItem('user');
            return userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
        }
        return null;
    });

    // Effect to update localStorage when the user state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        }
    }, [user]);

    // Memorize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ user, setUser }), [user]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
