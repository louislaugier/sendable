import { Chip } from "@nextui-org/react";
import { CheckIconRound } from "~/icons/CheckIconRound";
import { extractDomain } from "~/services/utils/email";
import { Reachability } from "~/types/email";

export default function ReachabilityChip(props: any) {
    const { reachability, email } = props;

    let reachabilityChip;
    if (reachability === Reachability.Reachable)
        reachabilityChip = <Chip
            // startContent={<CheckIconRound size={18} />}
            variant="dot"
            color="success"
        >
            deliverable
        </Chip>;
    else if (reachability === Reachability.Risky)
        reachabilityChip = <Chip color="warning" variant="dot">{reachability}</Chip>;
    else if (reachability === Reachability.Unknown)
        reachabilityChip = <Chip color="warning" variant="dot">{reachability} (protected domain <b>{extractDomain(email!)}</b>)</Chip>;
    else if (reachability === Reachability.Invalid)
        reachabilityChip = <Chip variant="dot" color="danger">{reachability}</Chip>;

    return (
        <>
            {reachabilityChip}
        </>
    )
} 