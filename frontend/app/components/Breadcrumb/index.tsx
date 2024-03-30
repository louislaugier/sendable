import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

export default function Breadcrumb(props: any) {
    const { isOpen, onOpen, onOpenChange } = props;

    return (
        <>
            <Breadcrumbs>
                <BreadcrumbItem>Home</BreadcrumbItem>
                <BreadcrumbItem>Music</BreadcrumbItem>
                <BreadcrumbItem>Artist</BreadcrumbItem>
                <BreadcrumbItem>Album</BreadcrumbItem>
                <BreadcrumbItem>Song</BreadcrumbItem>
            </Breadcrumbs>
        </>
    );
}
