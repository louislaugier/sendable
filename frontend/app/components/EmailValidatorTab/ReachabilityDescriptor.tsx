import { Reachability } from "~/types/email";
import ReachabilityChip from "../ReachabilityChip";

export function ReachableDescriptor(props: any) {
    const { nochip } = props;
    const description = "We guarantee a hard bounce rate lower than 3% when sending an email to this address. In some cases, your emails might bounce even though the recipient address exists, for instance if your email server is flagged as a potential spam server or if your domain name has a bad or nascent reputation.";

    return (
        <>
            {!nochip ? (
                <p>
                    <ReachabilityChip reachability={Reachability.Reachable} />: {description}
                </p>
            ) : (
                <p>{description}</p>
            )}
        </>
    );
}

export function RiskyDescriptor(props: any) {
    const { nochip } = props;
    const description = `The email address appears to exist, but has quality issues that may result in low engagement or a bounce. We don't recommend sending to these addresses, and don't commit on an accuracy rate.\n
    An email address' reachability is considered risky when at least one of the following is true:\n
    • it is a disposable email address (DEA),\n
    • it is a role account (e.g. support@ or admin@),\n
    • it is a catch-all address,\n
    • its inbox is full.`

    return (
        <>
            {!nochip ? (
                <p>
                    <ReachabilityChip reachability={Reachability.Risky} />: {description}
                </p>
            ) : (
                <p>{description}</p>
            )}
        </>
    );
}

export function UnknownDescriptor(props: any) {
    const { nochip } = props;
    const description = `There is no way to confidently say if the address is reachable or not. It might happen on rare occasions that the email provider doesn't allow real-time verification of email accounts. In most cases, this error happens on timeout, when port 25 prevents incoming connections. On other occasions, it might also happen that the email provider's DNS doesn't expose MX records (SMTP server domain names and/or IP addresses). In this case, there's unfortunately nothing we can do. We're working on finding ways to bypass these issues out of the box, which in most occasions are solved on a case-by-case basis.`;

    return (
        <>
            {!nochip ? (
                <p>
                    <ReachabilityChip email="hello@example.com" reachability={Reachability.Unknown} />: {description}
                </p>
            ) : (
                <p>{description}</p>
            )}
        </>
    );
}

export function InvalidDescriptor(props: any) {
    const { nochip } = props;
    const description = "We guarantee with a confidence of 99% that this email address is not deliverable.";

    return (
        <>
            {!nochip ? (
                <p>
                    <ReachabilityChip reachability={Reachability.Invalid} />: {description}
                </p>
            ) : (
                <p>{description}</p>
            )}
        </>
    );
}
