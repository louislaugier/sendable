export interface Order {
    type: OrderType
}

export enum OrderType {
    Free = "free",
    Premium = "premium",
    Enterprise = "enterprise",
}
