export const pages = [
    { url: '/dashboard', label: 'Dashboard', requiresAuth: true },
    { url: "/api", label: "API" },
    { url: "/integrations", label: "Integrations" },
    { url: "/pricing", label: "Pricing" },
    {
        label: "Resources",
        sublinks: [
            { url: "/blog", label: "Blog", description: "Learn more about email validation and sender reputation." },
            { url: "/referral", label: "Referral", description: "Share your referral link and get free Premium access.", disabled: true }
        ]
    },
    { url: "/settings", label: "Settings", requiresAuth: true, isInvisibleInNav: true },
];