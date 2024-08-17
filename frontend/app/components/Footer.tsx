import { useContext } from "react";
import { contactEmail, siteName } from "~/constants/app";
import { pages } from "~/constants/pages";
import UserContext from "~/contexts/UserContext";

export default function Footer() {
    const { user } = useContext(UserContext);

    return (
        <footer className="bg-black text-white pt-6 pb-2">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-start" style={{ maxWidth: 1200 }}>
                {/* First Column: Main Pages */}
                <div className="w-full md:w-1/3 text-center text-sm mb-4 md:mb-0">
                    {pages.filter(page => !page.requiresAuth || (page.requiresAuth && user) || page.label === 'Resources')
                        .map((page, index) => (
                            page.label === 'Resources' ? null :
                                <div key={index} className="mb-2">
                                    <a href={page.url} className="block">
                                        {page.label}
                                    </a>
                                </div>
                        ))}
                </div>

                {/* Middle Column: Blog, FAQ, Business Inquiry */}
                <div className="w-full md:w-1/3 text-center text-sm mb-4 md:mb-0">
                    <div className="mb-2">
                        <a href="/blog" className="block">
                            Blog
                        </a>
                    </div>
                    <div className="mb-2">
                        <a href="/faq" className="block">
                            FAQ
                        </a>
                    </div>
                    <div className="mb-2">
                        <a href={`mailto:${contactEmail}`} className="block">
                            Business inquiry
                        </a>
                    </div>
                </div>

                {/* Third Column: Privacy Policy, Terms of Use */}
                <div className="w-full md:w-1/3 text-center text-sm">
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
                </div>
            </div>
            <p className="text-center text-xs mt-4">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </footer>
    );
}