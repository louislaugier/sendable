import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User, DropdownSection } from "@nextui-org/react";
import { useLocation } from "@remix-run/react";
import { Fragment, useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import UserContext from "~/contexts/UserContext";
import { AuthModalType } from "~/types/modal";
import { isCurrentUrl, navigateToUrl } from "~/utils/url";
import SignupLogin from "../Modals/SignupLoginModal";
import { GoogleOneTap } from "./AuthButtons/GoogleAuthButton";
import { Link as RemixLink } from "@remix-run/react";
import { siteName } from "~/constants/app";
import { ChevronDownIcon } from "~/icons/ChevronDownIcon";
import { FiExternalLink } from "react-icons/fi";

export const menuItems = [
    { url: '/dashboard', label: 'Dashboard' },
    { url: "/api", label: "API" },
    { url: "/integrations", label: "Integrations" },
    { url: "/pricing", label: "Pricing" },
    {
        label: "Resources",
        sublinks: [
            { url: "/blog", label: "Blog", description: "Learn more about email validation and reputation." },
            { url: "/referral", label: "Referral", description: "Refer people and get free Premium access.", disabled: true }
        ]
    }
];

export default function Nav() {
    const { authModal, modalType, setModalType } = useContext(AuthModalContext);
    const location = useLocation();
    const { user, setUser } = useContext(UserContext);

    const handleSublinkClick = (url: string) => {
        navigateToUrl(url);
    };

    return (
        <>
            {!user && <GoogleOneTap />}

            <Navbar isBordered style={{ borderColor: '#E4E4E7' }}>
                <NavbarBrand>
                    <RemixLink prefetch="intent" to={"/"}>
                        {siteName.toUpperCase()}
                    </RemixLink>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {menuItems.map((menuItem, index) => (
                        menuItem.label === 'Dashboard' && !user ? <></> :
                            <Fragment key={index}>
                                {menuItem.sublinks ? (
                                    <Dropdown>
                                        <NavbarItem>
                                            <DropdownTrigger>
                                                <Button
                                                    disableRipple
                                                    className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base" // Added text-base class
                                                    endContent={<ChevronDownIcon fill="currentColor" size={16} />}
                                                    radius="sm"
                                                    variant="light"
                                                >
                                                    {menuItem.label}
                                                </Button>
                                            </DropdownTrigger>
                                        </NavbarItem>
                                        <DropdownMenu
                                            aria-label={menuItem.label}
                                            className="w-[340px]"
                                            itemClasses={{
                                                base: "gap-4",
                                            }}
                                        >
                                            {menuItem.sublinks.map((sublink, subIndex) => (
                                                <DropdownItem
                                                    key={subIndex}
                                                    description={sublink.description}
                                                    onClick={() => handleSublinkClick(sublink.url)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {sublink.label}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                ) : (
                                    <NavbarItem
                                        isActive={isCurrentUrl(location, menuItem.url)}
                                        aria-current={isCurrentUrl(location, menuItem.url) && "page"}
                                    >
                                        <RemixLink prefetch="intent" to={menuItem.url}>
                                            <p className={isCurrentUrl(location, menuItem.url) ? "text-primary" : undefined}>
                                                {menuItem.label}
                                            </p>
                                        </RemixLink>
                                    </NavbarItem>
                                )}
                            </Fragment>
                    ))}
                </NavbarContent>

                <NavbarContent justify="end">
                    {user ? <>
                        <Dropdown placement="bottom-start" backdrop="blur">
                            <DropdownTrigger>
                                <User
                                    as="button"
                                    className="transition-transform"
                                    description="Free user"
                                    name={user.email}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownSection title="App" showDivider>
                                    <DropdownItem
                                        key="dashboard"
                                        description="Validate email addresses"
                                    // startContent={<AddNoteIcon className={iconClasses} />}
                                    >
                                        Dashboard
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection title="Account">
                                    <DropdownItem
                                        key="settings"
                                        description="Account preferences"
                                    >
                                        Settings
                                    </DropdownItem>
                                    <DropdownItem
                                        key="subscription"
                                        description="Go to Stripe customer dashboard"
                                    // href or onClick: stripe target blank 
                                    >
                                        <div className="flex">Manage subscription <FiExternalLink style={{ marginLeft: 5 }} /></div>
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => setUser(null)}
                                        key="logout"
                                        className="text-danger"
                                        color="danger"
                                        description="Disconnect account"
                                    >
                                        Log out
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </> : <>
                        <NavbarItem className="hidden lg:flex">
                            <p style={{ cursor: 'pointer' }} onClick={() => {
                                setModalType(AuthModalType.Login)
                                authModal.onOpen()
                            }}>
                                Login
                            </p>
                        </NavbarItem>

                        <NavbarItem>
                            <Button onClick={() => {
                                setModalType(AuthModalType.Signup)
                                authModal.onOpen()
                            }} color="primary" variant="shadow">
                                Sign Up Free
                            </Button>
                        </NavbarItem>
                    </>}
                </NavbarContent>
            </Navbar>

            <SignupLogin modalType={modalType} isOpen={authModal.isOpen} onClose={authModal.onClose} onOpen={authModal.onOpen} onOpenChange={authModal.onOpenChange} />
        </>
    );
}


