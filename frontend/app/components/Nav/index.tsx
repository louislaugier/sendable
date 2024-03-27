import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, useDisclosure } from "@nextui-org/react";
import SignupLogin from "./SignupLogin";

export default function Nav() {
    const modal = useDisclosure();

    return (
        <>
            <Navbar>
                <NavbarBrand>
                    <a href="/" className="font-bold text-inherit">LOGO</a>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link color="foreground" href="#" aria-current="page">
                            About
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#" aria-current="page">
                            Services
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link href="#">
                            Enterprise API
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Pricing
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Resources
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem className="hidden lg:flex">
                        <Link onClick={modal.onOpen}>Login</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Button as={Link} color="primary" variant="ghost" href="#">
                            Sign Up <b>Free</b>
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <SignupLogin isOpen={modal.isOpen} onOpen={modal.onOpen} onOpenChange={modal.onOpenChange} />
        </>
    );
}
