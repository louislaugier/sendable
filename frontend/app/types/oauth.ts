export interface AuthCodeEvent {
    type: string,
    code?: string,
    state?: string
}