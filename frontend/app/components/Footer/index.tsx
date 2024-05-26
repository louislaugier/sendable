import { useContext } from "react";
import { contactEmail, siteName } from "~/constants/app";
import { pages } from "~/constants/pages";
import UserContext from "~/contexts/UserContext";

export default function Footer() {
    const { user } = useContext(UserContext);

    return (
        <footer className="bg-black text-white pt-6 pb-2">
            <div className="container mx-auto flex justify-between items-start" style={{ maxWidth: 200 }}>
                <div className="text-center text-sm">
                    {pages.map((page, index) => (
                        page.requiresAuth && !user ? <></> :
                            <div key={index} className="mb-2">
                                <a href={page.url} className="block">
                                    {page.label}
                                </a>
                            </div>
                    ))}
                </div>
                <div className="text-center text-sm">
                    <div className="mb-2">
                        <a href="/privacy-policy" className="block">
                            Privacy Policy
                        </a>
                    </div>
                    <div className="mb-2">
                        <a href="/terms-of-use" className="block">
                            Terms of Use
                        </a>
                    </div>
                    <div className="mb-2">
                        <a href={`mailto:${contactEmail}`} className="block">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
            <p className="text-center text-xs mt-4">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </footer>
    );
}
