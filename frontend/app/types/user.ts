import { Dispatch, SetStateAction } from "react";
import { Subscription } from "./subscription";

export interface User {
    id: string,
    email: string,
    isEmailConfirmed: boolean,
    is2faEnabled: boolean,
    jwt: string,
    authProvider?: string,
    subscriptions: Subscription[],
    createdAt: string,
    updatedAt: string,
    deletedAt?: string,
    currentPlan: Subscription,
    validationCounts: UserValidationCounts,
    stripeCustomerPortalUrl?: string
}

export interface UserContextType {
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>,
    temp2faUserId: string | null,
    setTemp2faUserId: Dispatch<SetStateAction<string | null>>
}

export interface UserValidationCounts {
    appValidationsCount: number,
    apiValidationsCount: number
}