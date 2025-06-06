import { Card, Button, Divider, Tooltip, Chip, Link } from "@nextui-org/react";
import { useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import { CheckIconRound } from "~/components/icons/CheckIconRound";
import { AuthModalType } from "~/types/modal";
import { FiHelpCircle } from "react-icons/fi";
import UserContext from "~/contexts/UserContext";
import { capitalize } from "~/utils/string";
import { SubscriptionType } from "~/types/subscription";
import UpgradeOrDowngradeButton from "../buttons/UpgradeOrDowngradeButton";
import { limits } from "~/constants/limits";

export default function PricingCard(props: any) {
    const { authModal, setModalType } = useContext(AuthModalContext);

    const { isYearly, plan, index } = props

    const { user } = useContext(UserContext)

    const isFree = plan.name === SubscriptionType.Free
    const isPremium = plan.name === SubscriptionType.Premium
    const isEnterprise = plan.name === SubscriptionType.Enterprise

    return (
        <>
            <Card key={index} className="max-w-md p-6 pb-0" style={{ width: 320 }}>
                <div>
                    <h4 className="text-lg font-bold">{capitalize(plan.name)}</h4>
                    <p className="text-accents8">
                        {plan.description}
                    </p>
                </div>
                <div className="pt-2 pb-4">
                    {isYearly && <p className="text-md text-gray-500" style={{ textDecoration: 'line-through' }}>
                        ${(plan.monthlyPrice * 12).toLocaleString()} /yr
                    </p>}

                    <div>
                        <p className="text-2xl inline-block">{isYearly ? `$${plan.yearlyPrice.toLocaleString()}` : `$${plan.monthlyPrice.toLocaleString()}`}</p>
                        <p className="text-accents8 inline-block ml-1">{isYearly ? '/yr' : '/mo'}</p>
                        {isYearly && <p className="text-accents8 inline-block ml-1">(~${Math.round(plan.yearlyPrice / 12).toLocaleString()} /mo)</p>}
                    </div>

                    {isPremium && <p className="absolute text-sm mb-2">About <b>${Math.round((isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice) / (limits.premium.app + limits.premium.api) * 10000) / 10000}</b> per checked email address.</p>}

                    <div className="mt-2">
                        {user ?
                            isFree && user?.currentPlan?.type === SubscriptionType.Free ||
                                isPremium && user?.currentPlan?.type === SubscriptionType.Premium ||
                                isEnterprise && user?.currentPlan?.type === SubscriptionType.Enterprise
                                ? <div className="flex flex-col">
                                    <Chip className="mt-4" color={isFree ? "warning" : isPremium ? "secondary" : "success"}>Current plan</Chip>
                                    <div>
                                        <Button isDisabled={!!user?.currentPlan.cancelledAt} as={Link} href={user?.stripeCustomerPortalUrl!} target="_blank" className="mt-2 mb-6 w-auto" onClick={() => {
                                        }} color="primary" variant="shadow">
                                            {!!user?.currentPlan.cancelledAt ? 'Cancellation scheduled' : 'Manage'}
                                        </Button>
                                    </div>
                                </div>
                                :
                                plan.name !== SubscriptionType.Free && user?.currentPlan?.type !== SubscriptionType.Enterprise && !(user?.currentPlan?.type === SubscriptionType.Premium && isPremium) ?
                                    <>
                                        <UpgradeOrDowngradeButton priceId={isYearly ? plan?.stripeYearlyPriceId : plan?.stripeMonthlyPriceId} />
                                    </>
                                    :
                                    plan.name !== SubscriptionType.Free ?
                                        <UpgradeOrDowngradeButton isDisabled={!!user?.upcomingPlan?.delayedStartAt} priceId={isYearly ? plan?.stripeYearlyPriceId : plan?.stripeMonthlyPriceId} value={!!user?.upcomingPlan?.delayedStartAt ? 'Starting next billing period' : `Downgrade to ${capitalize(user?.upcomingPlan?.type)}`} />
                                        :
                                        <div style={{ margin: '125px 0' }} />
                            :
                            <Button className="mt-7 mb-12" onClick={() => {
                                setModalType(AuthModalType.Signup);
                                authModal.onOpen();
                            }} color="primary" variant="shadow">
                                Get Started Free
                            </Button>
                        }
                        <Divider />

                        <ul className="list-none">
                            {plan.features.map((feature: any, index: number) => (
                                <li key={index} className="flex py-2 gap-2 items-center">
                                    <CheckIconRound />
                                    <div className="relative">
                                        <p className="text-accents8 inline-block">{feature.content}</p>
                                        {feature.tooltip && <div className="absolute top-0" style={{ right: '-20px' }}>
                                            <Tooltip showArrow={true} content={feature.tooltip}>
                                                <div>
                                                    <FiHelpCircle />
                                                </div>
                                            </Tooltip>
                                        </div>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card >
        </>
    )
}