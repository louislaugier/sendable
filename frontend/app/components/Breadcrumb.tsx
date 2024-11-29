import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useLocation } from "@remix-run/react";
import { pages } from "~/constants/pages";
import { blogPages } from "~/routes/blog";

// Define a type for pages with a parent
type PageWithParent = {
    url: string;
    label: string;
    requiresAuth?: boolean;
    isInvisibleInNav?: boolean;
    parent?: {
        url: string;
        label: string;
    };
    sublinks?: PageWithParent[];
};

export default function Breadcrumb() {
    const { pathname } = useLocation();

    const findPage = (pathname: string | null | undefined): PageWithParent | null => {
        if (!pathname || typeof pathname !== 'string') return null;
        
        const pathParts = pathname.split('/').filter(Boolean);
        let currentPath = '';
        
        // First check for direct matches
        for (let i = pathParts.length; i > 0; i--) {
            currentPath = '/' + pathParts.slice(0, i).join('/');
            const page = pages?.find(p => p?.url === currentPath);
            if (page) return page as PageWithParent;
        }
        
        // Then check sublinks if no direct match is found
        for (const page of pages as PageWithParent[]) {
            if (page.sublinks) {
                const sublink = page.sublinks.find(sub => sub.url === pathname);
                if (sublink) {
                    return {
                        ...sublink,
                        parent: { url: page.url, label: page.label }
                    };
                }
            }
        }
        
        return null;
    };

    const getBreadcrumbItems = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        // Special case for dashboard
        if (pathname.startsWith('/dashboard')) {
            const dashboardPage = pages.find(page => page.url?.startsWith('/dashboard'));
            if (dashboardPage && dashboardPage.url) {
                breadcrumbs.push(
                    <BreadcrumbItem key="dashboard" href={dashboardPage.url}>
                        {dashboardPage.label}
                    </BreadcrumbItem>
                );
            }
            return breadcrumbs;
        }

        // Handle blog pages
        if (pathname.startsWith('/blog')) {
            // Add Blog link
            breadcrumbs.push(
                <BreadcrumbItem key="blog" href="/blog">
                    Blog
                </BreadcrumbItem>
            );

            // If we're on a blog post page, add the post title
            if (pathname !== '/blog') {
                const blogPage = blogPages.find(page => pathname.endsWith(page.uri));
                if (blogPage) {
                    breadcrumbs.push(
                        <BreadcrumbItem key="blogpost">
                            {blogPage.title}
                        </BreadcrumbItem>
                    );
                }
            }
            return breadcrumbs;
        }

        // Handle sublinks (like FAQ)
        const page = findPage(pathname);
        if (page?.parent) {
            // Add current page without showing parent
            breadcrumbs.push(
                <BreadcrumbItem key="current" href={page.url}>
                    {page.label}
                </BreadcrumbItem>
            );
            return breadcrumbs;
        }

        // Handle regular pages
        let currentPath = '';
        for (let i = 0; i < paths.length; i++) {
            currentPath += '/' + paths[i];
            const page = findPage(currentPath);
            
            if (page) {
                breadcrumbs.push(
                    <BreadcrumbItem key={i} href={page.url}>
                        {page.label}
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
