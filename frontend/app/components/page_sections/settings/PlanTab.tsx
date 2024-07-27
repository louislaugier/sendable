import { Card, CardHeader, CardBody, Divider, Button, Link } from "@nextui-org/react";
import { useCallback, useContext, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import CurrentPlanChip from "~/components/chips/CurrentPlanChip";
import SubscriptionHistoryTable from "~/components/tables/SubscriptionHistoryTable";
import UserContext from "~/contexts/UserContext";
import getSubscriptionHistory from "~/services/api/subscription_history";
import { Subscription, SubscriptionType } from "~/types/subscription";
import { getAppValidationLimit, getApiValidationLimit, getRemainingAppValidations, getRemainingApiValidations } from "~/utils/limit";
import { navigateToUrl } from "~/utils/url";

export default function PlanTab() {
    const { user } = useContext(UserContext)

    const appValidationLimit = getAppValidationLimit(user!)
    const apiValidationLimit = getApiValidationLimit(user!)
    const remainingAppValidations = getRemainingAppValidations(user!)
    const remainingApiValidations = getRemainingApiValidations(user!)
    const isPremiumOrEnterprise = user?.currentPlan.type === SubscriptionType.Premium || user?.currentPlan.type === SubscriptionType.Enterprise

    const goToPricing = async (e: any) => {
        e.preventDefault()
        navigateToUrl(`/pricing`)
    }

    const goToReferral = async (e: any) => {
        e.preventDefault()
        navigateToUrl(`/referral`)
    }

    const [subscriptions, setSubscriptions] = useState<Array<Subscription>>([])
    const [subscriptionsCount, setSubscriptionsCount] = useState<number>(0);

    const loadSubscriptionHistory = useCallback(async (limit: number | undefined = undefined, offset: number | undefined = undefined) => {
        try {
            const res = await getSubscriptionHistory(limit, offset)
            if (res?.subscriptions?.length && res.count) {
                setSubscriptions(prevSubscriptions => [...prevSubscriptions, ...res.subscriptions.filter((newItem: Subscription) => !prevSubscriptions.some(prevItem => prevItem?.id === newItem.id))]);
                setSubscriptionsCount(res.count)
            }
        } catch (err) {
            console.error(err)
        }
    }, [subscriptionsCount, subscriptions]);

    return (
        <>
            <div className="flex flew-wrap pt-4 w-full">
                <Card className="w-full p-4">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md">Plan settings</p>
                        </div>
                    </CardHeader>
                    <CardBody className="flex flex-col items-center">

                        <p>Current plan: <CurrentPlanChip />{(isPremiumOrEnterprise && user?.currentPlan?.billingFrequency) && <b>{` (billed ${user?.currentPlan?.billingFrequency})`}</b>}</p>

                        {/* TODO: show only if any */}
                        <Button className="mt-4" as={Link} href={`/referral`} onClick={goToReferral} color='primary' variant="bordered">
                            View my referral discounts
                        </Button>

                        {user?.currentPlan.type !== SubscriptionType.Enterprise && <>
                            <p className="mt-4">Remaining validations (this month): <b>{remainingAppValidations.toLocaleString()} / {appValidationLimit.toLocaleString()}</b> email addresses</p>
                            <p>Remaining API validations (this month): <b>{remainingApiValidations.toLocaleString()} / {apiValidationLimit.toLocaleString()}</b> email addresses</p>
                            <Button className="mt-4" as={Link} href={`/pricing`} onClick={goToPricing} color='primary' variant="shadow">
                                Upgrade
                            </Button>
                        </>}

                        {isPremiumOrEnterprise &&
                            <Button className="mt-4" as={Link} href={`/`} target="_blank" color='primary' variant="bordered">
                                Manage subscription <FiExternalLink />
                            </Button>
                        }

                        <Divider className="my-8" />

                        <p className="mb-4">Subscription history</p>

                        <SubscriptionHistoryTable subscriptions={subscriptions} totalCount={subscriptionsCount} loadHistory={loadSubscriptionHistory} />

                    </CardBody>
                </Card>
            </div >
        </>
    )
}