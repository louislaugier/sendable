import { Card, Button, Divider, Tooltip } from "@nextui-org/react";
import { useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import { CheckIconRound } from "~/icons/CheckIconRound";
import { AuthModalType } from "~/types/modal";
import { FiHelpCircle } from "react-icons/fi";

export default function PricingCard(props: any) {
    const { authModal, setModalType } = useContext(AuthModalContext);

    const { isYearly, plan, index } = props

    return (
        <>
            <Card key={index} className="max-w-md p-6 pb-0" style={{ width: 320 }}>
                <div>
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <p className="text-accents8">
                        {plan.description}
                    </p>
                </div>
                <div className="py-4">
                    {isYearly && <p className="text-md text-gray-500" style={{ textDecoration: 'line-through' }}>
                        ${parseInt(plan.monthly_price.replace('$', '')) * 12} /yr
                    </p>}
                    <div>
                        <p className="text-2xl inline-block">{isYearly ? plan.yearly_price : plan.monthly_price}</p>
                        <p className="text-accents8 inline-block ml-1">{isYearly ? '/yr' : '/mo'}</p>
                        {isYearly && <p className="text-accents8 inline-block ml-1">(~${Math.ceil(plan.yearly_price.replace('$', '') / 12)} /mo)</p>}
                    </div>
                    <Button className="mt-7 mb-12" onClick={() => {
                        setModalType(AuthModalType.Signup);
                        authModal.onOpen();
                    }} color="primary" variant="shadow">
                        Get Started Free
                    </Button>
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
            </Card>
        </>
    )
}