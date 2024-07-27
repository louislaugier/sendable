import { Card, Button, Divider, Tooltip, Chip } from "@nextui-org/react";
import { useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import { CheckIconRound } from "~/components/icons/CheckIconRound";
import { AuthModalType } from "~/types/modal";
import { FiHelpCircle } from "react-icons/fi";
import UserContext from "~/contexts/UserContext";
import { capitalize } from "~/utils/string";
import { SubscriptionType } from "~/types/subscription";

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
                <div className="py-4">
                    {isYearly && <p className="text-md text-gray-500" style={{ textDecoration: 'line-through' }}>
                        ${parseInt(plan.monthlyPrice.replace('$', '')) * 12} /yr
                    </p>}

                    <div>
                        <p className="text-2xl inline-block">{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</p>
                        <p className="text-accents8 inline-block ml-1">{isYearly ? '/yr' : '/mo'}</p>
                        {isYearly && <p className="text-accents8 inline-block ml-1">(~${Math.ceil(plan.yearlyPrice.replace('$', '') / 12)} /mo)</p>}
                    </div>

                    {user ?
                        isFree && user.currentPlan.type === SubscriptionType.Free ||
                            isPremium && user.currentPlan.type === SubscriptionType.Premium ||
                            isEnterprise && user.currentPlan.type === SubscriptionType.Enterprise
                            ? <>
                                <Chip className="mt-7 mb-12" color={isFree ? "warning" : isPremium ? "secondary" : "success"}>Your current plan</Chip>
                            </>
                            :
                            plan.name !== SubscriptionType.Free && user.currentPlan.type !== SubscriptionType.Enterprise && !(user.currentPlan.type === SubscriptionType.Premium && isPremium) ?
                                <Button className="mt-7 mb-12" onClick={() => {
                                }} color="primary" variant="shadow">
                                    Upgrade
                                </Button>
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
            </Card >
        </>
    )
}