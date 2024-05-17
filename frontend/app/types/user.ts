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
    currentPlan: Order,
    validationCounts: UserValidationCounts,
}

export interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

export interface UserValidationCounts {
    appValidationsCount: number
    apiValidationsCount: number
}