import { createContext, useState, useEffect } from "react";
import { User, UserContext } from "~/types/user";

const UserContext = createContext<UserContext>({
    user: null,
    setUser: () => { }
});

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userFromLocalStorage = localStorage.getItem('user');

            if (userFromLocalStorage) {
                setUser(JSON.parse(userFromLocalStorage));
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;