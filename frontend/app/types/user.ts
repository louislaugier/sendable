import { Dispatch, SetStateAction } from "react";
import { Subscription } from "./subscription";
import { ContactProvider } from "./contactProvider";

export interface User {
    id: string,
    email: string,
    isEmailConfirmed: boolean,
    is2faEnabled: boolean,
    jwt: string,
    authProvider?: string,
    subscriptions: Subscription[],
    contactProviders: ContactProvider[],
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
    refreshUserData: () => Promise<void>
}

export interface UserValidationCounts {
    appValidationsCount: number,
    apiValidationsCount: number
}