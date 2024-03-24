import { createContext, useState, useEffect } from "react";
import { User, UserContext } from "~/types/user";


const UserContext = createContext<UserContext | null>(null);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') as string) || null);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
