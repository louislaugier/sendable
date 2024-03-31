import { Dispatch, SetStateAction } from "react";

export interface User {
    name: string;
    //... add the rest of the properties for your user
}

export interface UserContext {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

export interface UserContext {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}
