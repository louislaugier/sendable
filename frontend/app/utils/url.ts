import { Location } from "@remix-run/react";

// Function to navigate to a given URL
export function navigateToUrl(url: string, isTargetBlank: boolean = false) {
    if (typeof window !== 'undefined') {
        if (isTargetBlank) window.open(url, '_blank');
        else window.location.href = url;
    }
}

// Function to determine if a given URL is the current URL
export function isCurrentUrl(currentLocation: Location<any>, url: string, exact = false) {
    // Handle URLs with query parameters (like dashboard?tab=validation)
    if (url.includes('?')) {
        const [pathname, queryString] = url.split('?');
        const [currentPathname, currentQueryString] = currentLocation.pathname.split('?');
        
        // For dashboard, we only care about the base path matching
        if (pathname === '/dashboard') {
            return currentPathname === pathname;
        }
        
        // For other URLs with query params, check both path and query
        return currentPathname === pathname && currentLocation.search.includes(queryString);
    }
    
    // For regular URLs without query params
    if (exact) return currentLocation.pathname === url;
    return currentLocation.pathname.endsWith(url);
}
