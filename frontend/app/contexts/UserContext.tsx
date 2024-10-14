import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { getClient } from "~/services/api";
import getUserData from "~/services/api/me";
import { User, UserContextType } from "~/types/user";

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    temp2faUserId: null,
    setTemp2faUserId: () => { },
    refreshUserData: () => Promise.resolve()
});

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [temp2faUserId, setTemp2faUserId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const userFromLocalStorage = localStorage.getItem('user');
            if (userFromLocalStorage) {
                const parsedUser = JSON.parse(userFromLocalStorage);
                if (parsedUser.currentPlan && parsedUser.jwt) {
                    return parsedUser;
                }
            }
        }
        return null;
    });

    useEffect(() => {
        (async function initializeUser() {
            if (typeof window !== 'undefined') {
                const client = await getClient();
                if (user && user.currentPlan && user.jwt) {
                    localStorage.setItem('user', JSON.stringify(user));
                    client.defaults.headers.common['Authorization'] = `Bearer ${user.jwt}`;
                } else {
                    localStorage.removeItem('user');
                    delete client.defaults.headers.common['Authorization'];
                }
            }
        })();
    }, [user]);

    const refreshUserData = useCallback(async () => {
        if (user) {
            const latestUserData = await getUserData();
            if (JSON.stringify(latestUserData) !== JSON.stringify(user)) { // compare the current user data with the fetched data
                setUser((prevUser: User | null) => ({ ...latestUserData, jwt: prevUser?.jwt }));
            }
        }
    }, [user?.jwt]); // Only depend on user.jwt

    useEffect(() => {
        if (user) refreshUserData();
    }, []);

    const value = useMemo(() => ({ user, setUser, temp2faUserId, setTemp2faUserId, refreshUserData }), [user, temp2faUserId, refreshUserData]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
