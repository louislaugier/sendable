import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, DropdownSection, User } from "@nextui-org/react";
import { useLocation } from "@remix-run/react";
import { Fragment, useContext } from "react";
import AuthModalContext from "~/contexts/AuthModalContext";
import UserContext from "~/contexts/UserContext";
import { AuthModalType } from "~/types/modal";
import { isCurrentUrl } from "~/utils/url";
import SignupLogin from "../Modals/SignupLoginModal";
import { GoogleOneTap } from "./AuthButtons/GoogleAuthButton";
import { Link as RemixLink } from "@remix-run/react";
import { siteName } from "~/constants/app";
import { ChevronDownIcon } from "~/icons/ChevronDownIcon";
import { FiExternalLink } from "react-icons/fi";
import { pages } from "~/constants/pages";
import { OrderType } from "~/types/order";

export default function Nav() {
    const { authModal, modalType, setModalType } = useContext(AuthModalContext);
    const location = useLocation();
    const { user, setUser } = useContext(UserContext);

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
                    {pages.map((page, index) => (
                        page.requiresAuth && !user || page.isInvisibleInNav ? <></> :
                            <Fragment key={index}>
                                {page.sublinks ? (
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
                                                    {page.label}
                                                </Button>
                                            </DropdownTrigger>
                                        </NavbarItem>
                                        <DropdownMenu
                                            aria-label={page.label}
                                            className="w-[340px]"
                                            itemClasses={{
                                                base: "gap-4",
                                            }}
                                        >
                                            {page.sublinks.map((sublink, subIndex) => (
                                                <DropdownItem
                                                    key={subIndex}
                                                    description={sublink.description}
                                                    href={sublink.url}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {sublink.label}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                ) : (
                                    <NavbarItem
                                        isActive={isCurrentUrl(location, page.url)}
                                        aria-current={isCurrentUrl(location, page.url) && "page"}
                                    >
                                        <RemixLink prefetch="intent" to={page.url}>
                                            <p className={isCurrentUrl(location, page.url) ? "text-primary" : undefined}>
                                                {page.label}
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
                                    description={`${user.currentPlan.type.charAt(0).toUpperCase() + user.currentPlan.type.slice(1)} user`}
                                    name={user.email}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownSection title="Dashboard" showDivider>
                                    <DropdownItem
                                        key="dashboard"
                                        description="Start a new validation batch"
                                        href="/dashboard"
                                    // startContent={<AddNoteIcon className={iconClasses} />}
                                    >
                                        Validate email addresses
                                    </DropdownItem>
                                    <DropdownItem
                                        key="validaion_history"
                                        description="Email address validation history"
                                        href="/validaion_history"
                                    // startContent={<AddNoteIcon className={iconClasses} />}
                                    >
                                        History
                                    </DropdownItem>
                                </DropdownSection>
                                {/* @ts-ignore */}
                                <DropdownSection title="Account">
                                    <DropdownItem
                                        key="settings"
                                        href="/settings"
                                        description="Account preferences"
                                    >
                                        Settings
                                    </DropdownItem>
                                    {(user.currentPlan?.type === OrderType.Premium || user.currentPlan?.type === OrderType.Enterprise) &&
                                        <DropdownItem
                                            key="subscription"
                                            description="Go to Stripe customer dashboard"
                                        // href or onClick: stripe target blank 
                                        >
                                            <div className="flex">Manage subscription <FiExternalLink style={{ marginLeft: 5 }} /></div>
                                        </DropdownItem>
                                    }
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


