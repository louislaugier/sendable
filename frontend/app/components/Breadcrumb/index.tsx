import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useLocation } from "@remix-run/react";
import { pages } from "~/constants/pages";
import { blogPages } from "~/routes/blog";

export default function Breadcrumb() {
    const { pathname } = useLocation();

    const getBreadcrumbItems = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        for (let i = 0; i < paths.length; i++) {
            const currentPath = `/${paths.slice(0, i + 1).join('/')}`;
            const page = pages.find((item) => item.url === currentPath);

            if (page) {
                breadcrumbs.push(
                    <BreadcrumbItem key={i} href={page.url}>
                        {page.label}
                    </BreadcrumbItem>
                );

                // Handle sublinks within "Resources" or other sections (if applicable)
                if (page.sublinks && i !== paths.length - 1) {
                    const sublink = page.sublinks.find((sublink) => sublink.url === `/${paths[i + 1]}`);

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