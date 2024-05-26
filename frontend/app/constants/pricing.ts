import { siteName } from "./app";
import { limits } from "./limits";

export const pricingPlans = [
    {
        name: "Free",
        description: "Dive into email validation effortlessly with our free plan. Enjoy essential features at no cost.",
        monthlyPrice: "$0",
        yearlyPrice: "$0",
        features: [
            {
                content: `${limits.free.app.toLocaleString()} free monthly validations`,
                tooltip: `You can validate up to ${limits.free.app.toLocaleString()} email addresses every month for free using ${siteName}'s web interface.`
            },
            {
                content: "Bulk email validation",
            },
            {
                content: "Connect CRM platforms",
            },
            {
                content: `${limits.free.api.toLocaleString()} free API single validations`,
                tooltip: `You can validate up to ${limits.free.api.toLocaleString()} email addresses programmatically every month for free using ${siteName}'s API (${limits.free.apiConcurrency.toLocaleString()} validation at a time).`
            }
        ]
    },
    {
        name: "Premium",
        description: "Elevate your email validation with our premium offering, access advanced features tailored to your needs.",
        monthlyPrice: "$29",
        yearlyPrice: "$229",
        features: [
            {
                content: `${limits.premium.app.toLocaleString()} monthly validations`,
                tooltip: `You can validate up to ${limits.premium.app.toLocaleString()} email addresses every month for free using ${siteName}'s web interface.`
            },
            {
                content: "Bulk email validation",
            },
            {
                content: "Connect CRM platforms",
            },
            {
                content: `${limits.premium.api.toLocaleString()} API single validations`,
                tooltip: `You can validate up to ${limits.premium.api.toLocaleString()} email addresses programmatically every month using ${siteName}'s API (max ${limits.premium.apiConcurrency.toLocaleString()} concurrent validations).`
            },
            {
                content: "24 / 7 Support"
            }
        ]
    },
    {
        name: "Enterprise",
        description: "Scale your email validation seamlessly with our top-tier solution for high-volume requirements.",
        monthlyPrice: "$99",
        yearlyPrice: "$899",
        features: [
            {
                content: "Unlimited validations",
            },
            {
                content: "Bulk email validation",
            },
            {
                content: "Connect CRM platforms",
            },
            {
                content: "Unlimited API single validations",
            },
            {
                content: "Unlimited API bulk validations",
                tooltip: `You can validate as many email address batches as you want programmatically every month using ${siteName}'s API.\n Bulk validation batches are limited to 1 million email addresses, and only ${limits.free.apiConcurrency.toLocaleString()} batch${limits.free.apiConcurrency > 1 ? "es" : ""} can run at the same time. You can validate a batch by posting a file (TXT,CSV,XLS,XLSX) or a JSON payload.`
            },
            {
                content: "24 / 7 Support"
            }
        ]

    }
];