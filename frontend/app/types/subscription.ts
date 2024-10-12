export interface Subscription {
    id: string,
    type: SubscriptionType,
    billingFrequency: SubscriptionBillingFrequency
    createdAt: string,
    cancelledAt: string
    startingAt: string
    latestRenewedAt: string
}

export enum SubscriptionType {
    Free = "free",
    Premium = "premium",
    Enterprise = "enterprise"
}

export enum SubscriptionBillingFrequency {
    Monthly = "monthly",
    Yearly = "yearly"
}
