import { ContactProviderType } from "./contactProvider";
import { Reachability } from "./email";

export interface Validation {
    id: string;
    singleTargetEmail?: string;
    singleTargetReachability?: Reachability;
    bulkFirstEmailAddress?: string;
    bulkAddressCount?: number;
    uploadFilename?: string;
    reportToken?: string;
    providerSource?: ContactProviderType;
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