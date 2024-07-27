import { Chip } from "@nextui-org/react";
import { useContext } from "react";
import UserContext from "~/contexts/UserContext";
import { SubscriptionType } from "~/types/subscription";

export default function CurrentPlanChip() {
    const { user } = useContext(UserContext);
    
    return (
        <>
            {
                user?.currentPlan.type === SubscriptionType.Free ? <Chip color="warning">Free</Chip> :
                    user?.currentPlan.type === SubscriptionType.Premium ? <Chip color="secondary">Premium</Chip> :
                        user?.currentPlan.type === SubscriptionType.Enterprise ? <Chip color="success">Enterprise</Chip> :
                            <></>
            }
        </>
    )
}