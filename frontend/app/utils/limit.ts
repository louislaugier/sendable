import { limits } from "~/constants/limits";
import { SubscriptionType } from "~/types/subscription";
import { User } from "~/types/user";

export function getAppValidationLimit(user: User): number {
    return user?.currentPlan?.type === SubscriptionType.Premium ? limits.premium.app : limits.free.app
}

export function getApiValidationLimit(user: User): number {
    return user?.currentPlan?.type === SubscriptionType.Premium ? limits.premium.api : limits.free.api
}

export function getRemainingAppValidations(user: User): number {
    return getAppValidationLimit(user) - user?.validationCounts?.appValidationsCount!
}

export function getRemainingApiValidations(user: User): number {
    return getApiValidationLimit(user) - user?.validationCounts?.apiValidationsCount!
}