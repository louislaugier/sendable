interface AuthCodeEvent {
    type: string;
    code?: string;
    state?: string;
}

export interface SalesforceAuthCodeEvent extends AuthCodeEvent { };
export interface HubspotAuthCodeEvent extends AuthCodeEvent { };

