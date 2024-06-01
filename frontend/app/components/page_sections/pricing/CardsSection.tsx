import PricingCard from "~/components/cards/PricingCard";
import { pricingPlans } from "~/constants/pricing";

export default function CardsSection(props: any) {
    const { isYearly } = props

    return (
        <>
            {pricingPlans.map((plan, index) => (
                <PricingCard key={index} isYearly={isYearly} plan={plan} index={index} />
            ))}
        </>
    )
}