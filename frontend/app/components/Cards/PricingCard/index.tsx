import { Card, Button, Divider } from "@nextui-org/react";
import { useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import { CheckIcon } from "~/icons/CheckIcon";
import { AuthModalType } from "~/types/modal";

export default function PricingCard(props: any) {
    const { authModal, setModalType } = useContext(AuthModalContext);

    const { isYearly, plan, index } = props

    return (
        <>
            <Card key={index} className="max-w-md p-6">
                <div>
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <p className="text-accents8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        condimentum, nisl ut aliquam lacinia, elit
                    </p>
                </div>
                <div className="py-4">
                    {isYearly && <p className="text-md text-gray-500" style={{ textDecoration: 'line-through' }}>
                        ${parseInt(plan.monthly_price.replace('$', '')) * 12} /yr
                    </p>}
                    <div>
                        <p className="text-2xl inline-block">{isYearly ? plan.yearly_price : plan.monthly_price}</p>
                        <p className="text-accents8 inline-block ml-1">{isYearly ? '/yr' : '/mo'}</p>
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
                                <CheckIcon />
                                <p className="text-accents8 inline-block">{feature}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </>
    )
}