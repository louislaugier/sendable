export interface Order {
    type: OrderType
}

enum OrderType {
    Free = "free",
    Premium = "premium",
    Enterprise = "enterprise",
}
