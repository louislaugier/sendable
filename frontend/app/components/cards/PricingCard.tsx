import { Card, Button, Divider, Tooltip, Chip } from "@nextui-org/react";
import { useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import { CheckIconRound } from "~/components/icons/CheckIconRound";
import { AuthModalType } from "~/types/modal";
import { FiHelpCircle } from "react-icons/fi";
import UserContext from "~/contexts/UserContext";
import { capitalize } from "~/utils/string";
import { SubscriptionType } from "~/types/subscription";
import UpgradeAccountButton from "../buttons/UpgradeButton";
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

                    {isPremium && <p className="absolute text-sm mt-1">About <b>${Math.round((isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice) / (limits.premium.app + limits.premium.api) * 10000) / 10000}</b> per checked email.</p>}

                    <div className="mt-2">
                        {user ?
                            isFree && user.currentPlan.type === SubscriptionType.Free ||
                                isPremium && user.currentPlan.type === SubscriptionType.Premium ||
                                isEnterprise && user.currentPlan.type === SubscriptionType.Enterprise
                                ? <>
                                    <Chip className="mt-8 mb-14" color={isFree ? "warning" : isPremium ? "secondary" : "success"}>Your current plan</Chip>
                                </>
                                :
                                plan.name !== SubscriptionType.Free && user.currentPlan.type !== SubscriptionType.Enterprise && !(user.currentPlan.type === SubscriptionType.Premium && isPremium) ?
                                    <>
                                        <UpgradeAccountButton priceId={isYearly ? plan?.stripeYearlyPriceId : plan?.stripeMonthlyPriceId} />
                                    </>
                                    :
                                    <Button className="mt-7 mb-12" onClick={() => {
                                    }} color="primary" variant="shadow">
                                        Downgrade
                                    </Button>
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