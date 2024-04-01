import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, useDisclosure } from "@nextui-org/react";
import SignupLogin from "../SignupLogin";
import { isCurrentUrl } from "~/utils/url";
import { useLocation } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";
import { useContext, useState } from "react";
import { AuthModalType } from "~/types/modal";
import { GoogleOneTap } from "../Auth/Google";
import UserContext from "~/contexts/UserContext";
import AuthModalContext from "~/contexts/AuthModalContext";

const menuItems = [
    { url: "/enterprise-api", label: "API" },
    { url: "/pricing", label: "Pricing" },
    { url: "/resources", label: "Resources" }
];

export default function Nav() {
    const { authModal, modalType, setModalType } = useContext(AuthModalContext);

    const location = useLocation()

    const { user, setUser } = useContext(UserContext)

    return (
        <>
            {!user && <GoogleOneTap />}

            <Navbar isBordered style={{ borderColor: '#E4E4E7' }}>
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
                        <Link style={{ cursor: 'pointer' }} onClick={() => {
                            setModalType(AuthModalType.Login)
                            authModal.onOpen()
                        }}>
                            Login
                        </Link>
                    </NavbarItem>

                    <NavbarItem>
                        <Button onClick={() => {
                            setModalType(AuthModalType.Signup)
                            authModal.onOpen()
                        }} color="primary" variant="shadow">
                            Sign Up Free
                        </Button>
                    </NavbarItem>

                </NavbarContent>

            </Navbar>

            <SignupLogin modalType={modalType} isOpen={authModal.isOpen} onClose={authModal.onClose} onOpen={authModal.onOpen} onOpenChange={authModal.onOpenChange} />
        </>
    );
}
