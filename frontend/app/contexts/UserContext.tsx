import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { getClient } from "~/services/api";
import getUserData from "~/services/api/me";
import { User, UserContextType } from "~/types/user";

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    temp2faUserId: null,
    setTemp2faUserId: () => { },
    refreshUserData: () => Promise.resolve() // Adding a default no-op refreshUserData function
});

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [temp2faUserId, setTemp2faUserId] = useState<string | null>(null)

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
        (async function () {
            if (typeof window !== 'undefined') {
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    (await getClient()).defaults.headers.common['Authorization'] = `Bearer ${user.jwt}`;
                } else {
                    localStorage.removeItem('user');
                    delete (await getClient()).defaults.headers.common['Authorization'];
                }
            }
        })
    }, [user]);

    const refreshUserData = useCallback(async () => {
        if (user) {
            const latestUserData = await getUserData();
            setUser((prevUser: User | null) => { return { ...latestUserData, jwt: prevUser?.jwt } })
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            refreshUserData();
        }
    }, []);

    // Memorize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ user, setUser, temp2faUserId, setTemp2faUserId, refreshUserData }), [user, temp2faUserId, refreshUserData]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
