import { Button, Chip } from "@nextui-org/react";
import { useContext } from "react";
import CheckIcon from "~/components/icons/CheckIcon";
import UserContext from "~/contexts/UserContext";
import { OrderType } from "~/types/order";
import { getRemainingAppValidations } from "~/utils/limit";

export default function RequestSent(props: any) {
    const { reset } = props
    const { user } = useContext(UserContext)
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
                <p className="mb-12">Your validation report will be sent to <b>{user?.email}</b> once every email address has been checked. {user?.currentPlan.type !== OrderType.Enterprise && <> A maximum of <b>{getRemainingAppValidations(user!)}</b> email addresses will be validated (your remaining quota), the next ones will be dropped.</>}</p>

                <div className="w-full flex justify-center">
                    <Button onClick={reset} color="primary" variant="shadow">
                        New validation batch
                    </Button>
                </div>
            </div>
        </>
    )
}