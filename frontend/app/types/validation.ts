export interface Validation {
    id: string;
    singleTargetEmail?: string;
    bulkFirstEmailAddress?: string;
    bulkAddressCount?: number;
    uploadFilename?: string;
    reportToken?: string;
    origin: string;
    status: ValidationStatus;
    createdAt: string;
}

export enum ValidationStatus {
    Completed = "completed",
    Failed = "failed",
    Processing = "processing"
}

export enum ValidationOrigin {
    Platform = "app",
    API = "api",
}