import { Subscription, SubscriptionBillingFrequency, SubscriptionType } from "~/types/subscription";
import { Card, CardHeader, CardBody, Divider, Button, Link } from "@nextui-org/react";
import { useCallback, useContext, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import CurrentPlanChip from "~/components/chips/CurrentPlanChip";
import SubscriptionHistoryTable from "~/components/tables/SubscriptionHistoryTable";
import UserContext from "~/contexts/UserContext";
import getSubscriptionHistory from "~/services/api/subscription_history";
import { getAppValidationLimit, getApiValidationLimit, getRemainingAppValidations, getRemainingApiValidations } from "~/utils/limit";
import { navigateToUrl } from "~/utils/url";
import { pricingPlans } from "~/constants/pricing";

export default function PlanTab() {
    const { user } = useContext(UserContext);

    const appValidationLimit = getAppValidationLimit(user!);
    const apiValidationLimit = getApiValidationLimit(user!);
    const remainingAppValidations = getRemainingAppValidations(user!);
    const remainingApiValidations = getRemainingApiValidations(user!);

    const isPremium = user?.currentPlan?.type === SubscriptionType.Premium;
    const isEnterprise = user?.currentPlan?.type === SubscriptionType.Enterprise;
    const isPremiumOrEnterprise = isPremium || isEnterprise;

    // Determine the price based on the current plan and billing frequency
    let currentPlanPrice = '';
    const currentPlan = pricingPlans.find(plan => plan.name === user?.currentPlan?.type);

    if (user?.currentPlan.billingFrequency === SubscriptionBillingFrequency.Monthly) {
        currentPlanPrice = `$${currentPlan?.monthlyPrice.toLocaleString()} /mo`;
    } else if (user?.currentPlan.billingFrequency === SubscriptionBillingFrequency.Yearly) {
        currentPlanPrice = `$${currentPlan?.yearlyPrice.toLocaleString()} /yr`;
    }

    const goToPricing = async (e: any) => {
        e.preventDefault();
        navigateToUrl(`/pricing`);
    };

    const goToReferral = async (e: any) => {
        e.preventDefault();
        navigateToUrl(`/referral`);
    };

    const [subscriptions, setSubscriptions] = useState<Array<Subscription>>([]);
    const [subscriptionsCount, setSubscriptionsCount] = useState<number>(0);

    const loadSubscriptionHistory = useCallback(async (limit: number | undefined = undefined, offset: number | undefined = undefined) => {
        try {
            const res = await getSubscriptionHistory(limit, offset);
            if (res?.subscriptions?.length && res.count) {
                setSubscriptions(prevSubscriptions => [...prevSubscriptions, ...res.subscriptions.filter((newItem: Subscription) => !prevSubscriptions.some(prevItem => prevItem?.id === newItem.id))]);
                setSubscriptionsCount(res.count);
            }
        } catch (err) {
            console.error(err);
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
                        <b className="mt-4">{currentPlanPrice}</b>

                        {user?.currentPlan?.type !== SubscriptionType.Enterprise && <>
                            <p className="mt-4">Remaining validations (this month): <b>{remainingAppValidations.toLocaleString()} / {appValidationLimit.toLocaleString()}</b> email addresses</p>
                            <p>Remaining API validations (this month): <b>{remainingApiValidations.toLocaleString()} / {apiValidationLimit.toLocaleString()}</b> email addresses</p>
                            <Button className="mt-4" as={Link} href={`/pricing`} onClick={goToPricing} color='primary' variant="shadow">
                                Upgrade
                            </Button>
                        </>}

                        {isPremiumOrEnterprise &&
                            <Button className="mt-4" as={Link} href={user?.stripeCustomerPortalUrl} target="_blank" color='primary' variant="bordered">
                                Manage subscription <FiExternalLink />
                            </Button>
                        }

                        <Divider className="my-8" />

                        <p className="mb-4">Subscription history</p>

                        <SubscriptionHistoryTable subscriptions={subscriptions} totalCount={subscriptionsCount} loadHistory={loadSubscriptionHistory} />

                    </CardBody>
                </Card>
            </div>
        </>
    );
}
