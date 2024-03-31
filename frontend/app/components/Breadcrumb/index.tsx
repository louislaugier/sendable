import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useLocation } from "@remix-run/react";

export default function Breadcrumb(props: any) {
    const { pathname } = useLocation()

    return (
        <>
            {pathname !== '/' &&
                <Breadcrumbs>
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Music</BreadcrumbItem>
                    <BreadcrumbItem>Artist</BreadcrumbItem>
                    <BreadcrumbItem>Album</BreadcrumbItem>
                    <BreadcrumbItem>Song</BreadcrumbItem>
                </Breadcrumbs>
            }

        </>
    );
}
