import { Reachability } from "~/types/email";
import { Button } from "@nextui-org/react";
import ReachabilityChip from "~/components/dropdowns/ReachabilityReference/ReachabilityChip";
import { ReachableDescriptor, RiskyDescriptor, UnknownDescriptor, InvalidDescriptor } from "~/components/dropdowns/ReachabilityReference/ReachabilityDescriptor";

const SingleTargetReachability = (props: any) => {
    const { email, singleTargetResp, reset } = props

    if (!singleTargetResp) {
        return <p>No response data available.</p>;
    }

    const issues = [];
    if (!singleTargetResp?.syntax?.is_valid_syntax) issues.push('• Address syntax is invalid');
    if (!singleTargetResp?.mx?.accepts_mail && !!singleTargetResp?.syntax?.domain) issues.push(
        <span>
            • The domain <b>{singleTargetResp.syntax.domain}</b> does not accept emails
        </span>
    );
    if (singleTargetResp?.smtp?.is_disabled) issues.push('• Account has been disabled by email provider');
    if (singleTargetResp?.smtp?.has_full_inbox) issues.push("• The account's inbox is currently full");
    if (singleTargetResp?.misc?.is_role_account) issues.push("• The email address is a role account (e.g. support@sendable.email)");
    if (singleTargetResp?.misc?.is_disposable) issues.push("• The email address is a disposable temporary email address");
    if (singleTargetResp?.smtp?.is_catch_all) issues.push("• The email address is a catch-all address (destined to receive emails sent to non-existing addresses on a given domain name)");

    return (
        <>
            <p style={{ lineHeight: "30px" }} className="mt-8 mb-4"><strong>Reachability</strong> for {email}: <ReachabilityChip reachability={singleTargetResp.is_reachable} email={email} /></p>
            <div className="mb-4">
                {
                    singleTargetResp.is_reachable === Reachability.Reachable ?
                        <ReachableDescriptor nochip />
                        : singleTargetResp.is_reachable === Reachability.Risky ?
                            <RiskyDescriptor nochip />
                            : singleTargetResp.is_reachable === Reachability.Unknown ?
                                <UnknownDescriptor nochip />
                                :
                                <InvalidDescriptor noBrackets nochip />
                }
            </div>
            {
                issues.length > 0 && (
                    <div>
                        <b>Issues found:</b>
                        <p>{issues.map((issue, index) => (
                            <div key={index}>
                                {issue}
                                {index === issues.length - 1 ? '.' : ';'}
                            </div>
                        ))}</p>
                    </div>
                )
            }
            <div className="w-full flex justify-center mt-12">
                <Button onClick={reset} color="primary" variant="shadow">
                    New validation batch
                </Button>
            </div>
        </>
    );
};

export default SingleTargetReachability;
