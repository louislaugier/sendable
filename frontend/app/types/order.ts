export interface Order {
    type: OrderType,
    duration: OrderDuration
}

export enum OrderType {
    Free = "free",
    Premium = "premium",
    Enterprise = "enterprise",
}

export enum OrderDuration {
    Monthly = "monthly",
    Yearly = "yearly",
}
