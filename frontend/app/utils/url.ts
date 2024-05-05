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
    if (exact) return currentLocation.pathname === url;
    else return currentLocation.pathname.endsWith(url);
}
