import { Chip } from "@nextui-org/react";
import { useContext } from "react";
import UserContext from "~/contexts/UserContext";
import { SubscriptionType } from "~/types/subscription";
import { capitalize } from "~/utils/string";

export default function CurrentPlanChip() {
    const { user } = useContext(UserContext);
    
    return (
        <>
            {
                user?.currentPlan?.type === SubscriptionType.Free ? <Chip color="warning">{capitalize(SubscriptionType.Free)}</Chip> :
                    user?.currentPlan?.type === SubscriptionType.Premium ? <Chip color="secondary">{capitalize(SubscriptionType.Premium)}</Chip> :
                        user?.currentPlan?.type === SubscriptionType.Enterprise ? <Chip color="success">{capitalize(SubscriptionType.Enterprise)}</Chip> :
                            <></>
            }
        </>
    )
}