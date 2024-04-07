import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useLocation } from "@remix-run/react";
import { menuItems } from "../Nav";

export default function Breadcrumb() {
    const { pathname } = useLocation();

    const getBreadcrumbItems = () => {
        const paths = pathname.split('/').filter(Boolean);
        return paths.map((path, index) => {
            const item = menuItems.find(item => item.url === `/${path}`) as MenuItem | undefined;
            if (item) {
                return (
                    <BreadcrumbItem key={index} href={item.url}>
                        {item.label}
                    </BreadcrumbItem>
                );
            }
            return null;
        });
    };

    return (
        <>
            {pathname !== '/' && (
                <Breadcrumbs>
                    <BreadcrumbItem href="/">Home</BreadcrumbItem>
                    {getBreadcrumbItems()}
                </Breadcrumbs>
            )}
        </>
    );
}
