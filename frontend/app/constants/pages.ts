export const pages = [
    { url: '/dashboard?tab=validation', label: 'Dashboard', requiresAuth: true },
    { url: "/integrations", label: "Integrations" },
    { url: "/pricing", label: "Pricing" },
    { url: "/api", label: "API" },
    {
        label: "Resources",
        sublinks: [
            { url: "/blog", label: "Blog", description: "Learn more about email validation and sender reputation" },
            { url: "/faq", label: "FAQ", description: "Frequently asked questions"}
        ]
    },
    { url: "/settings", label: "Settings", requiresAuth: true, isInvisibleInNav: true },
];