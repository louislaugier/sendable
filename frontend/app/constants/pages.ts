export const pages = [
    { url: '/dashboard', label: 'Dashboard', requiresAuth: true },
    { url: "/integrations", label: "Integrations" },
    { url: "/pricing", label: "Pricing" },
    { url: "/api", label: "API" },
    {
        label: "Resources",
        sublinks: [
            { url: "/blog", label: "Blog", description: "Learn more about email validation and sender reputation." },
            { url: "/referral", label: "Referral", description: "Share your referral link and get 30% off your next bill.", disabled: true }
        ]
    },
    { url: "/settings", label: "Settings", requiresAuth: true, isInvisibleInNav: true },
];