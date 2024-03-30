import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, useDisclosure, menu } from "@nextui-org/react";
import SignupLogin from "../SignupLogin";
import { isCurrentUrl } from "~/utils/url";
import { useLocation } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";

const menuItems = [
    { url: "/about", label: "About" },
    { url: "/services", label: "Services" },
    { url: "/enterprise-api", label: "Enterprise API" },
    { url: "/pricing", label: "Pricing" },
    { url: "/resources", label: "Resources" }
];

export default function Nav() {
    const authModal = useDisclosure();

    const location = useLocation();

    return (
        <>
            <Navbar>
                <NavbarBrand>
                    {/* <Link href={menuItem.url}> */}
                    <RemixLink prefetch="intent" to={"/"}>
                        LOGO
                    </RemixLink>
                    {/* </Link> */}
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {menuItems.map((menuItem, index) => (
                        <NavbarItem
                            key={index}
                            isActive={isCurrentUrl(location, menuItem.url)}
                            aria-current={isCurrentUrl(location, menuItem.url) && "page"}
                        >
                            {/* <Link href={menuItem.url}> */}
                            <RemixLink prefetch="intent" to={menuItem.url}>
                                <p className={isCurrentUrl(location, menuItem.url) ? "text-primary" : undefined}>
                                    {menuItem.label}
                                </p>
                            </RemixLink>
                            {/* </Link> */}
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarContent justify="end">

                    <NavbarItem className="hidden lg:flex">
                        <Link style={{ cursor: 'pointer' }} onClick={authModal.onOpen}>
                            Login
                        </Link>
                    </NavbarItem>

                    <NavbarItem>
                        <Button onClick={authModal.onOpen} as={Link} color="primary" variant="shadow">
                            Sign up Free
                        </Button>
                    </NavbarItem>

                </NavbarContent>

            </Navbar>
            <SignupLogin isOpen={authModal.isOpen} onOpen={authModal.onOpen} onOpenChange={authModal.onOpenChange} />
        </>
    );
}
