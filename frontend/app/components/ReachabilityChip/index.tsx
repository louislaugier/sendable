import { Chip } from "@nextui-org/react";
import { CheckIconRound } from "~/icons/CheckIconRound";
import { extractDomain } from "~/services/utils/email";
import { Reachability } from "~/types/email";

export default function ReachabilityChip(props: any) {
    const { reachability, email } = props;

    let reachabilityChip;
    if (reachability === Reachability.Reachable)
        reachabilityChip = <Chip
            startContent={<CheckIconRound size={18} />}
            variant="faded"
            color="success"
        >
            deliverable
        </Chip>;
    else if (reachability === Reachability.Risky)
        reachabilityChip = <Chip color="warning" variant="dot">{reachability}</Chip>;
    else if (reachability === Reachability.Unknown)
        reachabilityChip = <Chip color="warning" variant="dot">{reachability} (protected domain <b>{extractDomain(email!)}</b>)</Chip>;
    else if (reachability === Reachability.Invalid)
        reachabilityChip = <Chip color="danger">{reachability}</Chip>;

    return (
        <>
            {reachabilityChip}
        </>
    )
} 