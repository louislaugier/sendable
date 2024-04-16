import { Dispatch, SetStateAction } from "react";
import { Order } from "./order";

export interface User {
    id: string;
    email: string;
    isEmailConfirmed: boolean;
    jwt: string,
    authProvider?: string,
    orders: Order[],
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}