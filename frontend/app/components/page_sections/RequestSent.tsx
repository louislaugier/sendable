import { Button, Chip } from "@nextui-org/react";
import { useContext } from "react";
import CheckIcon from "~/components/icons/CheckIcon";
import UserContext from "~/contexts/UserContext";
import { SubscriptionType } from "~/types/subscription";
import { getRemainingAppValidations } from "~/utils/limit";

export default function RequestSent(props: any) {
    const { reset } = props
    const { user } = useContext(UserContext)

    const remainingAppValidations = getRemainingAppValidations(user!)
    return (
        <>
            <div className="flex flex-col items-center">
                <Chip
                    startContent={<CheckIcon size={18} />}
                    variant="faded"
                    color="success"
                    className="mt-6 mb-4"
                >
                    Import successful
                </Chip>
                <p className="mb-12">Your validation report will be sent to <b>{user?.email}</b> once every email address has been checked. Your can track this batch's progress in your validation history. {user?.currentPlan.type !== SubscriptionType.Enterprise && <> A maximum of <b>{remainingAppValidations}</b> email address{remainingAppValidations > 1 && 'es'} will be validated (your remaining quota), the next ones will be dropped.</>}</p>

                <div className="w-full flex justify-center">
                    <Button onClick={reset} color="primary" variant="shadow">
                        New validation batch
                    </Button>
                </div>
            </div>
        </>
    )
}