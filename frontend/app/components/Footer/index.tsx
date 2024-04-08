import { menuItems } from "../Nav";

export default function Footer() {

    return (
        <footer className="bg-black text-white pt-4 pb-3">
            <div className="container mx-auto flex justify-between items-start" style={{ maxWidth: 200 }}>
                <div className="text-center text-sm">
                    {menuItems.map((item, index) => (
                        <div key={index} className="mb-2">
                            <a href={item.url} className="block">
                                {item.label}
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
                        <a href="mailto:contact@example.com" className="block">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
            <p className="text-center text-xs mt-4">© {new Date().getFullYear()} Email validator. All rights reserved.</p>
        </footer>
    );
}
