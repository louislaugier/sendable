export interface Subscription {
    type: SubscriptionType,
    billingFrequency: SubscriptionBillingFrequency
}

export enum SubscriptionType {
    Free = "free",
    Premium = "premium",
    Enterprise = "enterprise",
}

export enum SubscriptionBillingFrequency {
    Monthly = "monthly",
    Yearly = "yearly",
}
