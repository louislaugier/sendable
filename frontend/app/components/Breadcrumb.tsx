import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useLocation } from "@remix-run/react";
import { pages } from "~/constants/pages";
import { blogPages } from "~/routes/blog";

export default function Breadcrumb() {
    const { pathname } = useLocation();

    const getBreadcrumbItems = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        const findPage: any = (url: string, pages: Array<any>) => {
            for (const page of pages) {
                if (page.url === url) {
                    return page;
                }
                if (page.sublinks) {
                    const sublink = findPage(url, page.sublinks);
                    if (sublink  && sublink.url !== '/blog') {
                        return sublink;
                    }
                }
            }
            return null;
        };

        for (let i = 0; i < paths.length; i++) {
            const currentPath = `/${paths.slice(0, i + 1).join('/')}`;
            const page = findPage(currentPath, pages);

            if (page) {
                breadcrumbs.push(
                    <BreadcrumbItem key={i} href={page.url}>
                        {page.label}
                    </BreadcrumbItem>
                );

                // Handle sublinks within "Resources" or other sections (if applicable)
                if (page.sublinks && i !== paths.length - 1) {
                    const sublinkPath = `/${paths.slice(0, i + 2).join('/')}`;
                    const sublink = findPage(sublinkPath, page.sublinks);

                    if (sublink) {
                        breadcrumbs.push(
                            <BreadcrumbItem key={`${i}_sublink`} href={sublink.url}>
                                {sublink.label}
                            </BreadcrumbItem>
                        );
                        i++; // Skip the next iteration since we already handled the sublink
                    }
                }

                // Exit the loop after finding a matching menu item to prevent adding unnecessary breadcrumbs
                break;
            }
        }

        // Handle the blog root URL and articles specifically
        if (pathname === '/blog') {
            breadcrumbs.push(
                <BreadcrumbItem key="blog" href="/blog">
                    Blog
                </BreadcrumbItem>
            );
        } else if (pathname.startsWith('/blog/')) {
            breadcrumbs.push(
                <BreadcrumbItem key="blog" href="/blog">
                    Blog
                </BreadcrumbItem>
            );

            const articlePath = pathname.slice(6); // Remove the "/blog/" prefix
            const blogPage = blogPages.find((page) => page.uri === `/${articlePath}`);

            if (blogPage) {
                breadcrumbs.push(
                    <BreadcrumbItem key="article" href={`/blog/${articlePath}`}>
                        {blogPage.title}
                    </BreadcrumbItem>
                );
            } else {
                breadcrumbs.push(
                    <BreadcrumbItem key="article" href={`/blog/${articlePath}`}>
                        {articlePath}
                    </BreadcrumbItem>
                );
            }
        }

        return breadcrumbs;
    };

    return (
        <>
            {pathname !== '/' && (
                <Breadcrumbs className="mt-8 px-6">
                    <BreadcrumbItem href="/">Home</BreadcrumbItem>
                    {getBreadcrumbItems()}
                </Breadcrumbs>
            )}
        </>
    );
}
