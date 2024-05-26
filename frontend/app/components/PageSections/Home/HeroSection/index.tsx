import { Button } from "@nextui-org/react";
import { useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";

import { AuthModalType } from "~/types/modal";
import TryItOut from "../../../Cards/TryItOutCard";
import UserContext from "~/contexts/UserContext";
import { navigateToUrl } from "~/utils/url";
import { limits } from "~/constants/limits";

export default function HeroSection() {
    const { authModal, setModalType } = useContext(AuthModalContext);
    const { user } = useContext(UserContext);
    return (
        <div style={{ height: 'calc(70vh - 65px)', minHeight: '550px' }} className="flex flex-col items-center justify-center py-16">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                    {/* TODO: content synonyms refacto */}
                    {/* TODO: "check if email exists without sending an email to it" */}
                    <h1 className="text-4xl font-bold mb-4">Accurate, fast and secure email address validation service</h1>
                    <p className="text-lg mb-8">
                        You invest for better email marketing ROI. We help you identify valid email addresses to connect with your customers and leads. Boost your inbox placement and open rates with 99% accurate real-time email validation software.
                    </p>
                    <Button onClick={() => {
                        if (user) {
                            navigateToUrl('/dashboard')
                            return
                        }
                        setModalType(AuthModalType.Signup);
                        authModal.onOpen();
                    }} color="primary" variant="shadow" className="mb-4">
                        {user ? 'Go to dashboard' : 'Try It Free'}
                    </Button>
                    <p className="text-sm">Get {limits.free.app} free monthly email verifications</p>
                </div>
                <div className="md:w-1/2 md:pl-8">
                    <TryItOut />
                </div>
            </div>
        </div>
    );
}
