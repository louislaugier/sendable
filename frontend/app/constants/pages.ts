import { Page } from "~/types/pages";

export const pages = [
    { url: '/dashboard', label: 'Dashboard', requiresAuth: true },
    { url: "/api", label: "API" },
    { url: "/integrations", label: "Integrations" },
    { url: "/pricing", label: "Pricing" },
    {
        label: "Resources",
        sublinks: [
            { url: "/blog", label: "Blog", description: "Learn more about email validation and reputation." },
            { url: "/referral", label: "Referral", description: "Refer people and get free Premium access.", disabled: true }
        ]
    },
    { url: "/settings", label: "Settings", requiresAuth: true, isInvisibleInNav: true },
];